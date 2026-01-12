"use client"

import { useRouter } from "next/navigation"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface TvHeaderProps {
    tenantSlug: string
    divisions: { id: string; name: string }[]
    currentDivisionId: string
}

export function TvHeader({
    tenantSlug,
    divisions,
    currentDivisionId,
}: TvHeaderProps) {
    const router = useRouter()

    const handleDivisionChange = (divisionId: string) => {
        router.push(`/${tenantSlug}/views/${divisionId}`)
    }

    const currentDivisionName = divisions.find(d => d.id === currentDivisionId)?.name || "All Divisions"

    return (
        <div className="flex items-center justify-between p-6 bg-card border-b shadow-sm">
            <div>
                <h1 className="text-4xl font-bold tracking-tight text-primary">Active Calls</h1>
                <p className="text-xl text-muted-foreground mt-2">
                    {currentDivisionId === 'all' ? 'All Divisions' : currentDivisionName}
                </p>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-lg font-medium text-muted-foreground">Filter Division:</span>
                <Select
                    value={currentDivisionId}
                    onValueChange={handleDivisionChange}
                >
                    <SelectTrigger className="w-[280px] h-12 text-lg">
                        <SelectValue placeholder="Select Division" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all" className="text-lg py-3">All Divisions</SelectItem>
                        {divisions.map((division) => (
                            <SelectItem key={division.id} value={division.id} className="text-lg py-3">
                                {division.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
