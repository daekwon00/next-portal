import { http, HttpResponse } from "msw";

const MOCK_PROFILE = {
  id: 1,
  username: "admin",
  name: "관리자",
  email: "admin@example.com",
  phone: "010-1234-5678",
  department: "개발팀",
  position: "선임",
  role: "ADMIN",
  createdAt: "2026-01-15T09:00:00.000Z",
};

export const userHandlers = [
  http.get("*/api/v1/users/me", () => {
    return HttpResponse.json(MOCK_PROFILE);
  }),

  http.put("*/api/v1/users/me", async ({ request }) => {
    const body = (await request.json()) as { name: string; email: string; phone?: string };
    MOCK_PROFILE.name = body.name;
    MOCK_PROFILE.email = body.email;
    if (body.phone) MOCK_PROFILE.phone = body.phone;
    return HttpResponse.json(MOCK_PROFILE);
  }),

  http.put("*/api/v1/users/me/password", async ({ request }) => {
    const body = (await request.json()) as { currentPassword: string; newPassword: string };
    if (body.currentPassword !== "admin1234") {
      return HttpResponse.json(
        { message: "현재 비밀번호가 올바르지 않습니다." },
        { status: 400 }
      );
    }
    return HttpResponse.json({ success: true });
  }),
];
