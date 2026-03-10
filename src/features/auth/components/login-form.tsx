'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { loginSchema, type LoginFormValues } from '../schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    setError(null)

    const result = await signIn('credentials', {
      username: data.username,
      password: data.password,
      redirect: false,
    })

    setIsLoading(false)

    if (result?.error) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.')
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <div className="bg-primary text-primary-foreground mb-6 flex size-10 items-center justify-center rounded-xl text-sm font-bold lg:hidden">
          NP
        </div>
        <h1 className="text-2xl font-bold tracking-tight">로그인</h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          계정 정보를 입력해주세요
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-destructive/10 text-destructive rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium">
            아이디
          </Label>
          <Input
            id="username"
            placeholder="아이디를 입력하세요"
            className="h-10"
            {...register('username')}
          />
          {errors.username && (
            <p className="text-destructive text-xs">
              {errors.username.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            비밀번호
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            className="h-10"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-destructive text-xs">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button type="submit" className="h-10 w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              로그인 중...
            </>
          ) : (
            '로그인'
          )}
        </Button>
      </form>

      <p className="text-muted-foreground mt-6 text-center text-sm">
        계정이 없으신가요?{' '}
        <Link
          href="/register"
          className="text-primary font-medium hover:underline"
        >
          회원가입
        </Link>
      </p>
    </div>
  )
}
