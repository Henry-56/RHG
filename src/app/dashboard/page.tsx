import { Button } from '@/components/ui/button'
import GlobalDashboard from '@/components/dashboards/GlobalDashboard'
import Link from 'next/link'
import { FileDown, FileSpreadsheet, Settings } from 'lucide-react'

export default async function DashboardPage() {
    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 border-none pb-0">Panel de Control</h1>
                        <p className="text-slate-500">Acceso Directo (Modo Invitado)</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <a href="/api/reports/pdf" download>
                                <FileDown className="mr-2 h-4 w-4" />
                                PDF
                            </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <a href="/api/reports/excel" download>
                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                Excel
                            </a>
                        </Button>
                        <Button asChild variant="default" size="sm">
                            <Link href="/admin">
                                <Settings className="mr-2 h-4 w-4" />
                                Administrar
                            </Link>
                        </Button>
                    </div>
                </div>

                <GlobalDashboard />
            </div>
        </div>
    )
}
