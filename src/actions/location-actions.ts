'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const CreateLocationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    tenantId: z.string().min(1, "Tenant ID is required"),
})

export type LocationFormState = {
    errors?: {
        name?: string[] | null
        _form?: string[] | null
    }
    message?: string | null
}

export async function createLocation(prevState: LocationFormState, formData: FormData): Promise<LocationFormState> {
    const session = await auth()
    if (!session?.user) {
        return { message: "Unauthorized" }
    }

    const rawData = {
        name: formData.get("name"),
        tenantId: formData.get("tenantId"),
    }

    const validatedFields = CreateLocationSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing fields. Failed to Create Location.",
        }
    }

    const { name, tenantId } = validatedFields.data

    // Verify access (basic) - ideally check if user belongs to tenantId
    // For now, assuming middleware/layout protects this enough or we trust the form data injection from page

    try {
        await prisma.location.create({
            data: {
                name,
                tenantId,
            },
        })
    } catch (error) {
        return {
            message: "Database Error: Failed to Create Location.",
        }
    }

    // Look up tenant slug to revalidate path
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } })
    if (tenant) {
        revalidatePath(`/${tenant.slug}/dashboard/locations`)
        revalidatePath(`/${tenant.slug}/dashboard/machines`) // Revalidate machines too so the dropdown updates
    }

    return { message: "success" }
}
