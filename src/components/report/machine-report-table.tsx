"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface MachineReport {
    id: string
    name: string
    location: string
    totalCalls: number
    totalDowntime: number
    downtimePercentage: number
}

interface MachineReportTableProps {
    data: MachineReport[]
}

export function MachineReportTable({ data }: MachineReportTableProps) {
    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Machine Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Total Calls</TableHead>
                        <TableHead className="text-right">Total Downtime (m)</TableHead>
                        <TableHead className="text-right">Downtime %</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24">
                                No data found for the last 30 days.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="font-medium">{row.name}</TableCell>
                                <TableCell>{row.location}</TableCell>
                                <TableCell className="text-right">{row.totalCalls}</TableCell>
                                <TableCell className="text-right">{row.totalDowntime}m</TableCell>
                                <TableCell className="text-right">{row.downtimePercentage}%</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
