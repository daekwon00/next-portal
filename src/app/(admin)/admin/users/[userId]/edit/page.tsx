'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  updateUserSchema,
  type UpdateUserFormValues,
} from '@/features/admin/schemas'
import {
  useAdminUser,
  useUpdateUser,
  useToggleUserActive,
} from '@/features/admin/hooks/use-admin-users'

export default function AdminUserEditPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = use(params)
  const router = useRouter()

  const { data: user, isLoading } = useAdminUser(userId)
  const updateUser = useUpdateUser()
  const toggleActive = useToggleUserActive()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    values: user
      ? {
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department ?? '',
          position: user.position ?? '',
        }
      : undefined,
  })

  function onSubmit(data: UpdateUserFormValues) {
    updateUser.mutate(
      { userId, data },
      {
        onSuccess: () => {
          toast.success('사용자 정보가 수정되었습니다.')
          router.push('/admin/users')
        },
        onError: () => toast.error('사용자 수정에 실패했습니다.'),
      }
    )
  }

  function handleToggleActive() {
    toggleActive.mutate(userId, {
      onSuccess: () => toast.success('상태가 변경되었습니다.'),
      onError: () => toast.error('상태 변경에 실패했습니다.'),
    })
  }

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />
  }

  if (!user) {
    return <p className="text-muted-foreground">사용자를 찾을 수 없습니다.</p>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="사용자 수정"
        description={`${user.username} 사용자 정보를 수정합니다.`}
      >
        <Button variant="outline" onClick={() => router.push('/admin/users')}>
          <ArrowLeft className="mr-2 size-4" />
          목록으로
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>사용자 정보</CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="active-toggle">계정 활성</Label>
              <Switch
                id="active-toggle"
                checked={user.isActive}
                onCheckedChange={handleToggleActive}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>아이디</Label>
              <Input value={user.username} disabled />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input id="name" {...register('name')} />
                {errors.name && (
                  <p className="text-destructive text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && (
                  <p className="text-destructive text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>역할</Label>
                <Select
                  defaultValue={user.role}
                  onValueChange={(value) => setValue('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">관리자</SelectItem>
                    <SelectItem value="USER">사용자</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-destructive text-sm">
                    {errors.role.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">부서</Label>
                <Input id="department" {...register('department')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">직급</Label>
                <Input id="position" {...register('position')} />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={updateUser.isPending}>
                {updateUser.isPending ? '저장 중...' : '저장'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/users')}
              >
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
