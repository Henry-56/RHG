import { LoginForm } from '@/components/LoginForm'

export default function LoginPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-slate-200">
                <h1 className="text-2xl font-bold text-center text-slate-900 mb-6">
                    GenImpact HR
                </h1>
                <p className="text-sm text-slate-500 mb-8 text-center">
                    Ingresa tus credenciales para continuar
                </p>
                <div className="flex justify-center">
                    <LoginForm />
                </div>
            </div>
        </main>
    )
}
