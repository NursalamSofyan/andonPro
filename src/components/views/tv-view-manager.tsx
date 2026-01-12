"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { ActiveCallsTable } from "./active-calls-table"
import { getDivisionCalls } from "@/actions/view-actions"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"

interface Call {
    id: string
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

interface TvViewManagerProps {
    initialCalls: Call[]
    tenantSlug: string
    divisionId: string
}

export function TvViewManager({ initialCalls, tenantSlug, divisionId }: TvViewManagerProps) {
    const [calls, setCalls] = useState<Call[]>(initialCalls)
    const [audioEnabled, setAudioEnabled] = useState(true)
    const [language, setLanguage] = useState<'id' | 'en'>('id')

    // Store last announcement time for each call ID
    const lastAnnounced = useRef<Map<string, number>>(new Map(initialCalls.map(c => [c.id, Date.now()])))

    const fetchCalls = useCallback(async () => {
        try {
            const newCalls = await getDivisionCalls(tenantSlug, divisionId)
            setCalls(newCalls)

            const now = Date.now()
            const activeIds = new Set(newCalls.map(c => c.id))

            // Cleanup old IDs
            for (const id of lastAnnounced.current.keys()) {
                if (!activeIds.has(id)) {
                    lastAnnounced.current.delete(id)
                }
            }

            newCalls.forEach(call => {
                if (!lastAnnounced.current.has(call.id)) {
                    // New call found - Announce 2x
                    lastAnnounced.current.set(call.id, now)
                    announceCall(call, 2)
                } else {
                    // Existing call - Check for reminder (2 minutes)
                    const lastTime = lastAnnounced.current.get(call.id) || 0
                    if (now - lastTime >= 120000) { // 2 minutes in ms
                        lastAnnounced.current.set(call.id, now)
                        announceCall(call, 1) // Remind 1x
                    }
                }
            })
        } catch (error) {
            console.error("Failed to fetch calls:", error)
        }
    }, [tenantSlug, divisionId, language]) // Depend on language

    useEffect(() => {
        // Initial polling setup
        const interval = setInterval(fetchCalls, 5000)
        return () => clearInterval(interval)
    }, [fetchCalls])

    const announceCall = (call: Call, repeat: number = 1) => {
        if (!audioEnabled) return

        const divisionName = call.targetDivision?.name || "TIM MAINTENANCE"
        const machineName = call.machine.name
        const locationName = call.machine.location.name

        let text = ''

        if (language === 'id') {
            // "PERHATIAN // PANGGILAN KEPADA [division] DI [machine] / [LOCATION], HARAP SEGERA MENUJU LOKASI!"
            text = `PERHATIAN PERHATIAN. PANGGILAN KEPADA ${divisionName} DI ${machineName}, LOKASI ${locationName}. HARAP SEGERA MENUJU LOKASI!`
        } else {
            // EN: "ATTENTION. CALL FOR [division] AT [machine], LOCATION [location]. PLEASE PROCEED TO LOCATION!"
            text = `ATTENTION PLEASE. CALL FOR ${divisionName} AT ${machineName}, LOCATION ${locationName}. PLEASE PROCEED TO LOCATION IMMEDIATELY!`
        }

        const utterAndSpeak = () => {
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.lang = language === 'id' ? 'id-ID' : 'en-US'
            utterance.rate = 0.9
            window.speechSynthesis.speak(utterance)
        }

        // Queue announcements
        for (let i = 0; i < repeat; i++) {
            utterAndSpeak()
        }
    }

    const toggleAudio = () => {
        setAudioEnabled(!audioEnabled)
        if (!audioEnabled && calls.length > 0) {
            const text = language === 'id' ? "Sistem Suara Diaktifkan" : "Audio System Enabled"
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.lang = language === 'id' ? 'id-ID' : 'en-US'
            window.speechSynthesis.speak(utterance)
        }
    }

    const toggleLanguage = () => {
        const newLang = language === 'id' ? 'en' : 'id'
        setLanguage(newLang)

        // Announce language change
        const text = newLang === 'id' ? "Bahasa Indonesia Dipilih" : "English Language Selected"
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = newLang === 'id' ? 'id-ID' : 'en-US'
        if (audioEnabled) {
            window.speechSynthesis.speak(utterance)
        }
    }

    return (
        <div className="relative">
            <div className="absolute top-[-110px] right-0 z-10 flex gap-2">
                {/* Positioned in header area roughly */}
                <Button
                    onClick={toggleLanguage}
                    variant="outline"
                    className="w-12 font-bold"
                >
                    {language.toUpperCase()}
                </Button>

                <Button
                    onClick={toggleAudio}
                    variant={audioEnabled ? "outline" : "destructive"}
                    className="gap-2"
                >
                    {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    {audioEnabled ? "Audio On" : "Enable Audio"}
                </Button>
            </div>

            <ActiveCallsTable calls={calls} />
        </div>
    )
}
