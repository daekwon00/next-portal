import { apiClient } from './client'
import type {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  LoginHistory,
} from '@/types/user'

export async function getProfile() {
  return apiClient.get('users/me').json<UserProfile>()
}

export async function updateProfile(data: UpdateProfileRequest) {
  return apiClient.put('users/me', { json: data }).json<UserProfile>()
}

export async function changePassword(data: ChangePasswordRequest) {
  return apiClient.put('users/me/password', { json: data }).json()
}

export async function getLoginHistory(size = 10) {
  return apiClient
    .get('users/me/login-history', { searchParams: { size: String(size) } })
    .json<LoginHistory[]>()
}
