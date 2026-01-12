'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createCall } from "@/actions/call-actions"
import { AlertTriangle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface ReportButtonProps {
    machineId: string
    tenantId: string
}

export function ReportButton({ machineId, tenantId }: ReportButtonProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleReport = async () => {
        setLoading(true)
        try {
            const result = await createCall(machineId, tenantId)
            if (result.message === "success" || result.message === "Call already active") {
                router.refresh()
            }
        } catch (error) {
            console.error("Error reporting issue:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            onClick={handleReport}
            disabled={loading}
            className="w-full h-14 text-lg bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 animate-in fade-in zoom-in duration-300"
        >
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Reporting...
                </>
            ) : (
                <>
                    <AlertTriangle className="mr-2 h-6 w-6" />
                    REPORT ISSUE
                </>
            )}
        </Button>
    )
}
