import { apiClient } from "./client";
import type { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from "@/types/user";

export async function getProfile() {
  return apiClient.get("users/me").json<UserProfile>();
}

export async function updateProfile(data: UpdateProfileRequest) {
  return apiClient.put("users/me", { json: data }).json<UserProfile>();
}

export async function changePassword(data: ChangePasswordRequest) {
  return apiClient.put("users/me/password", { json: data }).json();
}
