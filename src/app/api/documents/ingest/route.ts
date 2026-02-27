import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateEmbedding } from '@/lib/gemini'

export async function POST(request: Request) {
    try {
        const { title, content, source } = await request.json()

        if (!title || !content) {
            return NextResponse.json({ error: "Título y contenido son requeridos" }, { status: 400 })
        }

        const embedding = await generateEmbedding(content)

        await prisma.$executeRawUnsafe(
            `INSERT INTO "DocumentChunk" (id, title, content, embedding, source) 
       VALUES (gen_random_uuid(), $1, $2, $3::vector, $4)`,
            title, content, `[${embedding.join(',')}]`, source || 'Manual'
        )

        return NextResponse.json({ status: "success", message: "Conocimiento ingestado correctamente" })

    } catch (error: any) {
        console.error("Ingest Error:", error)
        return NextResponse.json({ error: "Error procesando el documento" }, { status: 500 })
    }
}
