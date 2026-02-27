// ...94>thought
// CRITICAL INSTRUCTION 1: Use specific tools when possible (e.g. write_to_file vs cat)
// CRITICAL INSTRUCTION 2: Think before bash commands.

'use client'

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ScatterChart,
    Scatter,
    ZAxis
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartDataProps {
    data: {
        generaciones: { name: string, desempeno: number, productividad: number }[]
        rawRecords: { id: string, desempeno: number, productividad: number, gen: string, area: string }[]
    } | null
}

export function GenerationsChart({ data }: ChartDataProps) {
    if (!data || !data.generaciones.length) {
        return (
            <Card className="col-span-1 border-dashed">
                <CardHeader>
                    <CardTitle>Métricas por Generación</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No hay datos disponibles para mostrar el gráfico.
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Desempeño y Productividad Promedio (Por Generación)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data.generaciones}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 5]} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: 'transparent' }} />
                            <Legend iconType="circle" />
                            <Bar dataKey="desempeno" fill="#3b82f6" name="Desempeño" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="productividad" fill="#10b981" name="Productividad" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export function ScatterPerformanceChart({ data }: ChartDataProps) {
    if (!data || !data.rawRecords.length) {
        return null; // Ocultar si vacio
    }

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Correlación Desempeño vs Productividad</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" dataKey="productividad" name="Productividad" domain={[0, 5]} tickCount={6} />
                            <YAxis type="number" dataKey="desempeno" name="Desempeño" domain={[0, 5]} tickCount={6} />
                            {/* Dummy ZAxis para el tamaño de las burbujas */}
                            <ZAxis type="number" range={[50, 50]} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter name="Empleados" data={data.rawRecords} fill="#8884d8" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
