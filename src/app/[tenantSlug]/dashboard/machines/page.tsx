import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AddMachineForm } from "@/components/forms/add-machine-form"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { QrCode } from "lucide-react"

export default async function MachinesPage({
    params,
}: {
    params: Promise<{ tenantSlug: string }>
}) {
    const { tenantSlug } = await params
    const session = await auth()

    if (!session?.user) redirect("/auth/login")

    const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug },
    })

    if (!tenant) notFound()

    const locations = await prisma.location.findMany({
        where: { tenantId: tenant.id },
        select: { id: true, name: true },
    })

    const machines = await prisma.machine.findMany({
        where: { tenantId: tenant.id },
        include: { location: true },
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="flex-1 space-y-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Machines</h2>
                <div className="flex items-center space-x-2">
                    <AddMachineForm tenantId={tenant.id} locations={locations} />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Machine Name</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {machines.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No machines found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            machines.map((machine) => (
                                <TableRow key={machine.id}>
                                    <TableCell className="font-medium">{machine.name}</TableCell>
                                    <TableCell>{machine.code}</TableCell>
                                    <TableCell>{machine.location.name}</TableCell>
                                    <TableCell>Active</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/${tenantSlug}/dashboard/machines/${machine.id}/qrcode`} title="View QR Code">
                                                <QrCode className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
