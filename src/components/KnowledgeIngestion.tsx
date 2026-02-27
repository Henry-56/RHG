'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, FileUp, CheckCircle2 } from 'lucide-react'

export function KnowledgeIngestion() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleIngest = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setSuccess(false)

        const formData = new FormData(e.currentTarget)
        const data = {
            title: formData.get('title'),
            content: formData.get('content'),
            source: formData.get('source'),
        }

        try {
            const res = await fetch('/api/documents/ingest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                setSuccess(true)
                    ; (e.target as HTMLFormElement).reset()
            } else {
                const err = await res.json()
                alert(err.error || "Error al procesar el documento.")
            }
        } catch (error) {
            alert("No se pudo conectar con el servidor.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <FileUp className="h-5 w-5 text-blue-500" />
                    Ingestar Conocimiento (RAG)
                </CardTitle>
                <CardDescription>
                    Añade manuales de competencias, políticas de RRHH o catálogos de capacitación para guiar las recomendaciones de la IA.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleIngest} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título del Documento</Label>
                            <Input id="title" name="title" placeholder="Ej: Manual de Liderazgo" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="source">Fuente / Origen</Label>
                            <Input id="source" name="source" placeholder="Ej: PDF Políticas 2024" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Contenido de Referencia</Label>
                        <Textarea
                            id="content"
                            name="content"
                            placeholder="Pega aquí el texto que la IA debe usar como base para sus recomendaciones..."
                            className="min-h-[150px]"
                            required
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        {success && (
                            <div className="flex items-center gap-2 text-green-600 text-sm font-medium animate-in fade-in">
                                <CheckCircle2 className="h-4 w-4" />
                                Documento procesado con éxito
                            </div>
                        )}
                        <div className="flex-1" />
                        <Button type="submit" disabled={loading} className="bg-slate-900 text-white">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Vectorizando...
                                </>
                            ) : (
                                <>
                                    <FileUp className="mr-2 h-4 w-4" />
                                    Ingestar Conocimiento
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
