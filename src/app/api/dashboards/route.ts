import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getGeneration } from '@/lib/generation'

export async function POST(request: Request) {
    try {
        const { campaignId, area, turno, generacion } = await request.json()

        const where: any = {}
        if (campaignId) where.campaignId = campaignId

        // Filtros de empleado
        const employeeFilters: any = {}
        if (area && area !== 'all') employeeFilters.area = area
        if (turno && turno !== 'all') employeeFilters.turno = turno

        if (Object.keys(employeeFilters).length > 0) {
            where.employee = employeeFilters
        }

        const evaluations = await prisma.evaluation.findMany({
            where,
            include: {
                employee: true
            },
            orderBy: {
                fecha: 'desc'
            }
        })

        // 2. Procesar datos para gráficos
        // Filtrar por generación si se solicita (esto es post-fetch para facilidad)
        let filteredEvals = evaluations
        if (generacion && generacion !== 'all') {
            filteredEvals = evaluations.filter(ev => getGeneration(ev.employee.anioNacimiento) === generacion)
        }

        // 3. Calcular KPIs
        const total = filteredEvals.length
        const avgDesempeno = total > 0 ? filteredEvals.reduce((acc, curr) => acc + curr.scoreDesempeno, 0) / total : 0
        const avgProductividad = total > 0 ? filteredEvals.reduce((acc, curr) => acc + curr.scoreProductividad, 0) / total : 0
        const avgTotal = total > 0 ? filteredEvals.reduce((acc, curr) => acc + curr.scoreTotal, 0) / total : 0

        // 4. Agrupar por generación para gráfico
        const genCounts: any = {}
        filteredEvals.forEach(ev => {
            const g = getGeneration(ev.employee.anioNacimiento)
            genCounts[g] = (genCounts[g] || 0) + 1
        })

        const generationsData = Object.keys(genCounts).map(name => ({
            name,
            cantidad: genCounts[name]
        }))

        return NextResponse.json({
            summary: {
                totalEvaluaciones: total,
                avgDesempeno: Number(avgDesempeno.toFixed(2)),
                avgProductividad: Number(avgProductividad.toFixed(2)),
                avgTotal: Number(avgTotal.toFixed(2)),
            },
            generationsData,
            evaluations: filteredEvals
        })

    } catch (error: any) {
        console.error("Dashboard API Error:", error)
        return NextResponse.json({ error: "Error al procesar datos del dashboard" }, { status: 500 })
    }
}
