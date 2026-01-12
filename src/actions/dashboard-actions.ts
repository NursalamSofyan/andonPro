'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function getTenantBySlug(slug: string) {
    const session = await auth()

    if (!session?.user) {
        return null
    }

    const tenant = await prisma.tenant.findUnique({
        where: { slug },
        include: {
            users: {
                include: {
                    division: true
                }
            }
        }
    })

    if (!tenant) return null

    // Verify usage access - simplistic check if user belongs to tenant
    // In a real app, you might check if session.user.id is in tenant.users or tenantId matches
    const userBelongsToTenant = tenant.users.some(u => u.id === session.user.id)

    if (!userBelongsToTenant) {
        // Optional: allow admin to see if designed that way, otherwise return null or error
        return null
    }

    return tenant
}

export async function getPublicTenantBySlug(slug: string) {
    const tenant = await prisma.tenant.findUnique({
        where: { slug },
        include: {
            users: {
                include: {
                    division: true
                }
            }
        }
    })

    return tenant
}

export async function getDashboardStats(tenantId: string) {
    const [machinesCount, activeCallsCount, usersCount] = await Promise.all([
        prisma.machine.count({ where: { tenantId } }),
        prisma.call.count({
            where: {
                tenantId,
                status: { not: "RESOLVED" }
            }
        }),
        prisma.user.count({ where: { tenantId } })
    ])

    return {
        machines: machinesCount,
        activeCalls: activeCallsCount,
        users: usersCount
    }
}

export async function getDailyCallStats(tenantSlug: string) {
    const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug },
        select: { id: true }
    })

    if (!tenant) return []

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const calls = await prisma.call.findMany({
        where: {
            tenantId: tenant.id,
            createdAt: {
                gte: start,
                lte: end
            }
        },
        select: {
            createdAt: true
        }
    })

    // Group by hour
    const hours = Array.from({ length: 24 }, (_, i) => ({
        name: `${i.toString().padStart(2, '0')}:00`,
        total: 0
    }))

    calls.forEach(call => {
        const hour = call.createdAt.getHours()
        if (hours[hour]) {
            hours[hour].total += 1
        }
    })

    return hours
}

export async function getAnalyticsStats(tenantId: string) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30); // Last 30 days

    const totalMachines = await prisma.machine.count({ where: { tenantId } });

    // Process calls for MTTR
    const resolvedCalls = await prisma.call.findMany({
        where: {
            tenantId,
            status: "RESOLVED",
            resolvedAt: { not: null },
            respondedAt: { not: null }, // Use respondedAt as start of repair
            createdAt: { gte: start }
        },
        select: {
            resolvedAt: true,
            respondedAt: true
        }
    });

    let totalRepairTimeMs = 0;
    resolvedCalls.forEach(call => {
        if (call.resolvedAt && call.respondedAt) {
            totalRepairTimeMs += (call.resolvedAt.getTime() - call.respondedAt.getTime());
        }
    });

    const mttrMinutes = resolvedCalls.length > 0
        ? Math.round((totalRepairTimeMs / resolvedCalls.length) / 1000 / 60)
        : 0;


    // Process for MTBF
    const totalCalls = await prisma.call.count({
        where: {
            tenantId,
            createdAt: { gte: start }
        }
    });

    // MTBF = (Total Time * Machines) / Total Failures
    // Total Time in hours, assuming 7 hours working day
    const totalHours = 30 * 7;
    const totalOperatingHours = totalHours * totalMachines;

    const mtbfHours = totalCalls > 0
        ? Math.round(totalOperatingHours / totalCalls)
        : 0; // If 0 calls, strictly it's undefined/infinite. Returning 0 or handling in UI is better.

    return {
        mttr: mttrMinutes, // minutes
        mtbf: mtbfHours // hours
    };
}

export async function getHourlyDowntime(tenantSlug: string) {
    const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug },
        select: { id: true }
    })

    if (!tenant) return []

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const [calls, machineCount] = await Promise.all([
        prisma.call.findMany({
            where: {
                tenantId: tenant.id,
                createdAt: {
                    gte: start,
                    lte: end
                },
                status: "RESOLVED"
            },
            select: {
                createdAt: true,
                respondedAt: true,
                resolvedAt: true
            }
        }),
        prisma.machine.count({
            where: { tenantId: tenant.id }
        })
    ]);

    const hours = Array.from({ length: 24 }, (_, i) => ({
        name: `${i.toString().padStart(2, '0')}:00`,
        downtime: 0,
        percentage: 0
    }))

    calls.forEach(call => {
        if (call.resolvedAt && call.createdAt) {
            const durationMs = call.resolvedAt.getTime() - call.createdAt.getTime();
            const durationMinutes = Math.round(durationMs / 1000 / 60);

            const hour = call.createdAt.getHours();
            if (hours[hour]) {
                hours[hour].downtime += durationMinutes;
            }
        }
    })

    // Calculate percentage based on total machine capacity per hour
    const totalCapacityMinutes = machineCount * 60;

    if (totalCapacityMinutes > 0) {
        hours.forEach(h => {
            h.percentage = Math.round((h.downtime / totalCapacityMinutes) * 100 * 10) / 10;
        });
    }

    return hours;
}

