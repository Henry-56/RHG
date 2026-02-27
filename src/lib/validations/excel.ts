// ...94>thought
// CRITICAL INSTRUCTION 1: Use specific tools when possible (e.g. write_to_file vs cat)
// CRITICAL INSTRUCTION 2: Think before bash commands.

import { z } from 'zod'

export const empleadoSchema = z.object({
    employee_id: z.string().min(1, "employee_id es requerido"),
    nombres: z.string().min(1, "nombres es requerido"),
    email: z.string().email("email inválido").optional().or(z.literal('')),
    anio_nacimiento: z.number().int().optional().or(z.literal('')),
    area: z.string().min(1, "area es requerida"),
    turno: z.string(),
    equipo: z.string().min(1, "equipo es requerido"),
    puesto: z.string().min(1, "puesto es requerido"),
    antiguedad_rango: z.string(),
    activo: z.boolean().or(z.string().transform(val => val.toLowerCase() === 'true'))
})

const qSchema = z.number().int().min(1, "Debe ser mínimo 1").max(5, "Debe ser máximo 5")

export const evaluacionSchema = z.object({
    employee_id: z.string().min(1, "employee_id es requerido para cruzar data"),
    evaluator_email: z.string().email("evaluator_email inválido"),
    campaign_name: z.string().min(1, "campaign_name requerido"),
    fecha: z.union([z.date(), z.string()]).transform(val => new Date(val)),
    q1: qSchema, q2: qSchema, q3: qSchema, q4: qSchema, q5: qSchema,
    q6: qSchema, q7: qSchema, q8: qSchema, q9: qSchema, q10: qSchema,
    q11: qSchema, q12: qSchema, q13: qSchema, q14: qSchema, q15: qSchema,
    q16: qSchema, q17: qSchema, q18: qSchema, q19: qSchema, q20: qSchema,
    comentarios: z.string().optional().or(z.literal(''))
})
