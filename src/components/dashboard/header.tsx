'use client'

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { PiSignOutBold } from "react-icons/pi";

export function Header({ children }: { children?: React.ReactNode }) {
    return (
        <div className="h-16 border-b flex items-center justify-between px-6 bg-background">
            <div className="flex items-center gap-x-4">
                {children}
                <div className="font-medium text-lg">Dashboard</div>
            </div>
            <div className="flex items-center gap-x-4">
                <Button variant="ghost" onClick={() => signOut({ redirectTo: '/auth/login' })} title="Sign out">
                    <PiSignOutBold size={30} />
                </Button>
            </div>
        </div>
    )
}