export type Period = 'daily' | 'weekly' | 'monthly'

export async function getMachineReports(tenantSlug: string, period: Period = 'monthly') {
    const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug },
        select: { id: true }
    })

    if (!tenant) return []

    const end = new Date();
    const start = new Date();

    // Set start date based on period
    if (period === 'daily') {
        start.setHours(0, 0, 0, 0); // Start of today
    } else if (period === 'weekly') {
        start.setDate(start.getDate() - 7); // Last 7 days
    } else {
        start.setDate(start.getDate() - 30); // Last 30 days (default)
    }

    const machines = await prisma.machine.findMany({
        where: { tenantId: tenant.id },
        include: {
            location: true,
            calls: {
                where: {
                    createdAt: { gte: start },
                    status: "RESOLVED"
                },
                select: {
                    createdAt: true,
                    resolvedAt: true,
                    respondedAt: true
                }
            }
        }
    })

    const reports = machines.map(machine => {
        const totalCalls = machine.calls.length;
        let totalDowntimeMinutes = 0;

        machine.calls.forEach(call => {
            if (call.resolvedAt) {
                const durationMs = call.resolvedAt.getTime() - call.createdAt.getTime();
                totalDowntimeMinutes += Math.round(durationMs / 1000 / 60);
            }
        });

        // Calculate Percentage
        // Determine total time in minutes based on period
        let totalTimeMinutes = 0;
        if (period === 'daily') {
            // For daily, use hours passed today or 7h working day
            totalTimeMinutes = 7 * 60;
        } else if (period === 'weekly') {
            totalTimeMinutes = 7 * 7 * 60;
        } else {
            totalTimeMinutes = 30 * 7 * 60;
        }

        const downtimePercentage = totalTimeMinutes > 0
            ? Math.round((totalDowntimeMinutes / totalTimeMinutes) * 100 * 10) / 10 // 1 decimal
            : 0;

        return {
            id: machine.id,
            name: machine.name,
            location: machine.location.name,
            totalCalls,
            totalDowntime: totalDowntimeMinutes,
            downtimePercentage
        }
    })

    return reports.sort((a, b) => b.downtimePercentage - a.downtimePercentage); // Sort by highest downtime
}

export async function getLocationReports(tenantSlug: string, period: Period = 'monthly') {
    const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug },
        select: { id: true }
    })

    if (!tenant) return []

    const end = new Date();
    const start = new Date();

    if (period === 'daily') {
        start.setHours(0, 0, 0, 0);
    } else if (period === 'weekly') {
        start.setDate(start.getDate() - 7);
    } else {
        start.setDate(start.getDate() - 30);
    }

    const locations = await prisma.location.findMany({
        where: { tenantId: tenant.id },
        include: {
            machines: {
                include: {
                    calls: {
                        where: {
                            createdAt: { gte: start },
                            status: "RESOLVED"
                        },
                        select: {
                            createdAt: true,
                            resolvedAt: true,
                            respondedAt: true
                        }
                    }
                }
            }
        }
    })

    const reports = locations.map(location => {
        let totalCalls = 0;
        let totalDowntimeMinutes = 0;
        const totalMachines = location.machines.length;

        location.machines.forEach(machine => {
            totalCalls += machine.calls.length;
            machine.calls.forEach(call => {
                if (call.resolvedAt) {
                    const durationMs = call.resolvedAt.getTime() - call.createdAt.getTime();
                    totalDowntimeMinutes += Math.round(durationMs / 1000 / 60);
                }
            });
        });

        // Calculate Percentage (Aggregate capacity of all machines in location)
        let totalTimeMinutes = 0;
        if (period === 'daily') {
            totalTimeMinutes = 7 * 60 * totalMachines;
        } else if (period === 'weekly') {
            totalTimeMinutes = 7 * 7 * 60 * totalMachines;
        } else {
            totalTimeMinutes = 30 * 7 * 60 * totalMachines;
        }
        const downtimePercentage = totalTimeMinutes > 0
            ? Math.round((totalDowntimeMinutes / totalTimeMinutes) * 100 * 10) / 10
            : 0;

        return {
            id: location.id,
            name: location.name,
            totalMachines,
            totalCalls,
            totalDowntime: totalDowntimeMinutes,
            downtimePercentage
        }
    })

    return reports.sort((a, b) => b.downtimePercentage - a.downtimePercentage);
}
