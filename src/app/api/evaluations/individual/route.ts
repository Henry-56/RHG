import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { calculateScores } from '@/lib/scoring'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { employee, evaluation } = body

        if (!employee || !evaluation) {
            return NextResponse.json({ error: "Faltan datos del empleado o evaluación" }, { status: 400 })
        }

        const employeeId = employee.id || uuidv4()

        const resultados = await prisma.$transaction(async (tx) => {
            // Upsert Empleado
            await tx.employee.upsert({
                where: { id: employeeId },
                update: {
                    nombres: employee.nombres,
                    email: employee.email || null,
                    anioNacimiento: employee.anioNacimiento ? Number(employee.anioNacimiento) : null,
                    area: employee.area,
                    turno: employee.turno,
                    equipo: employee.equipo,
                    puesto: employee.puesto,
                    antiguedadRango: employee.antiguedadRango,
                    activo: true,
                },
                create: {
                    id: employeeId,
                    nombres: employee.nombres,
                    email: employee.email || null,
                    anioNacimiento: employee.anioNacimiento ? Number(employee.anioNacimiento) : null,
                    area: employee.area,
                    turno: employee.turno,
                    equipo: employee.equipo,
                    puesto: employee.puesto,
                    antiguedadRango: employee.antiguedadRango,
                    activo: true,
                }
            })

            // Upsert Campaña
            const campaignName = evaluation.campaign_name || "Campaña Individual " + new Date().getFullYear();
            const campaign = await tx.campaign.upsert({
                where: { name: campaignName },
                update: {},
                create: {
                    name: campaignName,
                    startDate: new Date(),
                    endDate: new Date()
                }
            })

            // Procesar Evaluaciones
            const qResponses: { [key: string]: number } = {}
            for (let i = 1; i <= 20; i++) qResponses[`q${i}`] = Number(evaluation[`q${i}`] || 3)

            const scores = calculateScores(qResponses)

            const newEvaluation = await tx.evaluation.upsert({
                where: {
                    employeeId_campaignId: {
                        employeeId: employeeId,
                        campaignId: campaign.id
                    }
                },
                update: {
                    evaluatorEmail: evaluation.evaluatorEmail || 'admin@genimpact.com',
                    fecha: new Date(),
                    ...qResponses as any,
                    ...scores,
                    comentarios: evaluation.comentarios || ''
                },
                create: {
                    employeeId: employeeId,
                    campaignId: campaign.id,
                    evaluatorEmail: evaluation.evaluatorEmail || 'admin@genimpact.com',
                    fecha: new Date(),
                    ...qResponses as any,
                    ...scores,
                    comentarios: evaluation.comentarios || ''
                }
            })

            return { employeeId, evaluation: newEvaluation }
        })

        return NextResponse.json({
            status: "success",
            message: "Evaluación individual guardada exitosamente.",
            data: resultados
        })

    } catch (error: any) {
        console.error("Individual evaluation error:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}
