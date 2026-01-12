"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Loader2 } from "lucide-react"
import { resolveCall } from "@/actions/call-actions"
import { useRouter } from "next/navigation"

interface CallResolveDialogProps {
    callId: string
    resolverId: string
}

export function CallResolveDialog({ callId, resolverId }: CallResolveDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState("")
    const router = useRouter()

    const handleResolve = async () => {
        if (!report.trim()) return

        setLoading(true)
        try {
            await resolveCall(callId, report, resolverId)
            setOpen(false)
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    RESOLVE CALL
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Resolve Call</DialogTitle>
                    <DialogDescription>
                        Please provide a brief report of the resolution before closing this ticket.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Textarea
                        placeholder="Describe what was done to fix the issue..."
                        value={report}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReport(e.target.value)}
                        className="min-h-[100px]"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleResolve} disabled={loading || !report.trim()} className="bg-green-600 hover:bg-green-700">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Submit Report & Resolve
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
