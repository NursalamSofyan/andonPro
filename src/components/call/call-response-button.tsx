"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { respondToCall } from "@/actions/call-actions"
import { useRouter } from "next/navigation"
import { Loader2, Play } from "lucide-react"

interface CallResponseButtonProps {
    callId: string
    responderId: string
    isResponderDivsion: boolean
    status: string
}

import { CallResolveDialog } from "./call-resolve-dialog"

export function CallResponseButton({ callId, responderId, isResponderDivsion, status }: CallResponseButtonProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleRespond = async () => {
        setLoading(true)
        try {
            await respondToCall(callId, responderId)
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (!isResponderDivsion) {
        return (
            <Button className="mt-4 w-full" variant="outline" disabled>
                {status === "IN_PROGRESS" ? "Call In Progress" : "Call Active"}
            </Button>
        )
    }

    if (status === "IN_PROGRESS") {
        return <CallResolveDialog callId={callId} resolverId={responderId} />
    }

    return (
        <Button
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleRespond}
            disabled={loading}
        >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
            RESPOND TO CALL
        </Button>
    )
}
