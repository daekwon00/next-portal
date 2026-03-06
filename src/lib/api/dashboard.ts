import { apiClient } from "./client";
import type { DashboardStats, ChartData } from "@/types/dashboard";

export async function getDashboardStats() {
  return apiClient.get("dashboard/stats").json<DashboardStats>();
}

export async function getPostChart(period: "7d" | "30d") {
  return apiClient
    .get("dashboard/chart", { searchParams: { period } })
    .json<ChartData[]>();
}
