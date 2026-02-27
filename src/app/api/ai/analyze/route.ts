import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { model, generateEmbedding } from '@/lib/gemini'
import { auth } from '@/auth'
import { getGeneration } from '@/lib/generation'

export async function POST(request: Request) {
    try {
        const { campaignId, area, employeeId, turno } = await request.json()

        // 1. Recopilar contexto de datos
        let evaluations: any[] = []

        if (employeeId) {
            evaluations = await prisma.evaluation.findMany({
                where: { employeeId },
                include: { employee: true, campaign: true },
                orderBy: { fecha: 'desc' },
                take: 5
            })
        } else {
            let where: any = {}
            if (campaignId) where.campaignId = campaignId
            if (area) where.employee = { area }

            evaluations = await prisma.evaluation.findMany({
                where,
                include: { employee: true },
                take: 100
            })
        }

        if (evaluations.length === 0) {
            return NextResponse.json({ error: "No hay suficientes datos para analizar" }, { status: 404 })
        }

        const dataSummary = evaluations.map(ev => ({
            nombre: ev.employee.nombres,
            area: ev.employee.area,
            generacion: getGeneration(ev.employee.anioNacimiento),
            desempeno: ev.scoreDesempeno,
            productividad: ev.scoreProductividad,
            etiqueta: ev.etiqueta,
            comentarios: ev.comentarios
        }))

        // 2. RAG Real con pgvector
        const queryForRag = employeeId
            ? `Desempeño bajo de ${dataSummary[0].nombre} en ${dataSummary[0].area}`
            : `Mejorar productividad y desempeño en área ${area || 'general'}`;

        const queryEmbedding = await generateEmbedding(queryForRag);
        const vectorString = `[${queryEmbedding.join(',')}]`;

        // Búsqueda de similitud semántica en pgvector
        const relatedChunks: any[] = await prisma.$queryRawUnsafe(
            `SELECT title, content, source, (embedding <=> $1::vector) as distance 
       FROM "DocumentChunk" 
       ORDER BY distance ASC 
       LIMIT 3`,
            vectorString
        );

        let ragContext = ""
        if (relatedChunks.length > 0) {
            ragContext = relatedChunks.map(c => `DOCUMENTO [${c.source} - ${c.title}]: ${c.content}`).join("\n\n")
        } else {
            ragContext = "No se encontraron documentos internos específicos. Usa el conocimiento estándar de RRHH."
        }

        // 3. Prompt para Gemini
        const systemInstruction = `Eres un consultor experto de RRHH Senior. Analizas resultados de evaluaciones de desempeño y productividad.
REGLAS CRÍTICAS:
1. Responde ÚNICAMENTE en formato JSON válido.
2. NO inventes datos. Usa solo las métricas provistas en el bloque de DATOS.
3. Si el score total es < 3.0, genera una ALERTA crítica.
4. Para las recomendaciones, prioriza el contexto de DOCUMENTOS INTERNOS si está disponible.
5. Cita evidencia específica como "Millennials promedio 3.5".`

        const prompt = `
DATOS DE EVALUACIONES:
${JSON.stringify(dataSummary, null, 2)}

CONTEXTO DE DOCUMENTOS INTERNOS (RAG):
${ragContext}

TAREA:
Genera un análisis profundo que incluya:
- La generación exacta con el mejor desempeño global.
- Resumen ejecutivo (insights clave).
- Hallazgos principales (brechas, tendencias).
- Alertas por bajo desempeño.
- Recomendaciones con fuente (si es de documento interno o genérico).

FORMATO DE SALIDA (JSON estricto, sin cambios de estructura):
{
  "winningGeneration": "DEBES RESPONDER TEXTUALMENTE UNA DE ESTAS 4 OPCIONES: 'Baby Boomers', 'Generación X', 'Millennials' o 'Generación Z'.",
  "executiveSummary": "Párrafo de 2-3 oraciones con los hallazgos más importantes.",
  "findings": [
    { "category": "Nombre de la categoría (ej: Desempeño)", "insight": "Hallazgo principal en esta categoría.", "evidence": "Cita específica con números, ej: Millennials promedio 3.5" }
  ],
  "alerts": [{"employeeName": "Nombre del empleado", "reason": "Razón del alerta"}],
  "recommendations": [{"topic": "Tema", "action": "Descripción concreta de la acción a tomar.", "source": "Fuente (documento interno o conocimiento general)", "isGeneric": true}]
}`

        const result = await model.generateContent(prompt + "\n\nIMPORTANTE: Responde solo con el JSON puro, sin markdown ni explicaciones.");
        const responseText = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();

        let aiJson;
        try {
            aiJson = JSON.parse(responseText);
        } catch (e) {
            aiJson = { error: "Error en el formato de respuesta de la IA", raw: responseText };
        }

        return NextResponse.json(aiJson);

    } catch (error: any) {
        console.error("AI Analysis Error:", error)
        return NextResponse.json({ error: error?.message || "Error procesando el análisis de IA" }, { status: 500 })
    }
}
