import { Suspense } from "react"
import { getCalls, getLocations } from "@/actions/call-actions"
import { CallsTable } from "@/components/calls/calls-table"
import { CallsFilter } from "@/components/calls/calls-filter"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function CallHistoryPage({
    params,
    searchParams
}: {
    params: Promise<{ tenantSlug: string }>
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const { tenantSlug } = await params
    const resolvedSearchParams = await searchParams

    const filter = {
        status: resolvedSearchParams.status,
        locationId: resolvedSearchParams.locationId,
        dateMode: resolvedSearchParams.dateMode as 'daily' | 'weekly' | 'monthly' | undefined,
        date: resolvedSearchParams.date ? new Date(resolvedSearchParams.date) : undefined
    }

    const [callsResult, locations] = await Promise.all([
        getCalls(tenantSlug, filter),
        getLocations(tenantSlug)
    ])

    const calls = callsResult.data || []

    return (
        <div className="flex-1 space-y-4 pt-2">
            <Card>
                <CardHeader>
                    <CardTitle>History</CardTitle>
                </CardHeader>
                <CardContent>
                    <CallsFilter locations={locations} />
                    <Suspense fallback={<div>Loading calls...</div>}>
                        <CallsTable calls={calls} />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}
