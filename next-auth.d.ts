import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
    role: "ADMIN" | "TEAM";
};

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }

    interface User {
        role: "ADMIN" | "TEAM" | string;
    }
}

declare module "@auth/core/adapters" {
    interface AdapterUser {
        role: "ADMIN" | "TEAM" | string;
    }
}
