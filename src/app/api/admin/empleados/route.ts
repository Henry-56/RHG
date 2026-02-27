import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getGeneration } from '@/lib/generation'

export async function GET(request: Request) {
    try {
        const evaluations = await prisma.evaluation.findMany({
            include: {
                employee: true
            },
            orderBy: {
                fecha: 'desc'
            }
        })

        const tableData = evaluations.map(ev => ({
            id: ev.id,
            employeeId: ev.employee.id,
            nombre: ev.employee.nombres,
            area: ev.employee.area,
            puesto: ev.employee.puesto,
            generacion: getGeneration(ev.employee.anioNacimiento),
            desempeno: ev.scoreDesempeno,
            productividad: ev.scoreProductividad,
            etiqueta: ev.etiqueta,
            fecha: ev.fecha
        }))

        return NextResponse.json({ data: tableData })

    } catch (error: any) {
        console.error("Error fetching admin employees data:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}
