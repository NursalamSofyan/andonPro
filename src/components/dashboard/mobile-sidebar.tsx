"use client"

import { Menu } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Sidebar } from "./sidebar"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

interface MobileSidebarProps {
    tenantName: string
    tenantSlug: string
}

export const MobileSidebar = ({
    tenantName,
    tenantSlug
}: MobileSidebarProps) => {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    // Close on route change
    useEffect(() => {
        setOpen(false)
    }, [pathname])

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-background w-72">
                <Sidebar tenantName={tenantName} tenantSlug={tenantSlug} />
            </SheetContent>
        </Sheet>
    )
}
