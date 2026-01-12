"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { FileText } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

interface Call {
    id: string
    machine: {
        name: string
        code: string
        location: {
            name: string
        }
    }
    status: string
    createdAt: Date
    respondedAt?: Date
    resolvedAt?: Date
    responder?: {
        name: string | null
    } | null
    targetDivision?: {
        name: string
    } | null
}

interface CallsTableProps {
    calls: any[] // Using any for simplicity with complex Prisma types, can refine later
}

export function CallsTable({ calls }: CallsTableProps) {

    const getDuration = (start: Date, end?: Date) => {
        if (!end) return "-"
        const diff = new Date(end).getTime() - new Date(start).getTime()
        const minutes = Math.floor(diff / 60000)
        return `${minutes} min`
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "ACTIVE": return <Badge variant="destructive">Active</Badge>
            case "IN_PROGRESS": return <Badge className="bg-orange-500">In Progress</Badge>
            case "RESOLVED": return <Badge variant="secondary" className="bg-green-500 text-white">Resolved</Badge>
            default: return <Badge>{status}</Badge>
        }
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Machine</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Division</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Report</TableHead>
                        <TableHead>Responder</TableHead>
                        <TableHead>Duration</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {calls.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                                No calls found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        calls.map((call) => (
                            <TableRow key={call.id}>
                                <TableCell className="font-medium">
                                    {format(new Date(call.createdAt), "dd MMM HH:mm")}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{call.machine.name}</span>
                                        <span className="text-xs text-muted-foreground">{call.machine.code}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{call.machine.location.name}</TableCell>
                                <TableCell>{call.targetDivision?.name || "-"}</TableCell>
                                <TableCell>{getStatusBadge(call.status)}</TableCell>
                                <TableCell>
                                    {call.reports && call.reports.length > 0 ? (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                                                    <FileText className="h-4 w-4" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-2">
                                                    <h4 className="font-medium leading-none">Resolution Report</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {call.reports[0].content}
                                                    </p>
                                                    <div className="pt-2 text-xs text-gray-400">
                                                        {format(new Date(call.reports[0].createdAt), "PPpp")}
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    ) : (
                                        "-"
                                    )}
                                </TableCell>
                                <TableCell>{call.responder?.name || "-"}</TableCell>
                                <TableCell>
                                    {call.status === "RESOLVED"
                                        ? getDuration(call.createdAt, call.resolvedAt)
                                        : "-"
                                    }
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
