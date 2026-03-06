'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

export const PostChartLazy = dynamic(
  () =>
    import('@/features/dashboard/components/post-chart').then((mod) => ({
      default: mod.PostChart,
    })),
  {
    loading: () => <Skeleton className="h-80 w-full" />,
    ssr: false,
  }
)
