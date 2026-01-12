import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { QrCodeDisplay } from "@/components/qr-code-display"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface PageProps {
    params: Promise<{
        tenantSlug: string
        machineId: string
    }>
}

export default async function MachineQrPage(props: PageProps) {
    const session = await auth()
    const params = await props.params;

    if (!session?.user) {
        redirect("/auth/login")
    }

    const { tenantSlug, machineId } = params

    const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug },
    })

    if (!tenant) {
        notFound()
    }

    const machine = await prisma.machine.findUnique({
        where: { id: machineId },
        include: { location: true },
    })

    if (!machine || machine.tenantId !== tenant.id) {
        notFound()
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const callUrl = `${baseUrl}/${tenantSlug}/call/${machine.id}`

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <Link
                href={`/${tenantSlug}/dashboard/machines`}
                className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Machines
            </Link>

            <div className="bg-card border rounded-xl p-8 shadow-sm flex flex-col items-center text-center space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">{machine.name}</h1>
                    <p className="text-muted-foreground">{machine.location.name} • {machine.code}</p>
                </div>

                <div className="p-4 bg-white rounded-lg border">
                    <QrCodeDisplay value={callUrl} width={250} downloadFileName={`qrcode-${machine.code}`} />
                </div>

                <div className="text-sm text-muted-foreground bg-muted p-4 rounded-md w-full break-all">
                    <p className="font-medium mb-1">Scan Target URL:</p>
                    {callUrl}
                </div>

                <div className="text-xs text-muted-foreground">
                    Print this QR code and attach it to the machine.
                    <br />
                    Scanning it will open the call page for this specific machine.
                </div>
            </div>
        </div>
    )
}
