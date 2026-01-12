import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DivisionCallList } from "@/components/call/division-call-list"
import Link from "next/link"
import { auth } from "@/auth"
import { CallResponseButton } from "@/components/call/call-response-button"
import { getPublicTenantBySlug } from "@/actions/dashboard-actions"


interface PageProps {
    params: Promise<{
        tenantSlug: string
        machineId: string
    }>
}

export default async function PublicCallPage(props: PageProps) {
    const params = await props.params;
    const { tenantSlug, machineId } = params

    const machine = await prisma.machine.findUnique({
        where: { id: machineId },
        include: {
            location: true,
            calls: {
                where: { status: { not: "RESOLVED" } },
                orderBy: { createdAt: "desc" },
                take: 1,
                include: {
                    targetDivision: true
                }
            }
        }
    })

    // Basic tenant verification
    const tenant = await getPublicTenantBySlug(tenantSlug)

    if (!tenant || !machine || machine.tenantId !== tenant.id) {
        notFound()
    }

    const activeCall = machine.calls[0]

    const divisions = await prisma.division.findMany({
        where: { tenantId: tenant.id }
    })

    // Fetch session
    const session = await auth()
    const user = tenant?.users.find((user) => user.id === session?.user?.id)

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 text-center border-b">
                    <h1 className="text-xl font-bold text-gray-900">{tenant.name}</h1>
                    <p className="text-sm text-gray-500">Andon Call System</p>
                </div>

                <div className="p-8 text-center space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold text-blue-600">{machine.name}</h2>
                        <p className="text-lg text-gray-600">{machine.location.name}</p>
                        <p className="text-sm text-gray-400 font-mono mt-1">CODE: {machine.code}</p>
                    </div>

                    <div className="py-6">
                        {activeCall ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <p className="text-amber-800 font-medium">
                                    Status: {activeCall.status}
                                </p>
                                {activeCall.targetDivision && (
                                    <p className="text-sm font-bold text-amber-900 mt-1">
                                        For: {activeCall.targetDivision.name}
                                    </p>
                                )}
                                <p className="text-xs text-amber-600 mt-1">Reported at {activeCall.createdAt.toLocaleString()}</p>

                                <CallResponseButton
                                    callId={activeCall.id}
                                    responderId={user?.id || ""}
                                    isResponderDivsion={!!(user && user.divisionId === activeCall.targetDivisionId)}
                                    status={activeCall.status}
                                />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                                    Scan verified. Select a department to call:
                                </div>
                                <DivisionCallList
                                    machineId={machine.id}
                                    tenantId={tenant.id}
                                    divisions={divisions}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-gray-50 p-4 text-center space-y-2">
                    <p className="text-xs text-gray-400">Machine ID: {machine.id}</p>
                    {user ? (
                        <>
                            <p className="text-xs text-green-600 font-medium">
                                Logged in as: {user.name} | {user.division?.name}
                            </p>
                        </>
                    ) : (
                        <Link
                            href={`/auth/login?callbackUrl=${encodeURIComponent(`/${tenantSlug}/call/${machineId}`)}`}
                            className="text-xs text-blue-600 hover:underline"
                        >
                            Staff Login
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}
