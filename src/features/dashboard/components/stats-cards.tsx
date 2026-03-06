"use client";

import { FileText, CalendarPlus, Users, UserPen } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/format";
import type { DashboardStats } from "@/types/dashboard";

const statsConfig = [
  { key: "totalPosts" as const, label: "전체 게시글", icon: FileText, color: "text-blue-500" },
  { key: "todayPosts" as const, label: "오늘 게시글", icon: CalendarPlus, color: "text-green-500" },
  { key: "totalUsers" as const, label: "전체 사용자", icon: Users, color: "text-purple-500" },
  { key: "myPosts" as const, label: "내 게시글", icon: UserPen, color: "text-orange-500" },
];

export function StatsCards({ stats, isLoading }: { stats?: DashboardStats; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((item, i) => (
        <Card key={item.key}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
            <item.icon className={`size-5 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-2xl font-bold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {stats ? formatNumber(stats[item.key]) : 0}
            </motion.div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
