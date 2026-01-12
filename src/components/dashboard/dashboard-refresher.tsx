'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function DashboardRefresher() {
    const router = useRouter()

    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh()
        }, 15000) // 15 seconds refresh

        return () => clearInterval(interval)
    }, [router])

    return null
}
