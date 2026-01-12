'use server'

import { signIn } from "@/auth"
import { prisma } from "@/lib/prisma"
import { AuthError } from "next-auth"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { LoginSchema, RegisterSchema } from "@/schemas"

export async function login(values: z.infer<typeof LoginSchema>, callbackUrl?: string | null) {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password } = validatedFields.data;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { tenant: true }
        })

        await signIn("credentials", {
            email,
            password,
            redirectTo: callbackUrl || (user?.tenant?.slug ? `/${user.tenant.slug}/dashboard` : "/dashboard"),
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" }
                default:
                    return { error: "Something went wrong!" }
            }
        }
        throw error;
    }
}

export async function register(values: z.infer<typeof RegisterSchema>) {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password, name, tenantName } = validatedFields.data; // Added tenantName

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return { error: "Email already in use!" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate slug
        const slug = tenantName
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '') + "-" + Math.random().toString(36).substring(2, 7);

        const tenant = await prisma.tenant.create({
            data: {
                name: tenantName,
                slug: slug,
            },
        });

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "ADMIN",
                tenantId: tenant.id,
            },
        });

        // Verification token logic could go here
        return { success: "User created!" };

    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Something went wrong!" }; // Generic error
    }
}
