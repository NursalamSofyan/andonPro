'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const CreateMachineSchema = z.object({
    name: z.string().min(1, "Name is required"),
    code: z.string().min(1, "Code is required").regex(/^[A-Za-z0-9_-]+$/, "Code must be alphanumeric (hyphens/underscores allowed)"),
    locationId: z.string().min(1, "Location is required"),
    tenantId: z.string().min(1, "Tenant ID is required"),
})

export type MachineFormState = {
    errors?: {
        name?: string[]
        code?: string[]
        locationId?: string[]
        _form?: string[]
    }
    message?: string
}

export async function createMachine(prevState: MachineFormState, formData: FormData): Promise<MachineFormState> {
    const session = await auth()
    if (!session?.user) {
        return { message: "Unauthorized" }
    }

    const rawData = {
        name: formData.get("name"),
        code: formData.get("code"),
        locationId: formData.get("locationId"),
        tenantId: formData.get("tenantId"),
    }

    const validatedFields = CreateMachineSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing fields. Failed to Create Machine.",
        }
    }

    const { name, code, locationId, tenantId } = validatedFields.data

    // Verify tenant ownership/access
    // simplistic check: ensure the location belongs to the tenant
    const location = await prisma.location.findUnique({
        where: { id: locationId },
    })

    if (!location || location.tenantId !== tenantId) {
        return { message: "Invalid location selected." }
    }

    try {
        await prisma.machine.create({
            data: {
                name,
                code, // Enforce uniqueness in DB, handle error if duplicate
                locationId,
                tenantId,
            },
        })
    } catch (error: any) {
        if (error.code === 'P2002') {
            return {
                errors: {
                    code: ["This machine code already exists in this tenant."]
                },
                message: "Database Error"
            }
        }
        return {
            message: "Database Error: Failed to Create Machine.",
        }
    }

    // Revalidate the machines list page
    // We don't have the slug handy here easily unless we pass it, but we can revalidate based on path pattern if needed
    // Or just revalidate the specific path if we passed the slug.
    // For now, let's just return success and let client handle redirect or refresh.
    // Actually, revalidatePath works best with exact path or layout.
    // Let's assume we revalidate the dashboard machines page. 
    // Since we don't have the slug in the args, we'd need to fetch the tenant slug or pass it.

    // Let's look up the tenant slug for revalidation using the ID
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } })
    if (tenant) {
        revalidatePath(`/${tenant.slug}/dashboard/machines`)
    }

    return { message: "success" }
}
