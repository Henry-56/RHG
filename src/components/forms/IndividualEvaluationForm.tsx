'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { User, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react'

const QUESTIONS = [
    "Cumplimiento de objetivos mensuales",
    "Calidad del trabajo entregado",
    "Resolución de problemas técnicos",
    "Capacidad de trabajo bajo presión",
    "Puntualidad y asistencia",
    "Adaptabilidad a nuevos procesos",
    "Iniciativa para proponer mejoras",
    "Comunicación efectiva con el equipo",
    "Colaboración interdisciplinaria",
    "Liderazgo en proyectos pequeños",
    "Eficiencia en uso de herramientas",
    "Tiempo de respuesta a clientes/internos",
    "Organización del espacio y recursos",
    "Participación en reuniones",
    "Capacidad de recibir feedback",
    "Manejo de conflictos",
    "Actualización constante (aprendizaje)",
    "Apoyo a nuevos compañeros",
    "Alineación con cultura de la empresa",
    "Reporte oportuno de incidentes"
]

export function IndividualEvaluationForm() {
    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [loading, setLoading] = useState(false)
    const [aiReport, setAiReport] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const [employee, setEmployee] = useState({
        nombres: '',
        area: 'Ventas',
        anioNacimiento: '1990',
        turno: 'Mañana',
        equipo: 'Norte',
        puesto: 'Analista',
        antiguedadRango: '1-3 años'
    })

    const [evaluation, setEvaluation] = useState<Record<string, number>>(
        Object.fromEntries(new Array(20).fill(0).map((_, i) => [`q${i + 1}`, 3]))
    )

    const handleSubmit = async () => {
        setLoading(true)
        setError(null)

        try {
            // Guardar empleado
            const res = await fetch('/api/evaluations/individual', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employee, evaluation })
            })

            const json = await res.json()
            if (!res.ok) throw new Error(json.error || "Error guardando la evaluación")

            const employeeId = json.data.employeeId;

            // Pedir IA para ese empleado
            setStep(3)

            const aiRes = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId })
            })

            const aiData = await aiRes.json()
            if (!aiRes.ok) throw new Error(aiData.error || "Error en análisis de IA")

            setAiReport(aiData)

        } catch (e: any) {
            setError(e.message)
            setStep(1)
        } finally {
            setLoading(false)
        }
    }

    if (step === 3) {
        if (!aiReport && loading) {
            return (
                <div className="flex flex-col items-center justify-center space-y-6 py-20 animate-pulse">
                    <div className="relative">
                        <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
                        <Sparkles className="h-6 w-6 text-purple-500 absolute -top-2 -right-2 animate-bounce" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-900">IA Procesando Perfil...</h2>
                        <p className="text-slate-500">Analizando respuestas y cruzando variables del empleado</p>
                    </div>
                </div>
            )
        }

        if (aiReport) {
            return (
                <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-2xl text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <User className="h-8 w-8 text-blue-200" />
                            <h2 className="text-3xl font-black">ANÁLISIS COMPLETADO</h2>
                        </div>
                        <p className="text-blue-100 text-lg mb-6">Métricas individuales generadas y analizadas:</p>

                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                            <div className="text-sm font-bold uppercase tracking-widest text-blue-200 mb-1">Empleado Generación {aiReport.winningGeneration || "Generación"}</div>
                            <p className="text-lg leading-relaxed text-blue-50">
                                {aiReport.executiveSummary}
                            </p>
                        </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl">
                        <h3 className="text-emerald-900 font-bold flex items-center gap-2 mb-3">
                            <CheckCircle2 className="h-5 w-5" />
                            Mejor Recomendación de la IA
                        </h3>
                        <p className="text-emerald-800">{aiReport.recommendations[0]?.action}</p>
                    </div>

                    <Button onClick={() => { setStep(1); setAiReport(null); }} variant="outline" className="w-full h-12">
                        Evaluar otro empleado
                    </Button>
                </div>
            )
        }

        return (
            <div className="flex flex-col items-center justify-center space-y-6 py-20">
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm border border-red-100">
                    <AlertCircle className="h-4 w-4" />
                    {error || "Ocurrió un error inesperado."}
                </div>
                <Button onClick={() => setStep(1)} variant="outline">Volver a intentar</Button>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in">
            {step === 1 && (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold border-b pb-2">Datos Personales</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Nombre Completo</Label>
                            <Input placeholder="Ej. Juan Pérez" value={employee.nombres} onChange={e => setEmployee({ ...employee, nombres: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Área</Label>
                            <Input placeholder="Ej. Ventas" value={employee.area} onChange={e => setEmployee({ ...employee, area: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Año de Nacimiento</Label>
                            <Input type="number" placeholder="Ej. 1995" value={employee.anioNacimiento} onChange={e => setEmployee({ ...employee, anioNacimiento: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Puesto</Label>
                            <Input placeholder="Ej. Vendedor" value={employee.puesto} onChange={e => setEmployee({ ...employee, puesto: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Turno</Label>
                            <select className="w-full rounded-md border border-slate-300 p-2 text-sm" value={employee.turno} onChange={e => setEmployee({ ...employee, turno: e.target.value })}>
                                <option>Mañana</option>
                                <option>Tarde</option>
                                <option>Noche</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Rango de Antigüedad</Label>
                            <select className="w-full rounded-md border border-slate-300 p-2 text-sm" value={employee.antiguedadRango} onChange={e => setEmployee({ ...employee, antiguedadRango: e.target.value })}>
                                <option>0-1 año</option>
                                <option>1-3 años</option>
                                <option>3-5 años</option>
                                <option>5+ años</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold border-b pb-2">Evaluación (Métricas)</h3>
                    <p className="text-slate-500 text-sm mb-6">Califica del 1 al 5 las siguientes competencias del empleado.</p>
                    <div className="space-y-6 max-h-[500px] overflow-auto pr-4">
                        {QUESTIONS.map((q, idx) => (
                            <div key={idx} className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                <Label className="text-slate-700 font-semibold">{idx + 1}. {q}</Label>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-slate-400">1</span>
                                    <Slider
                                        defaultValue={[3]}
                                        max={5}
                                        min={1}
                                        step={1}
                                        className="flex-1"
                                        onValueChange={(val: number[]) => setEvaluation({ ...evaluation, [`q${idx + 1}`]: val[0] })}
                                    />
                                    <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">{evaluation[`q${idx + 1}`]}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm border border-red-100">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            <div className="flex justify-between pt-6 border-t">
                {step === 2 && (
                    <Button variant="outline" onClick={() => setStep(1)}>Volver</Button>
                )}
                {step === 1 && (
                    <Button className="ml-auto" onClick={() => setStep(2)} disabled={!employee.nombres || !employee.anioNacimiento}>Continuar a Encuesta</Button>
                )}
                {step === 2 && (
                    <Button className="ml-auto bg-slate-900 hover:bg-slate-800" onClick={handleSubmit} disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Analizar Empleado por IA"}
                    </Button>
                )}
            </div>
        </div>
    )
}
