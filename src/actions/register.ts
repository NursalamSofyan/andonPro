"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { RegisterSchema } from "@/schemas";
// import { getUserByEmail } from "@/data/user"; // Need to create data access layer eventually

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password, name, tenantName } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { error: "Email already in use!" };
    }

    // Create Tenant Slug
    const slug = tenantName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    // Check if tenant slug exists
    const existingTenant = await prisma.tenant.findUnique({
        where: { slug }
    })

    // Start transaction to create tenant and user
    try {
        await prisma.$transaction(async (tx: any) => {
            let tenantId = "";

            if (existingTenant) {
                // For simplicity in MVP, if tenant exists, we might error or just join?
                // Let's assume new registration = new tenant for now, or error if taken.
                throw new Error("Tenant name already taken (slug collision).");
            } else {
                const tenant = await tx.tenant.create({
                    data: {
                        name: tenantName,
                        slug,
                    }
                });
                tenantId = tenant.id;
            }

            await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    tenantId,
                    role: "ADMIN" // First user is Admin
                }
            })
        });

        return { success: "Account created!" };
    } catch (err) {
        return { error: (err as Error).message || "Something went wrong!" };
    }
};
