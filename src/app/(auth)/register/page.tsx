import type { Metadata } from 'next'
import { RegisterForm } from '@/features/auth/components/register-form'

export const metadata: Metadata = {
  title: '회원가입 | Next Portal',
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <RegisterForm />
    </div>
  )
}
