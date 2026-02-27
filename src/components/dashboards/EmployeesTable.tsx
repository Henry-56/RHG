'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EmployeeTableProps {
    data: {
        id: string;
        nombre: string;
        area: string;
        generacion: string;
        desempeno: number;
        productividad: number;
        etiqueta: string;
    }[] | null;
}

export function EmployeesTable({ data }: EmployeeTableProps) {
    if (!data || data.length === 0) {
        return (
            <Card className="col-span-1 border-dashed">
                <CardHeader>
                    <CardTitle>Métricas de Empleados</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center text-muted-foreground py-10">
                    No hay datos disponibles.
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="col-span-1 w-full overflow-hidden">
            <CardHeader>
                <CardTitle>Métricas Individuales de Empleados</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto max-h-[400px]">
                    <Table>
                        <TableHeader className="bg-slate-50 sticky top-0 z-10">
                            <TableRow>
                                <TableHead className="font-bold">Nombre</TableHead>
                                <TableHead className="font-bold">Área</TableHead>
                                <TableHead className="font-bold">Generación</TableHead>
                                <TableHead className="text-right font-bold">Desempeño</TableHead>
                                <TableHead className="text-right font-bold">Productividad</TableHead>
                                <TableHead className="font-bold">Etiqueta</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((emp) => (
                                <TableRow key={emp.id} className="hover:bg-slate-50 transition-colors">
                                    <TableCell className="font-medium text-slate-900">{emp.nombre}</TableCell>
                                    <TableCell>{emp.area}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                            {emp.generacion}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">{emp.desempeno.toFixed(1)}/5</TableCell>
                                    <TableCell className="text-right font-medium">{emp.productividad.toFixed(1)}/5</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                emp.etiqueta.includes("Alto") || emp.etiqueta.includes("Campeón") || emp.etiqueta.includes("Estrella")
                                                    ? 'default'
                                                    : emp.etiqueta.includes("Bajo") || emp.etiqueta.includes("Alerta") || emp.etiqueta.includes("Deficiente")
                                                        ? 'destructive'
                                                        : 'secondary'
                                            }
                                        >
                                            {emp.etiqueta}
                                        </Badge>
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
