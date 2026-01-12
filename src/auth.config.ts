import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    trustHost: true,
    pages: {
        signIn: "/auth/login",
        newUser: "/auth/register",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard") || nextUrl.pathname.includes("/dashboard")
            const isCallPage = nextUrl.pathname.includes("/call/")

            if (isCallPage) return true

            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                if (nextUrl.pathname.startsWith("/auth/login") || nextUrl.pathname.startsWith("/auth/register")) {
                    // @ts-ignore
                    const tenantSlug = auth.user.tenantSlug || "demo"
                    return Response.redirect(new URL(`/${tenantSlug}/dashboard`, nextUrl))
                }
            }
            return true
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            if (token.role && session.user) {
                // @ts-ignore
                session.user.role = token.role
            }
            if (token.tenantSlug && session.user) {
                // @ts-ignore
                session.user.tenantSlug = token.tenantSlug
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
                // @ts-ignore
                if (user.tenant) {
                    // @ts-ignore
                    token.tenantSlug = user.tenant.slug
                }
            }
            return token
        },
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
