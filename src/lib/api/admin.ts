import { apiClient } from './client'
import type { PageResponse, PageParams } from '@/types/api'
import type { Board } from '@/types/board'
import type {
  AdminUser,
  CreateUserRequest,
  UpdateUserRequest,
  AdminDashboardStats,
  RecentUser,
} from '@/types/admin'

// 관리자 대시보드
export async function getAdminDashboardStats() {
  return apiClient.get('admin/dashboard/stats').json<AdminDashboardStats>()
}

export async function getRecentUsers() {
  return apiClient.get('admin/dashboard/recent-users').json<RecentUser[]>()
}

// 사용자 관리
export async function getUsers(params?: PageParams) {
  const searchParams: Record<string, string> = {}
  if (params?.page != null) searchParams.page = String(params.page)
  if (params?.size != null) searchParams.size = String(params.size)
  if (params?.search) searchParams.search = params.search

  return apiClient
    .get('admin/users', { searchParams })
    .json<PageResponse<AdminUser>>()
}

export async function getUser(userId: string) {
  return apiClient.get(`admin/users/${userId}`).json<AdminUser>()
}

export async function createUser(data: CreateUserRequest) {
  return apiClient.post('admin/users', { json: data }).json<AdminUser>()
}

export async function updateUser(userId: string, data: UpdateUserRequest) {
  return apiClient
    .put(`admin/users/${userId}`, { json: data })
    .json<AdminUser>()
}

export async function toggleUserActive(userId: string) {
  return apiClient
    .patch(`admin/users/${userId}/toggle-active`)
    .json<AdminUser>()
}

// 게시판 관리
export async function adminGetBoards() {
  return apiClient.get('admin/boards').json<Board[]>()
}

export async function createBoard(data: { name: string; description: string }) {
  return apiClient.post('admin/boards', { json: data }).json<Board>()
}

export async function updateBoard(
  boardId: string,
  data: { name: string; description: string }
) {
  return apiClient.put(`admin/boards/${boardId}`, { json: data }).json<Board>()
}

export async function toggleBoardActive(boardId: string) {
  return apiClient.patch(`admin/boards/${boardId}/toggle-active`).json<Board>()
}
