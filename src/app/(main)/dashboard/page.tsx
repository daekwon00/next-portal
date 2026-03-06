'use client'

import { useDashboardStats } from '@/features/dashboard/hooks/use-dashboard'
import { StatsCards } from '@/features/dashboard/components/stats-cards'
import { PostChartLazy } from '@/features/dashboard/components/post-chart-lazy'
import { RecentPosts } from '@/features/dashboard/components/recent-posts'

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">대시보드</h1>
      <StatsCards stats={stats} isLoading={isLoading} />
      <div className="grid gap-6 lg:grid-cols-2">
        <PostChartLazy />
        <RecentPosts />
      </div>
    </div>
  )
}
