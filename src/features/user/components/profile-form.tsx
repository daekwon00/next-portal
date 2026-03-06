"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { profileSchema, type ProfileFormValues } from "../schemas";
import { useProfile, useUpdateProfile } from "../hooks/use-profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileForm() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: profile
      ? { name: profile.name, email: profile.email, phone: profile.phone ?? "" }
      : undefined,
  });

  function onSubmit(data: ProfileFormValues) {
    updateProfile.mutate(data, {
      onSuccess: () => toast.success("프로필이 수정되었습니다."),
      onError: () => toast.error("프로필 수정에 실패했습니다."),
    });
  }

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>프로필 정보</CardTitle>
        <CardDescription>개인 정보를 수정할 수 있습니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>아이디</Label>
            <Input value={profile?.username ?? ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>부서</Label>
            <Input value={profile?.department ?? "-"} disabled />
          </div>
          <div className="space-y-2">
            <Label>직급</Label>
            <Input value={profile?.position ?? "-"} disabled />
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="phone">전화번호</Label>
            <Input id="phone" {...register("phone")} placeholder="010-0000-0000" />
          </div>
          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? "저장 중..." : "저장"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
