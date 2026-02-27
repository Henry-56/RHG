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

        // 3. Formatear datos para el cliente
        const kpis = {
            totalEvaluados: total,
            promedioDesempeno: Number(avgDesempeno.toFixed(2)),
            promedioProductividad: Number(avgProductividad.toFixed(2))
        }

        const rawRecords = filteredEvals.map(ev => ({
            id: ev.id,
            desempeno: ev.scoreDesempeno,
            productividad: ev.scoreProductividad,
            gen: getGeneration(ev.employee.anioNacimiento),
            area: ev.employee.area
        }))

        const genMetrics: Record<string, { count: number, des: number, prod: number }> = {}
        filteredEvals.forEach(ev => {
            const g = getGeneration(ev.employee.anioNacimiento)
            if (!genMetrics[g]) genMetrics[g] = { count: 0, des: 0, prod: 0 }
            genMetrics[g].count += 1
            genMetrics[g].des += ev.scoreDesempeno
            genMetrics[g].prod += ev.scoreProductividad
        })

        const generaciones = Object.keys(genMetrics).map(name => ({
            name,
            desempeno: Number((genMetrics[name].des / genMetrics[name].count).toFixed(2)),
            productividad: Number((genMetrics[name].prod / genMetrics[name].count).toFixed(2))
        }))

        const tableData = filteredEvals.map(ev => ({
            id: ev.id,
            nombre: ev.employee.nombres,
            area: ev.employee.area,
            generacion: getGeneration(ev.employee.anioNacimiento),
            desempeno: ev.scoreDesempeno,
            productividad: ev.scoreProductividad,
            etiqueta: ev.etiqueta
        }))

        return NextResponse.json({
            data: {
                kpis,
                rutinaGraficos: {
                    generaciones,
                    rawRecords
                },
                tableData
            }
        })

    } catch (error: any) {
        console.error("Dashboard API Error:", error)
        return NextResponse.json({ error: "Error al procesar datos del dashboard" }, { status: 500 })
    }
}
