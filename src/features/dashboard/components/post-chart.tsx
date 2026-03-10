'use client'

import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { usePostChart } from '../hooks/use-dashboard'

export function PostChart() {
  const [period, setPeriod] = useState<'7d' | '30d'>('7d')
  const { data: chartData, isLoading } = usePostChart(period)

  return (
    <div className="rounded-xl border">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <h3 className="text-sm font-semibold tracking-tight">게시글 추이</h3>
        <Tabs
          value={period}
          onValueChange={(v) => setPeriod(v as '7d' | '30d')}
        >
          <TabsList className="h-8">
            <TabsTrigger value="7d" className="text-xs">
              7일
            </TabsTrigger>
            <TabsTrigger value="30d" className="text-xs">
              30일
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="p-5">
        {isLoading ? (
          <Skeleton className="h-60 w-full rounded-lg" />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-popover-foreground)',
                  fontSize: '13px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="게시글"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#chartGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
