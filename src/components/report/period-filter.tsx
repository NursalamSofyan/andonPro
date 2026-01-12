"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"

export function PeriodFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Default to 'monthly' if not specified
    const currentPeriod = searchParams.get("period") || "monthly"

    const onValueChange = (value: string) => {
        const params = new URLSearchParams(searchParams)
        params.set("period", value)
        // Keep other params if any, or just push.
        // Replace to avoid cluttering history stack too much, or push is fine.
        router.push(`?${params.toString()}`)
        router.refresh()
    }

    return (
        <Select value={currentPeriod} onValueChange={onValueChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="daily">Daily (Today)</SelectItem>
                <SelectItem value="weekly">Weekly (Last 7 Days)</SelectItem>
                <SelectItem value="monthly">Monthly (Last 30 Days)</SelectItem>
            </SelectContent>
        </Select>
    )
}
