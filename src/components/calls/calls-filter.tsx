"use client"

import * as React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"

interface CallsFilterProps {
    locations: { id: string; name: string }[]
}

export function CallsFilter({ locations }: CallsFilterProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [status, setStatus] = React.useState(searchParams.get("status") || "ALL")
    const [locationId, setLocationId] = React.useState(searchParams.get("locationId") || "ALL")
    const [dateMode, setDateMode] = React.useState(searchParams.get("dateMode") || "daily")
    const [date, setDate] = React.useState(searchParams.get("date") || new Date().toISOString().split('T')[0])

    const handleApply = () => {
        const params = new URLSearchParams()
        if (status && status !== "ALL") params.set("status", status)
        if (locationId && locationId !== "ALL") params.set("locationId", locationId)
        if (dateMode) params.set("dateMode", dateMode)
        if (date) params.set("date", date)

        router.push(`?${params.toString()}`)
    }

    // Auto-apply filters when they change, or use a button? 
    // User asked for specific functionality. Let's provide a clear UI.
    // For date, standard input type="date" is simple and effective if no calendar component.

    return (
        <div className="flex flex-wrap gap-4 items-end mb-6 p-4 border rounded-lg bg-card">
            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Status</span>
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Statuses</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Location</span>
                <Select value={locationId} onValueChange={setLocationId}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Locations</SelectItem>
                        {locations.map((loc) => (
                            <SelectItem key={loc.id} value={loc.id}>
                                {loc.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Time Range</span>
                <Select value={dateMode} onValueChange={setDateMode}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Date</span>
                <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-[180px]"
                />
            </div>

            <Button onClick={handleApply}>Apply Filters</Button>
        </div>
    )
}
