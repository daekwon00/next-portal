import { ChangePasswordForm } from "@/features/user/components/change-password-form";

export default function ChangePasswordPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">비밀번호 변경</h1>
      <ChangePasswordForm />
    </div>
  );
}
