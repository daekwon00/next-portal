'use client'

import { FileText, CalendarPlus, Users, UserPen } from 'lucide-react'
import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { formatNumber } from '@/lib/format'
import type { DashboardStats } from '@/types/dashboard'

const statsConfig = [
  {
    key: 'totalPosts' as const,
    label: '전체 게시글',
    icon: FileText,
    gradient: 'from-blue-500/10 to-blue-500/5',
    iconColor: 'text-blue-500',
  },
  {
    key: 'todayPosts' as const,
    label: '오늘 게시글',
    icon: CalendarPlus,
    gradient: 'from-emerald-500/10 to-emerald-500/5',
    iconColor: 'text-emerald-500',
  },
  {
    key: 'totalUsers' as const,
    label: '전체 사용자',
    icon: Users,
    gradient: 'from-violet-500/10 to-violet-500/5',
    iconColor: 'text-violet-500',
  },
  {
    key: 'myPosts' as const,
    label: '내 게시글',
    icon: UserPen,
    gradient: 'from-amber-500/10 to-amber-500/5',
    iconColor: 'text-amber-500',
  },
]

export function StatsCards({
  stats,
  isLoading,
}: {
  stats?: DashboardStats
  isLoading: boolean
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((item, i) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.3 }}
          className={`bg-gradient-to-br ${item.gradient} rounded-xl border p-4`}
        >
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-medium">
              {item.label}
            </span>
            <item.icon className={`size-4 ${item.iconColor}`} />
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {stats ? formatNumber(stats[item.key]) : 0}
          </p>
        </motion.div>
      ))}
    </div>
  )
}
