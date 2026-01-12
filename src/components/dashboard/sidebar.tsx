'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Settings, Users, Factory, MapPin, Layers, ChevronLeft, ChevronRight, Phone, FileText } from "lucide-react"

interface SidebarProps {
    tenantName: string
    tenantSlug: string
    isCollapsed?: boolean
    onCollapse?: () => void
}

export function Sidebar({ tenantName, tenantSlug, isCollapsed = false, onCollapse }: SidebarProps) {
    const pathname = usePathname()

    const routes = [
        {
            label: "Overview",
            icon: LayoutDashboard,
            href: `/${tenantSlug}/dashboard`,
            active: pathname === `/${tenantSlug}/dashboard`,
        },
        {
            label: "Machines",
            icon: Factory,
            href: `/${tenantSlug}/dashboard/machines`,
            active: pathname.startsWith(`/${tenantSlug}/dashboard/machines`),
        },
        {
            label: "Divisions",
            icon: Layers,
            href: `/${tenantSlug}/dashboard/divisions`,
            active: pathname.startsWith(`/${tenantSlug}/dashboard/divisions`),
        },
        {
            label: "Team",
            icon: Users,
            href: `/${tenantSlug}/dashboard/team`,
            active: pathname.startsWith(`/${tenantSlug}/dashboard/team`),
        },
        {
            label: "Locations",
            icon: MapPin,
            href: `/${tenantSlug}/dashboard/locations`,
            active: pathname.startsWith(`/${tenantSlug}/dashboard/locations`),
        },
        {
            label: "Calls",
            icon: Phone, // Need to import Phone
            href: `/${tenantSlug}/dashboard/calls`,
            active: pathname.startsWith(`/${tenantSlug}/dashboard/calls`),
        },
        {
            label: "Reports",
            icon: FileText,
            href: `/${tenantSlug}/dashboard/report`,
            active: pathname.startsWith(`/${tenantSlug}/dashboard/report`),
        },
        {
            label: "Settings",
            icon: Settings,
            href: `/${tenantSlug}/dashboard/settings`,
            active: pathname.startsWith(`/${tenantSlug}/dashboard/settings`),
        },
    ]

    return (
        <div className={cn(
            "flex flex-col h-full bg-secondary transition-all duration-300",
            isCollapsed ? "w-[40px]" : "w-64"
        )}>
            <div className={cn("p-6 flex items-center", isCollapsed ? "justify-center px-2" : "justify-between")}>
                {!isCollapsed && (
                    <div className="overflow-hidden">
                        <h1 className="text-2xl font-bold bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent truncate">
                            AndonPro
                        </h1>
                        <p className="text-xs text-muted-foreground mt-1 truncate">{tenantName}</p>
                    </div>
                )}
                {onCollapse && (
                    <button
                        onClick={onCollapse}
                        className={cn(
                            "text-muted-foreground hover:text-primary transition-colors border rounded-sm p-1",
                            isCollapsed ? "mx-auto" : "ml-auto"
                        )}
                    >
                        {isCollapsed ? <ChevronRight className="h-4 w-4 bg-accent" /> : <ChevronLeft className="h-4 w-4 bg-accent" />}
                        {/* Using a simple icon here, need to import ChevronLeft/Right or use conditional rendering with Lucide icons */}
                    </button>
                )}
            </div>

            <div className="flex-1 flex flex-col gap-y-1 px-3">
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "flex items-center gap-x-3 p-3 text-sm font-medium rounded-lg transition-all hover:bg-secondary/50",
                            route.active ? "bg-secondary text-primary" : "text-muted-foreground",
                            isCollapsed && "justify-center px-2"
                        )}
                        title={isCollapsed ? route.label : undefined}
                    >
                        <route.icon className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="truncate">{route.label}</span>}
                    </Link>
                ))}
            </div>
        </div>
    )
}
