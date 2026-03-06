import { ProfileForm } from "@/features/user/components/profile-form";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">프로필</h1>
      <ProfileForm />
    </div>
  );
}
