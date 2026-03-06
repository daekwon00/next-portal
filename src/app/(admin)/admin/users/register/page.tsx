"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createUserSchema, type CreateUserFormValues } from "@/features/admin/schemas";
import { useCreateUser } from "@/features/admin/hooks/use-admin-users";

export default function AdminUserRegisterPage() {
  const router = useRouter();
  const createUser = useCreateUser();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: "",
    },
  });

  function onSubmit(data: CreateUserFormValues) {
    createUser.mutate(data, {
      onSuccess: () => {
        toast.success("사용자가 등록되었습니다.");
        router.push("/admin/users");
      },
      onError: () => toast.error("사용자 등록에 실패했습니다."),
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader title="사용자 등록" description="새로운 사용자를 등록합니다.">
        <Button variant="outline" onClick={() => router.push("/admin/users")}>
          <ArrowLeft className="mr-2 size-4" />
          목록으로
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>사용자 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">아이디</Label>
                <Input id="username" {...register("username")} placeholder="4자 이상" />
                {errors.username && (
                  <p className="text-destructive text-sm">{errors.username.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="8자 이상"
                />
                {errors.password && (
                  <p className="text-destructive text-sm">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="text-destructive text-sm">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>역할</Label>
                <Select onValueChange={(value) => setValue("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="역할 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">관리자</SelectItem>
                    <SelectItem value="USER">사용자</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-destructive text-sm">{errors.role.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">부서</Label>
                <Input id="department" {...register("department")} placeholder="선택사항" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">직급</Label>
                <Input id="position" {...register("position")} placeholder="선택사항" />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={createUser.isPending}>
                {createUser.isPending ? "등록 중..." : "등록"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/users")}>
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
