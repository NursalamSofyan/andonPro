'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function getDivisions(tenantSlug: string) {
    const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug },
        select: { id: true }
    })

    if (!tenant) return []

    return prisma.division.findMany({
        where: { tenantId: tenant.id },
        select: { id: true, name: true }
    })
}

export async function getDivisionCalls(tenantSlug: string, divisionId: string) {
    const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug },
        select: { id: true }
    })

    if (!tenant) return []

    // If divisionId is 'all', fetch for all divisions, otherwise filter
    const whereCondition: any = {
        tenantId: tenant.id,
        status: { in: ['ACTIVE', 'IN_PROGRESS'] }
    }

    if (divisionId !== 'all') {
        whereCondition.targetDivisionId = divisionId
    }

    const calls = await prisma.call.findMany({
        where: whereCondition,
        include: {
            machine: {
                include: {
                    location: true
                }
            },
            targetDivision: true, // to show division name if 'all' is selected
        },
        orderBy: {
            createdAt: 'asc' // Oldest calls first
        }
    })

    return calls
}
