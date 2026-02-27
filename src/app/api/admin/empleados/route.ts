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
            fecha: ev.fecha,
            respuestas: {
                q1: ev.q1, q2: ev.q2, q3: ev.q3, q4: ev.q4, q5: ev.q5,
                q6: ev.q6, q7: ev.q7, q8: ev.q8, q9: ev.q9, q10: ev.q10,
                q11: ev.q11, q12: ev.q12, q13: ev.q13, q14: ev.q14, q15: ev.q15,
                q16: ev.q16, q17: ev.q17, q18: ev.q18, q19: ev.q19, q20: ev.q20
            }
        }))

        return NextResponse.json({ data: tableData })

    } catch (error: any) {
        console.error("Error fetching admin employees data:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}
