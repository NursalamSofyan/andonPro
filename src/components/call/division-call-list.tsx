'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createCall } from "@/actions/call-actions"
import { AlertTriangle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface Division {
    id: string
    name: string
}

interface DivisionCallListProps {
    machineId: string
    tenantId: string
    divisions: Division[]
}

export function DivisionCallList({ machineId, tenantId, divisions }: DivisionCallListProps) {
    const [loadingDivisionId, setLoadingDivisionId] = useState<string | null>(null)
    const router = useRouter()

    const handleReport = async (divisionId: string) => {
        setLoadingDivisionId(divisionId)
        try {
            const result = await createCall(machineId, tenantId, divisionId)
            if (result.message === "success" || result.message === "Call already active") {
                router.refresh()
            }
        } catch (error) {
            console.error("Error reporting issue:", error)
        } finally {
            setLoadingDivisionId(null)
        }
    }

    // If no divisions exist, show a generic call button that calls "General" (null divisionId)
    if (divisions.length === 0) {
        return (
            <Button
                onClick={() => handleReport("")}
                disabled={!!loadingDivisionId}
                className="w-full h-16 text-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 animate-in fade-in zoom-in"
            >
                {loadingDivisionId === "" ? (
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                ) : (
                    <AlertTriangle className="mr-2 h-6 w-6" />
                )}
                REPORT GENERAL ISSUE
            </Button>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-3 w-full">
            {divisions.map((div) => (
                <Button
                    key={div.id}
                    onClick={() => handleReport(div.id)}
                    disabled={!!loadingDivisionId}
                    size="lg"
                    className={cn(
                        "w-full h-14 text-lg justify-start px-6 shadow-md transition-all hover:scale-[1.02]",
                        // Alternating colors or just standard red? Let's use red for urgency.
                        "bg-white border-2 border-red-500 text-red-600 hover:bg-red-50"
                    )}
                >
                    {loadingDivisionId === div.id ? (
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    ) : (
                        <AlertTriangle className="mr-3 h-5 w-5" />
                    )}
                    Call {div.name}
                </Button>
            ))}
        </div>
    )
}
