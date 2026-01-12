import { getTenantBySlug, getMachineReports, getLocationReports, Period } from "@/actions/dashboard-actions"
import { notFound } from "next/navigation"
import { MachineReportTable } from "@/components/report/machine-report-table"
import { LocationReportTable } from "@/components/report/location-report-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PeriodFilter } from "@/components/report/period-filter"

export default async function ReportPage({
    params,
    searchParams,
}: {
    params: Promise<{ tenantSlug: string }>
    searchParams: Promise<{ period?: string }>
}) {
    const { tenantSlug } = await params
    const { period } = await searchParams

    const validPeriod: Period = (period as Period) || 'monthly'

    const tenant = await getTenantBySlug(tenantSlug)

    if (!tenant) notFound()

    const [machineData, locationData] = await Promise.all([
        getMachineReports(tenantSlug, validPeriod),
        getLocationReports(tenantSlug, validPeriod)
    ])

    return (
        <div className="flex-1 space-y-4 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Performance Report</h2>
                    <p className="text-muted-foreground capitalize">{validPeriod} Report</p>
                </div>
                <PeriodFilter />
            </div>

            <Tabs defaultValue="machines" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="machines">By Machine</TabsTrigger>
                    <TabsTrigger value="locations">By Location</TabsTrigger>
                </TabsList>
                <TabsContent value="machines" className="space-y-4">
                    <div className="rounded-lg shadow-sm p-4 bg-accent">
                        <h3 className="text-lg font-medium mb-4">Machine Performance</h3>
                        <MachineReportTable data={machineData} />
                    </div>
                </TabsContent>
                <TabsContent value="locations" className="space-y-4">
                    <div className="rounded-lg shadow-sm p-4 bg-accent">
                        <h3 className="text-lg font-medium mb-4">Location Performance</h3>
                        <LocationReportTable data={locationData} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
