import QuickAnalysis from '@/components/QuickAnalysis'
import { Zap, ShieldCheck, Mail } from 'lucide-react'

export default function RootPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar Minimalista */}
      <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">GenImpact <span className="text-blue-600">HR</span></h1>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-500">
          <span className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-slate-600">
            <ShieldCheck className="h-4 w-4" />
            Privacidad Garantizada
          </span>
        </div>
      </header>

      {/* Contenedor Principal */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black text-slate-900 leading-tight">
            Analiza tu talento con <br />
            <span className="text-blue-600">Inteligencia Artificial</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Sube los resultados de tus encuestas en Excel y deja que nuestra IA identifique las mejores métricas generacionales por ti.
          </p>
        </div>

        {/* Zona de Carga y Análisis */}
        <section className="bg-white rounded-3xl p-2 shadow-2xl shadow-blue-900/10">
          <QuickAnalysis />
        </section>

        <div className="flex justify-center">
          <a href="/evaluacion-individual" className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-2 hover:underline transition-all">
            <span>O Evalúa a un Empleado Individualmente</span>
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>

        {/* Sección de Ayuda/Footer */}
        <div className="grid md:grid-cols-2 gap-8 pt-12 border-t border-slate-200">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900">¿Qué datos necesito?</h4>
            <p className="text-slate-400 text-sm">
              Tu Excel debe tener dos hojas principales: <strong>EMPLEADOS</strong> (datos básicos) y <strong>EVALUACIONES</strong> (respuestas).
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900">Seguridad de Datos</h4>
            <p className="text-slate-400 text-sm">
              Toda la información es analizada de forma encriptada y no se utiliza para entrenar modelos públicos.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-400 text-xs border-t border-slate-100 bg-white">
        © 2026 GenImpact HR - Prototipo de Análisis Rápido.
      </footer>
    </div>
  )
}
