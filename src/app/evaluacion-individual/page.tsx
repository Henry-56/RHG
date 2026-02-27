import { IndividualEvaluationForm } from '@/components/forms/IndividualEvaluationForm'
import { Sparkles, UserPlus } from 'lucide-react'

export default function IndividualEvaluationPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <UserPlus className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Evaluación <span className="text-blue-600">Individual</span></h1>
                </div>
                <div className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-500">
                    <a href="/" className="hover:text-blue-600 transition-colors">Volver al Inicio</a>
                    <a href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">Dashboard Global</a>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl font-black text-slate-900 leading-tight">
                        Añadir Nuevo <span className="text-blue-600">Empleado</span>
                    </h2>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">
                        Ingresa los datos del empleado y responde la encuesta para generar sus métricas y análisis de IA inmediato.
                    </p>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-blue-900/10 border border-slate-100">
                    <IndividualEvaluationForm />
                </div>
            </main>
        </div>
    )
}
