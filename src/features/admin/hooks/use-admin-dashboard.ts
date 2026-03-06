import { useQuery } from "@tanstack/react-query";
import { getAdminDashboardStats, getRecentUsers } from "@/lib/api/admin";

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: ["admin", "dashboard", "stats"],
    queryFn: getAdminDashboardStats,
  });
}

export function useRecentUsers() {
  return useQuery({
    queryKey: ["admin", "dashboard", "recent-users"],
    queryFn: getRecentUsers,
  });
}
