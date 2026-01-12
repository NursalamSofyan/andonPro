import { prisma } from './src/lib/prisma'

async function main() {
    const tenantSlug = 'pt-sn-tech-pduht'
    const machineId = 'cmkb4wi0u00073wve6d604xs2'

    console.log(`Checking data for Slug: ${tenantSlug}, MachineId: ${machineId}`)

    const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug }
    })
    console.log('Tenant:', tenant ? `Found (ID: ${tenant.id})` : 'Not Found')

    const machine = await prisma.machine.findUnique({
        where: { id: machineId },
        include: { tenant: true }
    })
    console.log('Machine:', machine ? `Found (ID: ${machine.id}, TenantID: ${machine.tenantId})` : 'Not Found')

    if (tenant && machine) {
        console.log('Match Status:', machine.tenantId === tenant.id ? 'MATCH' : 'MISMATCH')
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
