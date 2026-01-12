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
import { AddDivisionForm } from "@/components/forms/add-division-form"

export default async function DivisionsPage({
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

    const divisions = await prisma.division.findMany({
        where: { tenantId: tenant.id },
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { users: true }
            }
        }
    })

    return (
        <div className="flex-1 space-y-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Divisions</h2>
                <div className="flex items-center space-x-2">
                    <AddDivisionForm tenantId={tenant.id} />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Division Name</TableHead>
                            <TableHead>Users Count</TableHead>
                            <TableHead>Created At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {divisions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                    No divisions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            divisions.map((div) => (
                                <TableRow key={div.id}>
                                    <TableCell className="font-medium">{div.name}</TableCell>
                                    <TableCell>{div._count.users}</TableCell>
                                    <TableCell>{div.createdAt.toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
