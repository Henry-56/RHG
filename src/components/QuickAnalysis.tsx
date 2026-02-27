'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, FileUp, Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function QuickAnalysis() {
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState<'upload' | 'analyzing' | 'result'>('upload')
    const [analysis, setAnalysis] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setStep('analyzing')

        const formData = new FormData(e.currentTarget)

        try {
            // 1. Ingestar Excel
            const ingestRes = await fetch('/api/uploads/excel', {
                method: 'POST',
                body: formData,
            })
            const ingestData = await ingestRes.json()

            if (!ingestRes.ok) {
                throw new Error(ingestData.errores?.join(', ') || ingestData.error || "Error al subir archivo")
            }

            // 2. Ejecutar Análisis IA inmediatamente
            const aiRes = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ campaignId: null }) // Analizar todo lo recién cargado
            })
            const aiData = await aiRes.json()

            if (!aiRes.ok) throw new Error(aiData.error || "Error en análisis de IA")

            setAnalysis(aiData)
            setStep('result')
        } catch (err: any) {
            setError(err.message)
            setStep('upload')
        } finally {
            setLoading(false)
        }
    }

    if (step === 'analyzing') {
        return (
            <div className="flex flex-col items-center justify-center space-y-6 py-20 animate-pulse">
                <div className="relative">
                    <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
                    <Sparkles className="h-6 w-6 text-purple-500 absolute -top-2 -right-2 animate-bounce" />
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900">IA Procesando Datos...</h2>
                    <p className="text-slate-500">Calculando métricas estadísticas y comparando generaciones</p>
                </div>
            </div>
        )
    }

    if (step === 'result' && analysis) {
        return (
            <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-2xl text-white shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="h-8 w-8 text-blue-200" />
                        <h2 className="text-3xl font-black">VEREDICTO GENERACIONAL</h2>
                    </div>
                    <p className="text-blue-100 text-lg mb-6">Basado en el análisis estadístico de las encuestas cargadas:</p>

                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                        <div className="text-sm font-bold uppercase tracking-widest text-blue-200 mb-1">Mejor Desempeño</div>
                        <div className="text-5xl font-black mb-4">
                            {analysis.winningGeneration || "Generación"}
                        </div>
                        <p className="text-lg leading-relaxed text-blue-50">
                            {analysis.executiveSummary}
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {analysis.findings.map((f: any, i: number) => (
                        <Card key={i} className="border-slate-200 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold text-slate-500 uppercase">{f.category}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-900 font-medium">{f.insight}</p>
                                <p className="text-xs text-slate-500 mt-2 italic">Evidencia: {f.evidence}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl">
                    <h3 className="text-emerald-900 font-bold flex items-center gap-2 mb-3">
                        <CheckCircle2 className="h-5 w-5" />
                        Recomendación Estratégica
                    </h3>
                    <p className="text-emerald-800">{analysis.recommendations[0]?.action}</p>
                </div>

                <Button onClick={() => setStep('upload')} variant="outline" className="w-full h-12">
                    Cargar otro archivo
                </Button>
            </div>
        )
    }

    return (
        <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50">
            <CardContent className="py-12">
                <form onSubmit={handleFileUpload} className="flex flex-col items-center space-y-6">
                    <div className="p-4 bg-blue-100 rounded-full">
                        <FileUp className="h-10 w-10 text-blue-600" />
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-slate-900">Sube tu Excel de RRHH</h2>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            Sube el archivo con los datos de empleados y preguntas. La IA definirá qué generación es la más efectiva al instante.
                        </p>
                    </div>

                    <div className="w-full max-w-xs">
                        <input
                            type="file"
                            name="file"
                            accept=".xlsx"
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all cursor-pointer"
                            required
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm border border-red-100">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    <Button type="submit" size="lg" className="px-12 h-14 text-lg bg-slate-900 hover:bg-slate-800 rounded-full shadow-lg">
                        Empezar Análisis IA
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
