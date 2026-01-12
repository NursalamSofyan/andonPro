"use client"

import React, { useEffect, useState } from "react"
import QRCode from "qrcode"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface QrCodeDisplayProps {
    value: string
    width?: number
    downloadFileName?: string
}

export function QrCodeDisplay({
    value,
    width = 200,
    downloadFileName = "qrcode",
}: QrCodeDisplayProps) {
    const [src, setSrc] = useState<string>("")

    useEffect(() => {
        QRCode.toDataURL(value, { width, margin: 2 })
            .then(setSrc)
            .catch((err) => {
                console.error("Error generating QR code", err)
            })
    }, [value, width])

    const handleDownload = () => {
        if (!src) return
        const link = document.createElement("a")
        link.href = src
        link.download = `${downloadFileName}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    if (!src) {
        return <div className="animate-pulse bg-gray-200" style={{ width, height: width }} />
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <img src={src} alt={`QR Code for ${value}`} width={width} height={width} className="border rounded-lg shadow-sm" />
            <Button variant="outline" size="sm" onClick={handleDownload} className="flex gap-2">
                <Download className="h-4 w-4" />
                Download PNG
            </Button>
        </div>
    )
}
