import { http, HttpResponse } from "msw";

export const dashboardHandlers = [
  http.get("*/api/v1/dashboard/stats", () => {
    return HttpResponse.json({
      totalPosts: 128,
      todayPosts: 7,
      totalUsers: 45,
      myPosts: 23,
    });
  }),

  http.get("*/api/v1/dashboard/chart", ({ request }) => {
    const url = new URL(request.url);
    const period = url.searchParams.get("period") ?? "7d";
    const days = period === "30d" ? 30 : 7;

    const chartData = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return {
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        count: Math.floor(Math.random() * 15) + 1,
      };
    });

    return HttpResponse.json(chartData);
  }),
];
