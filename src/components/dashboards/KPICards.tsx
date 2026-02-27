// ...94>thought
// CRITICAL INSTRUCTION 1: Use specific tools when possible (e.g. write_to_file vs cat)
// CRITICAL INSTRUCTION 2: Think before bash commands.

'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface KPICardsProps {
    data: {
        totalEvaluados: number;
        promedioDesempeno: number | string;
        promedioProductividad: number | string;
    } | null
}

export function KPICards({ data }: KPICardsProps) {
    if (!data) return null;

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Evaluados</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.totalEvaluados}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Promedio Desempeño</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.promedioDesempeno} <span className="text-xs text-muted-foreground">/ 5.0</span></div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Promedio Productividad</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.promedioProductividad} <span className="text-xs text-muted-foreground">/ 5.0</span></div>
                </CardContent>
            </Card>
        </div>
    )
}
