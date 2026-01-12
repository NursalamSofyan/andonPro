'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import bcrypt from "bcryptjs"

const CreateUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["ADMIN", "TEAM"]),
    divisionId: z.string().optional(),
    tenantId: z.string().min(1, "Tenant ID is required"),
})

export type UserFormState = {
    errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
        role?: string[]
        divisionId?: string[]
        _form?: string[]
    }
    message?: string
}

export async function createUser(prevState: UserFormState, formData: FormData): Promise<UserFormState> {
    const session = await auth()
    if (!session?.user) {
        return { message: "Unauthorized" }
    }

    // TODO: Add check if current user is ADMIN? For now assume any authed user can add team members (or rely on UI hiding)

    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: formData.get("role"),
        divisionId: formData.get("divisionId") || undefined, // Convert empty string to undefined
        tenantId: formData.get("tenantId"),
    }

    const validatedFields = CreateUserSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing fields. Failed to Create User.",
        }
    }

    const { name, email, password, role, divisionId, tenantId } = validatedFields.data

    // Check unique email
    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        return {
            message: "Email already in use."
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                divisionId: divisionId || null,
                tenantId,
            },
        })
    } catch (error) {
        return {
            message: "Database Error: Failed to Create User.",
        }
    }

    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } })
    if (tenant) {
        revalidatePath(`/${tenant.slug}/dashboard/team`)
    }

    return { message: "success" }
}
