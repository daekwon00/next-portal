import type { Metadata } from 'next'
import { RegisterForm } from '@/features/auth/components/register-form'

export const metadata: Metadata = {
  title: '회원가입 | Next Portal',
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      {/* 좌측 브랜딩 */}
      <div className="hidden flex-1 items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-700 lg:flex">
        <div className="max-w-sm px-8 text-center">
          <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-white/20 text-xl font-bold text-white backdrop-blur-sm">
            NP
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Next Portal
          </h1>
          <p className="mt-2 text-base text-white/60">
            팀을 위한 스마트 포털 시스템
          </p>
        </div>
      </div>
      {/* 우측 폼 */}
      <div className="bg-background flex flex-1 items-center justify-center px-6">
        <RegisterForm />
      </div>
    </div>
  )
}
