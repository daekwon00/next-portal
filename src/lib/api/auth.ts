import { apiClient } from "./client";
import type { LoginRequest, LoginResponse, RegisterRequest } from "@/types/auth";

export async function login(credentials: LoginRequest) {
  return apiClient.post("auth/login", { json: credentials }).json<LoginResponse>();
}

export async function register(data: RegisterRequest) {
  return apiClient.post("auth/register", { json: data }).json();
}

export async function refreshToken(token: string) {
  return apiClient
    .post("auth/refresh", { json: { refreshToken: token } })
    .json<{ accessToken: string }>();
}
