'use client'

import { useActionState } from 'react'
import { authenticate } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm() {
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined
    )

    return (
        <form action={formAction} className="space-y-4 w-full max-w-sm">
            <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="admin@genimpact.hr"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                />
            </div>
            <Button className="w-full mt-4" type="submit" aria-disabled={isPending}>
                {isPending ? 'Iniciando...' : 'Iniciar Sesión'}
            </Button>
            {errorMessage && (
                <div className="text-sm text-red-500 font-medium">
                    {errorMessage}
                </div>
            )}
        </form>
    )
}
