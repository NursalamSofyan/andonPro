import { getDashboardStats, getTenantBySlug, getDailyCallStats, getAnalyticsStats, getHourlyDowntime } from "@/actions/dashboard-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { notFound } from "next/navigation"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { DashboardRefresher } from "@/components/dashboard/dashboard-refresher"
import { DowntimeChart } from "@/components/dashboard/downtime-chart"


export default async function DashboardPage({
    params,
}: {
    params: Promise<{ tenantSlug: string }>
}) {
    const { tenantSlug } = await params
    const tenant = await getTenantBySlug(tenantSlug)

    if (!tenant) notFound()

    const [stats, dailyStats, analytics, hourlyDowntime] = await Promise.all([
        getDashboardStats(tenant.id),
        getDailyCallStats(tenantSlug),
        getAnalyticsStats(tenant.id),
        getHourlyDowntime(tenantSlug)
    ])

    return (
        <div className="flex-1 space-y-4">
            <DashboardRefresher />
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <a
                        href={`/${tenantSlug}/views/all`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-4 w-4"
                        >
                            <rect width="20" height="15" x="2" y="7" rx="2" ry="2" />
                            <polyline points="17 2 12 7 7 2" />
                        </svg>
                        Launch TV Mode
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Machines
                        </CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.machines}</div>
                        <p className="text-xs text-muted-foreground">
                            Registered in {tenant.name}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Calls
                        </CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M12 2v20M2 12h20" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeCalls}</div>
                        <p className="text-xs text-muted-foreground">
                            Currently active
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.users}</div>
                        <p className="text-xs text-muted-foreground">
                            Team members
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 w-full border">
                <div className="col-span-2 lg:col-span-2 md:grid gap-4 md:grid-cols-2">
                    <Card className="flex flex-col col-span-1 lg:col-span-2 md:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">MTTR (Avg Repair)</CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <path d="M12 6v6l4 2" />
                                <circle cx="12" cy="12" r="10" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.mttr}m</div>
                            <p className="text-xs text-muted-foreground">
                                Last 30 Days
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="flex flex-col col-span-1 lg:col-span-2 md:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">MTBF (Reliability)</CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.mtbf}h</div>
                            <p className="text-xs text-muted-foreground">
                                Avg failure interval
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <Card className="col-span-2 lg:col-span-5">
                    <CardHeader>
                        <CardTitle>Calls Overview (Today)</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-hidden pl-2">
                        <OverviewChart data={dailyStats} />
                    </CardContent>
                </Card>
                <Card className="col-span-2 lg:col-span-7">
                    <CardHeader>
                        <CardTitle>Downtime History (Today)</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-hidden pl-2">
                        <DowntimeChart data={hourlyDowntime} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
