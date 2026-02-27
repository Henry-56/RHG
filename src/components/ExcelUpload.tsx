'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileDown, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react'

export function ExcelUpload() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{ status: string, message?: string, errores?: string[] } | null>(null)

    const handleDownloadTemplate = () => {
        window.location.href = '/api/templates/excel'
    }

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setResult(null)

        const formData = new FormData(e.currentTarget)

        try {
            const res = await fetch('/api/uploads/excel', {
                method: 'POST',
                body: formData,
            })

            const data = await res.json()
            setResult(data)

        } catch (error) {
            setResult({ status: 'error', errores: ['Error crítico de conexión con el servidor'] })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <FileSpreadsheet className="h-5 w-5 text-green-600" />
                    Gestión de Evaluaciones (Bulk)
                </CardTitle>
                <CardDescription>
                    Descarga la plantilla oficial y sube tus evaluaciones en formato Excel.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex-1 min-w-[200px]">
                        <h4 className="font-semibold text-sm mb-1">Paso 1: Descargar Plantilla</h4>
                        <p className="text-xs text-slate-500 mb-2">Asegúrate de no borrar columnas ni cambiar nombres de hojas.</p>
                        <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="w-full">
                            <FileDown className="mr-2 h-4 w-4" />
                            Descargar .xlsx
                        </Button>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <h4 className="font-semibold text-sm mb-1">Paso 2: Subir Archivo</h4>
                        <p className="text-xs text-slate-500 mb-2">Selecciona el archivo con los datos completos.</p>
                        <form onSubmit={handleUpload} className="flex gap-2">
                            <input
                                type="file"
                                name="file"
                                accept=".xlsx"
                                className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 block w-full"
                                required
                            />
                            <Button type="submit" size="sm" disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subir"}
                            </Button>
                        </form>
                    </div>
                </div>

                {result && result.status === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
                            <AlertCircle className="h-5 w-5" />
                            Errores de Validación ({result.errores?.length})
                        </div>
                        <ul className="text-sm text-red-600 list-disc ml-5 space-y-1 max-h-[200px] overflow-auto pr-4">
                            {result.errores?.map((err, i) => (
                                <li key={i}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {result && result.status === 'success' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-in zoom-in-95">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                        <div>
                            <p className="font-bold text-green-800">Carga Procesada</p>
                            <p className="text-sm text-green-700">{result.message}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
