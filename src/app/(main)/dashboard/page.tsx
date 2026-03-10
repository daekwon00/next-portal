'use client'

import Link from 'next/link'
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-muted-foreground text-sm">
          안녕하세요,{' '}
          <span className="font-medium">{session?.user?.name ?? '사용자'}</span>
          님!
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
