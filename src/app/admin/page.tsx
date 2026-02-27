'use client';

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LayoutDashboard, Database, FileSpreadsheet, Sparkles, Settings, Users } from 'lucide-react'
import { ExcelUpload } from '@/components/ExcelUpload'
import { KnowledgeIngestion } from '@/components/KnowledgeIngestion'
import { AdminEmployeesTable } from '@/components/dashboards/AdminEmployeesTable'

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'empleados'>('dashboard')
    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar Simple */}
            <aside className="w-64 bg-slate-900 text-white p-6 space-y-8 hidden md:block">
                <div className="text-xl font-bold border-b border-slate-800 pb-4">
                    GenImpact <span className="text-blue-400">Admin</span>
                </div>
                <nav className="space-y-2">
                    <button onClick={() => setActiveTab('dashboard')} className={`flex w-full items-center gap-3 p-2 rounded-md transition-colors text-slate-300 ${activeTab === 'dashboard' ? 'bg-blue-600 !text-white font-medium' : 'hover:bg-slate-800'}`}>
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard / IA
                    </button>
                    <button onClick={() => setActiveTab('empleados')} className={`flex w-full items-center gap-3 p-2 rounded-md transition-colors text-slate-300 ${activeTab === 'empleados' ? 'bg-blue-600 !text-white font-medium' : 'hover:bg-slate-800'}`}>
                        <Users className="h-5 w-5" />
                        Clientes / Evaluaciones
                    </button>
                    <div className="flex items-center gap-3 p-2 rounded-md text-slate-500 font-medium">
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
                    {activeTab === 'dashboard' && (
                        <>
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
                        </>
                    )}

                    {activeTab === 'empleados' && (
                        <div className="animate-in fade-in zoom-in-95 duration-300">
                            <AdminEmployeesTable />
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
