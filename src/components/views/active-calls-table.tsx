"use client"

import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface Call {
    id: string
    number: number
    status: string
    content: string | null
    createdAt: Date
    machine: {
        name: string
        location: {
            name: string
        }
    }
    targetDivision?: {
        name: string
    } | null
}

interface ActiveCallsTableProps {
    calls: Call[]
}

export function ActiveCallsTable({ calls }: ActiveCallsTableProps) {
    if (calls.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-24 h-24 mb-4 opacity-50"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                </svg>
                <div className="text-3xl font-medium">All Systems Operational</div>
                <p className="text-xl mt-2">No active calls at this moment.</p>
            </div>
        )
    }

    return (
        <div className="w-full overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="bg-muted/50 p-4 grid grid-cols-12 gap-4 border-b font-semibold text-lg text-muted-foreground">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Time Pending</div>
                <div className="col-span-2">Location</div>
                <div className="col-span-2">Machine</div>
                <div className="col-span-3">Issue / Details</div>
            </div>
            <div className="divide-y">
                {calls.map((call) => {
                    const isUrgent = call.status === "ACTIVE"
                    // const rowClass = isUrgent ? "bg-red-50 dark:bg-red-950/20" : "bg-yellow-50 dark:bg-yellow-950/20"
                    // Keeping it clean for now, using Badges for status

                    return (
                        <div key={call.id} className="p-4 grid grid-cols-12 gap-4 items-center text-xl hover:bg-muted/20 transition-colors">
                            <div className="col-span-1 text-center font-mono font-bold text-slate-500">
                                {call.number}
                            </div>
                            <div className="col-span-2">
                                <Badge
                                    className={`text-lg px-4 py-1 justify-center ${call.status === 'ACTIVE'
                                        ? "bg-red-500 hover:bg-red-600 animate-pulse"
                                        : "bg-amber-500 hover:bg-amber-600"
                                        }`}
                                >
                                    {call.status}
                                </Badge>
                            </div>
                            <div className="col-span-2 font-mono text-2xl font-bold text-red-600 dark:text-red-400">
                                {formatDistanceToNow(new Date(call.createdAt), { addSuffix: false })}
                            </div>
                            <div className="col-span-2 font-medium">
                                {call.machine.location.name}
                            </div>
                            <div className="col-span-2">
                                <span className="font-bold">{call.machine.name}</span>
                            </div>
                            <div className="col-span-3 text-muted-foreground truncate">
                                {call.content || "No description provided"}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
