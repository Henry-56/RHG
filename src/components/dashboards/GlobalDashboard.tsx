// ...94>thought
// CRITICAL INSTRUCTION 1: Use specific tools when possible (e.g. write_to_file vs cat)
// CRITICAL INSTRUCTION 2: Think before bash commands.

'use client'

import { useState, useEffect } from 'react'
import { KPICards } from '@/components/dashboards/KPICards'
import { GenerationsChart, ScatterPerformanceChart } from '@/components/dashboards/Charts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIAnalysisReport } from '@/components/dashboards/AIAnalysisReport'
import { BarChart3, Sparkles } from 'lucide-react'

export default function GlobalDashboard() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [selectedGen, setSelectedGen] = useState<string>('all')

    const fetchData = async (gen: string) => {
        setLoading(true)
        try {
            const payload: any = {}
            if (gen !== 'all') payload.generacion = gen

            const res = await fetch('/api/dashboards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                const json = await res.json()
                setData(json.data)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData(selectedGen)
    }, [selectedGen])

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Panel de Filtros */}
            <div className="flex flex-col md:flex-row justify-between items-end bg-white p-6 rounded-lg border border-slate-200 shadow-sm gap-4">
                <div className="w-full md:w-64 space-y-2">
                    <Label className="text-slate-600 font-semibold">Filtrar por Generación</Label>
                    <Select value={selectedGen} onValueChange={setSelectedGen}>
                        <SelectTrigger className="bg-slate-50 border-slate-200">
                            <SelectValue placeholder="Todas las generaciones" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las generaciones</SelectItem>
                            <SelectItem value="Baby Boomers">Baby Boomers</SelectItem>
                            <SelectItem value="Gen X">Gen X</SelectItem>
                            <SelectItem value="Millennials">Millennials</SelectItem>
                            <SelectItem value="Gen Z">Gen Z</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2 pb-2">
                    {loading && <Badge variant="secondary" className="animate-pulse bg-blue-50 text-blue-600 border-blue-100">Sincronizando datos...</Badge>}
                    <Badge variant="outline" className="text-slate-400 border-slate-200">Actualizado hace un momento</Badge>
                </div>
            </div>

            {/* KPIs */}
            <KPICards data={data?.kpis} />

            <Tabs defaultValue="charts" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-4">
                    <TabsTrigger value="charts" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Visualización
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Reporte IA
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="charts" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        {data?.rutinaGraficos && (
                            <>
                                <GenerationsChart data={data.rutinaGraficos} />
                                <ScatterPerformanceChart data={data.rutinaGraficos} />
                            </>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="ai" className="mt-6">
                    <AIAnalysisReport />
                </TabsContent>
            </Tabs>

        </div>
    )
}
