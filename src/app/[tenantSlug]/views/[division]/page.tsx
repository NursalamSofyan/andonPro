
import { getDivisions, getDivisionCalls } from "@/actions/view-actions"
import { TvViewManager } from "@/components/views/tv-view-manager"
import { TvHeader } from "@/components/views/tv-header"
import { getTenantBySlug } from "@/actions/dashboard-actions"
import { notFound } from "next/navigation"

interface ViewPageProps {
    params: Promise<{
        tenantSlug: string
        division: string
    }>
}

// Refresh every 30 seconds
export const revalidate = 30

export default async function ViewPage({ params }: ViewPageProps) {
    const { tenantSlug, division } = await params

    const tenant = await getTenantBySlug(tenantSlug)
    if (!tenant) notFound()

    const divisions = await getDivisions(tenantSlug)
    const activeCalls = await getDivisionCalls(tenantSlug, division)

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <TvHeader
                tenantSlug={tenantSlug}
                divisions={divisions}
                currentDivisionId={division}
            />

            <main className="flex-1 p-6">
                <div className="mx-auto max-w-[1920px]">
                    <TvViewManager
                        initialCalls={activeCalls}
                        tenantSlug={tenantSlug}
                        divisionId={division}
                    />
                </div>
            </main>
        </div>
    )
}
