import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { AddLocationForm } from "@/components/forms/add-location-form"

export default async function LocationsPage({
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
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { machines: true }
            }
        }
    })

    return (
        <div className="flex-1 space-y-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Locations</h2>
                <div className="flex items-center space-x-2">
                    <AddLocationForm tenantId={tenant.id} />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Location Name</TableHead>
                            <TableHead>Machines Count</TableHead>
                            <TableHead>Created At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {locations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                    No locations found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            locations.map((loc) => (
                                <TableRow key={loc.id}>
                                    <TableCell className="font-medium">{loc.name}</TableCell>
                                    <TableCell>{loc._count.machines}</TableCell>
                                    <TableCell>{loc.createdAt.toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
