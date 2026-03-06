"use client";

import { useAdminDashboardStats } from "@/features/admin/hooks/use-admin-dashboard";
import { AdminStatsCards } from "@/features/admin/components/admin-stats-cards";
import { RecentUsersCard } from "@/features/admin/components/recent-users-card";
import { PageHeader } from "@/components/common/page-header";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminDashboardStats();

  return (
    <div className="space-y-6">
      <PageHeader
        title="관리자 대시보드"
        description="시스템 현황을 한눈에 확인하세요"
      />
      <AdminStatsCards stats={stats} isLoading={isLoading} />
      <RecentUsersCard />
    </div>
  );
}
