"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"

import { cn } from "@/lib/utils"

interface DashboardLayoutClientProps {
    children: React.ReactNode
    tenantName: string
    tenantSlug: string
}

export function DashboardLayoutClient({
    children,
    tenantName,
    tenantSlug
}: DashboardLayoutClientProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <div className="h-full relative font-sans">
            <div className={cn(
                "hidden md:flex flex-col fixed inset-y-0 z-80 transition-all duration-300",
                isCollapsed ? "w-[42px]" : "w-64"
            )}>
                <Sidebar
                    tenantName={tenantName}
                    tenantSlug={tenantSlug}
                    isCollapsed={isCollapsed}
                    onCollapse={() => setIsCollapsed(!isCollapsed)}
                />
            </div>
            <div className={cn(
                "min-h-full transition-all duration-300",
                isCollapsed ? "md:pl-[42px]" : "md:pl-64"
            )}>
                {/* Mobile Header/Trigger area could go here if not in the main Header, 
                    but usually the Header is part of the scrollable content or fixed. 
                    If Header is fixed, we need to pass MobileSidebar to it or render it here.
                    Assuming Header is inside children or at top of main. 
                    Wait, looking at original layout, Header was inside main. 
                    Let's render MobileSidebar here as a fixed element or part of a mobile header?
                */}
                {children}
            </div>
            {/* Mobile Sidebar Trigger - often placed in a top navbar, 
                but if we want it isolated we can check where Header is. 
                Original layout had Header inside main. 
                We might need to pass MobileSidebar to Header or render it absolutely.
                However, usually Header contains the hamburger. 
                If Header is in 'children', we can't easily inject into it without modifying Header.
                Let's check Header component.
            */}
        </div>
    )
}
