'use server'

import { prisma } from "@/lib/prisma"
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"
import { revalidatePath } from "next/cache"

export type CallFilter = {
    status?: string
    locationId?: string
    dateMode?: 'daily' | 'weekly' | 'monthly'
    date?: Date
}

export async function getCalls(tenantSlug: string, filter?: CallFilter) {
    const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug },
        select: { id: true }
    })

    if (!tenant) return { error: "Tenant not found" }

    const where: any = {
        tenantId: tenant.id,
    }

    if (filter?.status && filter.status !== "ALL") {
        where.status = filter.status
    }

    if (filter?.locationId && filter.locationId !== "ALL") {
        where.machine = {
            locationId: filter.locationId
        }
    }

    if (filter?.dateMode) {
        const date = filter.date || new Date()

        if (filter.dateMode === 'daily') {
            where.createdAt = {
                gte: startOfDay(date),
                lte: endOfDay(date)
            }
        } else if (filter.dateMode === 'weekly') {
            where.createdAt = {
                gte: startOfWeek(date, { weekStartsOn: 1 }),
                lte: endOfWeek(date, { weekStartsOn: 1 })
            }
        } else if (filter.dateMode === 'monthly') {
            where.createdAt = {
                gte: startOfMonth(date),
                lte: endOfMonth(date)
            }
        }
    }

    try {
        const calls = await prisma.call.findMany({
            where,
            include: {
                machine: {
                    include: {
                        location: true
                    }
                },
                targetDivision: true,
                responder: true,
                reports: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return { success: true, data: calls }
    } catch (error) {
        console.error("Error fetching calls:", error)
        return { error: "Failed to fetch calls" }
    }
}

export async function getLocations(tenantSlug: string) {
    const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug },
        select: { id: true }
    })

    if (!tenant) return []

    return prisma.location.findMany({
        where: { tenantId: tenant.id }
    })
}

import { sendTelegramMessage } from "@/lib/telegram"

export async function createCall(machineId: string, tenantId: string, divisionId?: string) {
    try {
        const existingCall = await prisma.call.findFirst({
            where: {
                machineId,
                status: { not: "RESOLVED" }
            }
        })

        if (existingCall) {
            return { message: "Call already active" }
        }

        const call = await prisma.call.create({
            data: {
                machineId,
                tenantId,
                status: "ACTIVE",
                targetDivisionId: divisionId || undefined,
            },
            include: {
                machine: {
                    include: {
                        location: true
                    }
                },
                targetDivision: true
            }
        })

        // Send Telegram Notification
        const machineName = call.machine.name;
        const locationName = call.machine.location.name;
        const divisionName = call.targetDivision?.name || "Maintenance";
        const time = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
        const callNumber = call.number;

        const message = `🚨 **ANDON ALERT** #${callNumber}\n\n` +
            `**Machine:** ${machineName}\n` +
            `**Location:** ${locationName}\n` +
            `**Division:** ${divisionName}\n` +
            `**Time:** ${time}\n\n` +
            `Please respond immediately!`;

        await sendTelegramMessage(message);

        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId },
            select: { slug: true }
        })

        if (tenant) {
            revalidatePath(`/${tenant.slug}/call/${machineId}`)
        }
        revalidatePath("/dashboard/calls")

        return { message: "success" }
    } catch (error) {
        console.error("Error creating call:", error)
        return { message: "error" }
    }
}

export async function respondToCall(callId: string, responderId: string) {
    try {
        const call = await prisma.call.update({
            where: { id: callId },
            data: {
                status: "IN_PROGRESS",
                respondedAt: new Date(),
                responderId: responderId
            },
            include: {
                machine: {
                    include: {
                        location: true
                    }
                },
                targetDivision: true,
                responder: true
            }
        })

        // Telegram Notification
        const responderName = call.responder?.name || "Unknown";
        const machineName = call.machine.name;
        const locationName = call.machine.location.name;
        const time = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
        const callNumber = call.number;

        const message = `👷 **CALL RESPONSE** #${callNumber}\n\n` +
            `**Machine:** ${machineName}\n` +
            `**Location:** ${locationName}\n` +
            `**Responder:** ${responderName}\n` +
            `**Time:** ${time}\n\n` +
            `Technician is on the way.`;

        await sendTelegramMessage(message);

        return { message: "success" }
    } catch (error) {
        console.error("Error responding to call:", error)
        return { message: "error" }
    }
}


export async function resolveCall(callId: string, reportContent: string, resolverId: string) {
    try {
        // We need to fetch details for notification, so we'll do the update and fetch in transaction or just fetch result
        // Since we are using a transaction for report creation, let's keep it simple and fetch after or returning from update if supported by SQLite adapter interactions (it is).

        let callDetails: any;

        await prisma.$transaction(async (tx) => {
            const call = await tx.call.update({
                where: { id: callId },
                data: {
                    status: "RESOLVED",
                    resolvedAt: new Date(),
                },
                include: {
                    machine: {
                        include: {
                            location: true
                        }
                    },
                    targetDivision: true,
                    responder: true // Initial responder
                }
            })

            callDetails = call;

            await tx.report.create({
                data: {
                    content: reportContent,
                    callId: callId
                }
            })
        })
        revalidatePath("/dashboard/calls")

        // Telegram Notification
        if (callDetails) {
            const machineName = callDetails.machine.name;
            const locationName = callDetails.machine.location.name;
            // resolverId usage? Typically responder solves it, but maybe we want to fetch the user who resolved if different?
            // For now assuming responder/resolver context. 
            // We can fetch the resolver user name if needed, but let's use the report content.

            const time = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
            const callNumber = callDetails.number;

            const message = `✅ **CALL RESOLVED** #${callNumber}\n\n` +
                `**Machine:** ${machineName}\n` +
                `**Location:** ${locationName}\n` +
                `**Report:** ${reportContent}\n` +
                `**Time:** ${time}\n\n` +
                `Issue has been resolved.`;

            await sendTelegramMessage(message);
        }

        return { message: "success" }
    } catch (error) {
        console.error("Error resolving call:", error)
        return { message: "error" }
    }
}
