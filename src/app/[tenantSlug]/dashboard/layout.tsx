import { getTenantBySlug } from "@/actions/dashboard-actions"
import { Header } from "@/components/dashboard/header"
import { notFound } from "next/navigation"
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client"
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar"

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ tenantSlug: string }>
}) {
    const { tenantSlug } = await params

    const tenant = await getTenantBySlug(tenantSlug)

    if (!tenant) {
        notFound()
    }

    return (
        <DashboardLayoutClient tenantName={tenant.name} tenantSlug={tenantSlug}>
            <Header>
                <MobileSidebar tenantName={tenant.name} tenantSlug={tenantSlug} />
            </Header>
            <div className="p-6 h-full">
                {children}
            </div>
        </DashboardLayoutClient>
    )
}
