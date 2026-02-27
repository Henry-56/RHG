import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaignId')

    try {
        const evaluations = await prisma.evaluation.findMany({
            where: campaignId ? { campaignId } : {},
            include: { employee: true, campaign: true },
            orderBy: { fecha: 'desc' }
        })

        const doc = new jsPDF()
        doc.setFontSize(20)
        doc.text('Reporte de Evaluaciones - GenImpact HR', 14, 22)

        doc.setFontSize(11)
        doc.setTextColor(100)
        doc.text(`Fecha de Reporte: ${new Date().toLocaleDateString()}`, 14, 30)

        const tableData = evaluations.map(ev => [
            ev.employeeId,
            ev.employee.nombres,
            ev.employee.area,
            ev.scoreDesempeno.toFixed(1),
            ev.scoreProductividad.toFixed(1),
            ev.scoreTotal.toFixed(1),
            ev.etiqueta
        ])

            ; (doc as any).autoTable({
                startY: 40,
                head: [['ID', 'Nombre', 'Área', 'Des.', 'Prod.', 'Total', 'Nivel']],
                body: tableData,
                theme: 'striped',
                headStyles: { fillStyle: [15, 23, 42] }
            })

        const pdfBuffer = doc.output('arraybuffer')

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="Reporte_GenImpact_HR.pdf"',
            },
        })

    } catch (error: any) {
        console.error("PDF Export Error:", error)
        return NextResponse.json({ error: "Error generando reporte PDF" }, { status: 500 })
    }
}
