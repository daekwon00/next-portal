import { http, HttpResponse } from "msw";

const MOCK_USERS = [
  {
    id: 1,
    username: "admin",
    password: "admin1234",
    name: "관리자",
    email: "admin@example.com",
    role: "ADMIN",
  },
  {
    id: 2,
    username: "user",
    password: "user1234",
    name: "일반사용자",
    email: "user@example.com",
    role: "USER",
  },
];

export const authHandlers = [
  http.post("*/api/v1/auth/login", async ({ request }) => {
    const body = (await request.json()) as {
      username: string;
      password: string;
    };

    const user = MOCK_USERS.find(
      (u) => u.username === body.username && u.password === body.password
    );

    if (!user) {
      return HttpResponse.json(
        { message: "아이디 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    const { password: _, ...userInfo } = user;

    return HttpResponse.json({
      accessToken: `mock-access-token-${user.id}`,
      refreshToken: `mock-refresh-token-${user.id}`,
      user: userInfo,
    });
  }),

  http.post("*/api/v1/auth/register", async ({ request }) => {
    const body = (await request.json()) as {
      username: string;
      name: string;
      email: string;
      password: string;
    };

    const exists = MOCK_USERS.find((u) => u.username === body.username);
    if (exists) {
      return HttpResponse.json(
        { message: "이미 존재하는 아이디입니다." },
        { status: 409 }
      );
    }

    return HttpResponse.json(
      {
        id: MOCK_USERS.length + 1,
        username: body.username,
        name: body.name,
        email: body.email,
        role: "USER",
      },
      { status: 201 }
    );
  }),

  http.post("*/api/v1/auth/refresh", async () => {
    return HttpResponse.json({
      accessToken: "mock-refreshed-access-token",
    });
  }),
];
