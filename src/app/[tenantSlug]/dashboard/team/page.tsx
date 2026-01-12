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
import { AddTeamMemberForm } from "@/components/forms/add-team-member-form"
import { Badge } from "@/components/ui/badge"

export default async function TeamPage({
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

    // Fetch users and divisions
    const users = await prisma.user.findMany({
        where: { tenantId: tenant.id },
        include: { division: true },
        orderBy: { createdAt: "desc" }
    })

    const divisions = await prisma.division.findMany({
        where: { tenantId: tenant.id },
        select: { id: true, name: true }
    })

    return (
        <div className="flex-1 space-y-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Team Members</h2>
                <div className="flex items-center space-x-2">
                    <AddTeamMemberForm tenantId={tenant.id!} divisions={divisions} />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Division</TableHead>
                            <TableHead>Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No team members found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{user.division?.name || '-'}</TableCell>
                                    <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
