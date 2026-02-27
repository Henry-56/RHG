import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import * as xlsx from 'xlsx'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaignId')

    try {
        const evaluations = await prisma.evaluation.findMany({
            where: campaignId ? { campaignId } : {},
            include: { employee: true, campaign: true },
            orderBy: { fecha: 'desc' }
        })

        const data = evaluations.map(ev => ({
            'Campaña': ev.campaign.name,
            'Fecha': ev.fecha.toLocaleDateString(),
            'ID Empleado': ev.employeeId,
            'Nombre': ev.employee.nombres,
            'Área': ev.employee.area,
            'Turno': ev.employee.turno,
            'Desempeño': ev.scoreDesempeno,
            'Productividad': ev.scoreProductividad,
            'Total': ev.scoreTotal,
            'Etiqueta': ev.etiqueta,
            'Comentarios': ev.comentarios
        }))

        const wb = xlsx.utils.book_new()
        const ws = xlsx.utils.json_to_sheet(data)
        xlsx.utils.book_append_sheet(wb, ws, 'Resultados')

        const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' })

        return new NextResponse(buf, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="Export_GenImpactHR.xlsx"',
            },
        })

    } catch (error: any) {
        console.error("Excel Export Error:", error)
        return NextResponse.json({ error: "Error generando reporte Excel" }, { status: 500 })
    }
}
