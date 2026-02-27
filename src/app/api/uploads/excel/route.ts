import { NextResponse } from 'next/server'
import * as xlsx from 'xlsx'
import prisma from '@/lib/prisma'
import { empleadoSchema, evaluacionSchema } from '@/lib/validations/excel'
import { calculateScores } from '@/lib/scoring'

import { ZodError } from 'zod'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: "Archivo requerido" }, { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const wb = xlsx.read(buffer, { type: 'buffer' })

        const wsEmpleados = wb.Sheets['EMPLEADOS']
        const wsEvaluaciones = wb.Sheets['EVALUACIONES']

        if (!wsEmpleados || !wsEvaluaciones) {
            return NextResponse.json({
                error: "El Excel debe contener las hojas EMPLEADOS y EVALUACIONES"
            }, { status: 400 })
        }

        const empleadosRaw = xlsx.utils.sheet_to_json(wsEmpleados)
        const evaluacionesRaw = xlsx.utils.sheet_to_json(wsEvaluaciones)

        const errores: string[] = []
        const empleadosValidos: any[] = []
        const evaluacionesValidas: any[] = []

        // 1. Validar Empleados
        empleadosRaw.forEach((row: any, index: number) => {
            const parsed = empleadoSchema.safeParse(row)
            if (!parsed.success) {
                const errorMsg = parsed.error.issues.map(issue => issue.message).join(', ')
                errores.push(`EMPLEADOS Fila ${index + 2}: ${errorMsg}`)
            } else {
                empleadosValidos.push(parsed.data)
            }
        })

        // 2. Validar Evaluaciones
        evaluacionesRaw.forEach((row: any, index: number) => {
            // Normalizar keys a lowercase para Q1, Q2, etc
            const normalizedRow: any = {}
            for (const key in row) {
                normalizedRow[key.toLowerCase()] = row[key]
            }

            const parsed = evaluacionSchema.safeParse(normalizedRow)
            if (!parsed.success) {
                const errorMsg = parsed.error.issues.map(issue => issue.message).join(', ')
                errores.push(`EVALUACIONES Fila ${index + 2}: ${errorMsg}`)
            } else {
                const data = parsed.data
                // Verificar que el empleado existe en la hoja de empleados
                if (!empleadosValidos.find(e => e.employee_id === data.employee_id)) {
                    errores.push(`EVALUACIONES Fila ${index + 2}: El employee_id ${data.employee_id} no existe en la hoja EMPLEADOS`)
                } else {
                    evaluacionesValidas.push(data)
                }
            }
        })

        if (errores.length > 0) {
            return NextResponse.json({ status: "error", errores }, { status: 400 })
        }

        // 3. Ingestión en Base de Datos (Transacción)
        const resultados = await prisma.$transaction(async (tx) => {
            // Upsert Empleados
            for (const e of empleadosValidos) {
                await tx.employee.upsert({
                    where: { id: e.employee_id },
                    update: {
                        nombres: e.nombres,
                        email: e.email || null,
                        anioNacimiento: e.anio_nacimiento === "" || e.anio_nacimiento === undefined ? null : Number(e.anio_nacimiento) || null,
                        area: e.area,
                        turno: e.turno,
                        equipo: e.equipo,
                        puesto: e.puesto,
                        antiguedadRango: e.antiguedad_rango,
                        activo: e.activo !== false,
                    },
                    create: {
                        id: e.employee_id,
                        nombres: e.nombres,
                        email: e.email || null,
                        anioNacimiento: e.anio_nacimiento === "" || e.anio_nacimiento === undefined ? null : Number(e.anio_nacimiento) || null,
                        area: e.area,
                        turno: e.turno,
                        equipo: e.equipo,
                        puesto: e.puesto,
                        antiguedadRango: e.antiguedad_rango,
                        activo: e.activo !== false,
                    }
                })
            }

            let evalCount = 0
            // Procesar Evaluaciones
            for (const ev of evaluacionesValidas) {
                const campaign = await tx.campaign.upsert({
                    where: { name: ev.campaign_name },
                    update: {},
                    create: {
                        name: ev.campaign_name,
                        startDate: ev.fecha,
                        endDate: ev.fecha
                    }
                })

                const qResponses: { [key: string]: number } = {}
                for (let i = 1; i <= 20; i++) qResponses[`q${i}`] = ev[`q${i}`]

                const scores = calculateScores(qResponses)

                await tx.evaluation.upsert({
                    where: {
                        employeeId_campaignId: {
                            employeeId: ev.employee_id,
                            campaignId: campaign.id
                        }
                    },
                    update: {
                        evaluatorEmail: ev.evaluator_email,
                        fecha: ev.fecha,
                        ...qResponses as any,
                        ...scores,
                        comentarios: ev.comentarios
                    },
                    create: {
                        employeeId: ev.employee_id,
                        campaignId: campaign.id,
                        evaluatorEmail: ev.evaluator_email,
                        fecha: ev.fecha,
                        ...qResponses as any,
                        ...scores,
                        comentarios: ev.comentarios
                    }
                })
                evalCount++
            }

            return { emp: empleadosValidos.length, evalCount }
        })

        return NextResponse.json({
            status: "success",
            message: `Procesamiento exitoso: ${resultados.emp} empleados y ${resultados.evalCount} evaluaciones.`
        })

    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ error: "Error interno del servidor procesando archivo" }, { status: 500 })
    }
}
