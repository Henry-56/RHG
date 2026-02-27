'use server'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', Object.fromEntries(formData))
    } catch (error) {
        if (error instanceof AuthError) {
            if (error.type === 'CredentialsSignin') {
                return 'Credenciales inválidas.'
            }
            return 'Ocurrió un error en la autenticación.'
        }
        throw error
    }
}
