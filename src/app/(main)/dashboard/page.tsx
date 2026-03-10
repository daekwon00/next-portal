'use client'

import { useSession } from 'next-auth/react'
import { useDashboardStats } from '@/features/dashboard/hooks/use-dashboard'
import { StatsCards } from '@/features/dashboard/components/stats-cards'
import { PostChartLazy } from '@/features/dashboard/components/post-chart-lazy'
import { RecentPosts } from '@/features/dashboard/components/recent-posts'
import { QuickLinks } from '@/features/dashboard/components/quick-links'

export default function DashboardPage() {
  const { data: session } = useSession()
  const { data: stats, isLoading } = useDashboardStats()
  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          안녕하세요, {session?.user?.name ?? '사용자'}님
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          오늘의 현황을 확인하세요.
        </p>
      </div>
      <StatsCards stats={stats} isLoading={isLoading} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <PostChartLazy />
          <RecentPosts />
        </div>
        <QuickLinks isAdmin={isAdmin} />
      </div>
    </div>
  )
}
