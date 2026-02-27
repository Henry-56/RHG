import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LayoutDashboard, Database, FileSpreadsheet, Sparkles, Settings } from 'lucide-react'
import { ExcelUpload } from '@/components/ExcelUpload'
import { KnowledgeIngestion } from '@/components/KnowledgeIngestion'

export default async function AdminPage() {
    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar Simple */}
            <aside className="w-64 bg-slate-900 text-white p-6 space-y-8 hidden md:block">
                <div className="text-xl font-bold border-b border-slate-800 pb-4">
                    GenImpact <span className="text-blue-400">Admin</span>
                </div>
                <nav className="space-y-2">
                    <Link href="/dashboard" className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-md transition-colors text-slate-300">
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                    </Link>
                    <div className="flex items-center gap-3 p-2 bg-blue-600 rounded-md text-white font-medium">
                        <Settings className="h-5 w-5" />
                        Configuración
                    </div>
                </nav>
            </aside>

            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 border-none pb-0">Panel de Administración</h1>
                        <p className="text-slate-500">Gestión de datos y configuración del motor de IA.</p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/dashboard">Cerrar Admin</Link>
                    </Button>
                </header>

                <div className="grid gap-8">
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-6 text-slate-900">
                            <FileSpreadsheet className="h-6 w-6 text-emerald-500" />
                            <h2 className="text-xl font-bold">Carga Masiva de Evaluaciones</h2>
                        </div>
                        <ExcelUpload />
                    </section>

                    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-6 text-slate-900">
                            <Sparkles className="h-6 w-6 text-purple-500" />
                            <h2 className="text-xl font-bold">Base de Conocimiento IA</h2>
                        </div>
                        <KnowledgeIngestion />
                    </section>
                </div>
            </main>
        </div>
    )
}
