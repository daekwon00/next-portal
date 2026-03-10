'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { registerSchema, type RegisterFormValues } from '../schemas'
import { register as registerApi } from '@/lib/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      await registerApi({
        username: data.username,
        name: data.name,
        email: data.email,
        password: data.password,
      })
      router.push('/login?registered=true')
    } catch {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <div className="bg-primary text-primary-foreground mb-6 flex size-10 items-center justify-center rounded-xl text-sm font-bold lg:hidden">
          NP
        </div>
        <h1 className="text-2xl font-bold tracking-tight">회원가입</h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          새 계정을 만들어주세요
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
            placeholder="4자 이상"
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
          <Label htmlFor="name" className="text-sm font-medium">
            이름
          </Label>
          <Input
            id="name"
            placeholder="이름을 입력하세요"
            className="h-10"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-destructive text-xs">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            이메일
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            className="h-10"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-destructive text-xs">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            비밀번호
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="8자 이상"
            className="h-10"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-destructive text-xs">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            비밀번호 확인
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            className="h-10"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-destructive text-xs">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <Button type="submit" className="h-10 w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              가입 중...
            </>
          ) : (
            '회원가입'
          )}
        </Button>
      </form>

      <p className="text-muted-foreground mt-6 text-center text-sm">
        이미 계정이 있으신가요?{' '}
        <Link
          href="/login"
          className="text-primary font-medium hover:underline"
        >
          로그인
        </Link>
      </p>
    </div>
  )
}
