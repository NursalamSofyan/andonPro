'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const CreateDivisionSchema = z.object({
    name: z.string().min(1, "Name is required"),
    tenantId: z.string().min(1, "Tenant ID is required"),
})

export type DivisionFormState = {
    errors?: {
        name?: string[]
        _form?: string[]
    }
    message?: string
}

export async function createDivision(prevState: DivisionFormState, formData: FormData): Promise<DivisionFormState> {
    const session = await auth()
    if (!session?.user) {
        return { message: "Unauthorized" }
    }

    const rawData = {
        name: formData.get("name"),
        tenantId: formData.get("tenantId"),
    }

    const validatedFields = CreateDivisionSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing fields. Failed to Create Division.",
        }
    }

    const { name, tenantId } = validatedFields.data

    try {
        await prisma.division.create({
            data: {
                name,
                tenantId,
            },
        })
    } catch (error) {
        return {
            message: "Database Error: Failed to Create Division.",
        }
    }

    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } })
    if (tenant) {
        revalidatePath(`/${tenant.slug}/dashboard/divisions`)
    }

    return { message: "success" }
}
