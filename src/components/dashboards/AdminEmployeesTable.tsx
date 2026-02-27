'use client'

import { useState, useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Eye } from 'lucide-react'
import { HR_QUESTIONS } from '@/lib/constants'

interface AdminEmployeeProps {
    id: string;
    employeeId: string;
    nombre: string;
    area: string;
    puesto: string;
    generacion: string;
    desempeno: number;
    productividad: number;
    etiqueta: string;
    fecha: string;
    respuestas: Record<string, number>;
}

export function AdminEmployeesTable() {
    const [data, setData] = useState<AdminEmployeeProps[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/admin/empleados')
                const json = await res.json()
                if (res.ok) {
                    setData(json.data)
                }
            } catch (error) {
                console.error("Error fetching employees table:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <Card className="col-span-1 shadow-sm border border-slate-200">
                <CardHeader>
                    <CardTitle>Base de Datos de Empleados</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center text-blue-600 py-10">
                    <Loader2 className="animate-spin h-8 w-8" />
                </CardContent>
            </Card>
        )
    }

    if (!data || data.length === 0) {
        return (
            <Card className="col-span-1 border-dashed bg-slate-50">
                <CardHeader>
                    <CardTitle>Base de Datos de Empleados</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center text-slate-500 py-10">
                    No hay empleados ni evaluaciones guardadas en la base de datos todavía. Sube un excel o añade uno manual.
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="col-span-1 w-full overflow-hidden shadow-sm border border-slate-200">
            <CardHeader>
                <CardTitle>Directorio de Evaluaciones ({data.length})</CardTitle>
                <CardDescription>Visualización cruda de la tabla relacional cargada en PostgreSQL.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto max-h-[600px]">
                    <Table>
                        <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                            <TableRow>
                                <TableHead className="font-bold whitespace-nowrap">ID Empleado</TableHead>
                                <TableHead className="font-bold">Nombre</TableHead>
                                <TableHead className="font-bold">Área / Puesto</TableHead>
                                <TableHead className="font-bold">Generación</TableHead>
                                <TableHead className="text-right font-bold">Desempeño</TableHead>
                                <TableHead className="text-right font-bold">Productividad</TableHead>
                                <TableHead className="font-bold">Etiqueta HR</TableHead>
                                <TableHead className="font-bold">Detalle</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((emp) => (
                                <TableRow key={emp.id} className="hover:bg-slate-50 transition-colors">
                                    <TableCell className="font-mono text-xs text-slate-400">{emp.employeeId.substring(0, 8)}...</TableCell>
                                    <TableCell className="font-medium text-slate-900">{emp.nombre}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{emp.area}</span>
                                            <span className="text-xs text-slate-500">{emp.puesto}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 whitespace-nowrap">
                                            {emp.generacion}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">{emp.desempeno.toFixed(1)}</TableCell>
                                    <TableCell className="text-right font-medium">{emp.productividad.toFixed(1)}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                emp.etiqueta.includes("Alto") || emp.etiqueta.includes("Campeón") || emp.etiqueta.includes("Estrella")
                                                    ? 'default'
                                                    : emp.etiqueta.includes("Bajo") || emp.etiqueta.includes("Alerta") || emp.etiqueta.includes("Deficiente")
                                                        ? 'destructive'
                                                        : 'secondary'
                                            }
                                            className="whitespace-nowrap"
                                        >
                                            {emp.etiqueta}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors">
                                                    <Eye className="h-3 w-3" /> Ver Respuestas
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Evaluación Detallada: {emp.nombre}</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 mt-6">
                                                    {HR_QUESTIONS.map((pregunta, idx) => {
                                                        const key = `q${idx + 1}`;
                                                        const val = emp.respuestas[key];
                                                        return (
                                                            <div key={key} className="flex flex-col gap-1 border-b border-slate-100 pb-3">
                                                                <div className="flex justify-between items-start gap-4">
                                                                    <span className="text-sm font-semibold text-slate-700">
                                                                        {idx + 1}. {pregunta}
                                                                    </span>
                                                                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-bold shrink-0">
                                                                        {val || 0} / 5
                                                                    </Badge>
                                                                </div>
                                                                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                                                                    <div
                                                                        className={`h-full rounded-full transition-all ${(val || 0) >= 4 ? 'bg-emerald-500' : (val || 0) <= 2 ? 'bg-red-500' : 'bg-blue-500'
                                                                            }`}
                                                                        style={{ width: `${((val || 0) / 5) * 100}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
