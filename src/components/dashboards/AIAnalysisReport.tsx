'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Sparkles, AlertTriangle, Lightbulb, ChevronRight, FileText, Loader2 } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"

export function AIAnalysisReport() {
    const [analysis, setAnalysis] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const generateAnalysis = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}) // Global por defecto
            })
            if (res.ok) {
                const json = await res.json()
                setAnalysis(json)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="text-blue-500 h-6 w-6" />
                        Análisis de Inteligencia Artificial
                    </h2>
                    <p className="text-slate-500 text-sm">Gemini analiza tendencias, brechas y recomienda acciones basadas en la data actual.</p>
                </div>
                <Button
                    onClick={generateAnalysis}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analizando...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generar Análisis IA
                        </>
                    )}
                </Button>
            </div>

            {!analysis && !loading && (
                <Card className="border-dashed py-12">
                    <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="p-4 bg-blue-50 rounded-full">
                            <Lightbulb className="h-10 w-10 text-blue-500" />
                        </div>
                        <div className="max-w-md">
                            <h3 className="text-lg font-semibold">Descubre Hallazgos Ocultos</h3>
                            <p className="text-slate-500 mt-2">
                                Haz clic en el botón superior para que la IA procese todas las evaluaciones actuales y genere un reporte ejecutivo con recomendaciones estratégicas.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {analysis && (
                <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Columna Izquierda: Insights y Alertas */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Resumen Ejecutivo e Insights</CardTitle>
                                <CardDescription>Principales conclusiones extraídas de los datos.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {analysis.insights?.executive_summary?.map((item: string, i: number) => (
                                        <li key={i} className="flex gap-3 text-slate-700">
                                            <ChevronRight className="h-5 w-5 text-blue-500 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <AlertTriangle className="text-amber-500 h-5 w-5" />
                                Alertas de Gestión
                            </h3>
                            <div className="grid gap-3">
                                {analysis.alerts?.map((alert: any, i: number) => (
                                    <Alert key={i} variant="destructive" className="bg-red-50 border-red-100 text-red-900">
                                        <AlertTitle className="font-bold">{alert.employee_name || 'Alerta de Desempeño'}</AlertTitle>
                                        <AlertDescription className="text-red-800">
                                            {alert.reason}
                                        </AlertDescription>
                                    </Alert>
                                ))}
                            </div>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Evidencia Detectada (Data-Driven)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.evidence?.map((item: string, i: number) => (
                                        <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-800 hover:bg-slate-200 py-1 px-3">
                                            {item}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Columna Derecha: Recomendaciones */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Lightbulb className="text-blue-500 h-5 w-5" />
                            Recomendaciones Accionables
                        </h3>
                        <ScrollArea className="h-[600px] pr-4">
                            <div className="space-y-4">
                                {analysis.recommendations?.map((rec: any, i: number) => (
                                    <Card key={i} className="border-l-4 border-l-blue-500 shadow-sm">
                                        <CardHeader className="p-4 pb-2">
                                            <Badge className={rec.is_generic ? "bg-slate-200 text-slate-600 mb-2" : "bg-blue-100 text-blue-700 mb-2"}>
                                                {rec.is_generic ? "Recomendación General" : "Basado en Contexto Interno"}
                                            </Badge>
                                            <CardTitle className="text-md font-bold">{rec.topic}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0">
                                            <p className="text-sm text-slate-700 mb-3">{rec.action}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                                                <FileText className="h-3 w-3" />
                                                FUENTE: {rec.source}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                </div>
            )}
        </div>
    )
}
