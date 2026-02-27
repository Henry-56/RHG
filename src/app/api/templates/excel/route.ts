// ...94>thought
// CRITICAL INSTRUCTION 1: Use specific tools when possible (e.g. write_to_file vs cat)
// CRITICAL INSTRUCTION 2: Think before bash commands.

import { NextResponse } from 'next/server'
import * as xlsx from 'xlsx'

export async function GET() {
    try {
        const wb = xlsx.utils.book_new()

        // 1. Hoja EMPLEADOS
        const wsEmpleados = xlsx.utils.aoa_to_sheet([
            [
                'employee_id',
                'nombres',
                'email',
                'anio_nacimiento',
                'area',
                'turno',
                'equipo',
                'puesto',
                'antiguedad_rango',
                'activo',
            ],
            [
                'EMP-001',
                'Juan Pérez',
                'jperez@co.co',
                1985,
                'Ventas',
                'Dia',
                'Equipo de Ventas B2B',
                'Ejecutivo Senior',
                '3-5',
                'TRUE',
            ],
        ])

        // 2. Hoja EVALUACIONES
        const headersEvaluaciones = [
            'employee_id',
            'evaluator_email',
            'campaign_name',
            'fecha',
        ]

        // Añadir Q1 al Q20
        for (let i = 1; i <= 20; i++) {
            headersEvaluaciones.push(`Q${i}`)
        }
        headersEvaluaciones.push('comentarios')

        const rowEvaluacionEjemplo = [
            'EMP-001',
            'admin@genimpact.hr',
            'Campaña Anual 2024',
            '2024-03-01',
        ]
        // Respuestas ejemplo genéricas
        for (let i = 1; i <= 20; i++) {
            rowEvaluacionEjemplo.push('4')
        }
        rowEvaluacionEjemplo.push('Buen desempeño general')

        const wsEvaluaciones = xlsx.utils.aoa_to_sheet([
            headersEvaluaciones,
            rowEvaluacionEjemplo,
        ])

        xlsx.utils.book_append_sheet(wb, wsEmpleados, 'EMPLEADOS')
        xlsx.utils.book_append_sheet(wb, wsEvaluaciones, 'EVALUACIONES')

        const excelBuffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' })

        return new NextResponse(excelBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="Plantilla_GenImpactHR.xlsx"',
            },
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
