import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, getPostChart } from "@/lib/api/dashboard";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStats,
  });
}

export function usePostChart(period: "7d" | "30d") {
  return useQuery({
    queryKey: ["dashboard", "chart", period],
    queryFn: () => getPostChart(period),
  });
}
