"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface LocationReport {
    id: string
    name: string
    totalMachines: number
    totalCalls: number
    totalDowntime: number
    downtimePercentage: number
}

interface LocationReportTableProps {
    data: LocationReport[]
}

export function LocationReportTable({ data }: LocationReportTableProps) {
    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Location Name</TableHead>
                        <TableHead className="text-right">Machines</TableHead>
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
                                <TableCell className="text-right">{row.totalMachines}</TableCell>
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
