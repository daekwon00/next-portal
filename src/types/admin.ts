import type { UserProfile } from './user'

export interface AdminUser extends UserProfile {
  isActive: boolean
  lastLoginAt?: string
}

export interface CreateUserRequest {
  username: string
  password: string
  name: string
  email: string
  role: string
  department?: string
  position?: string
}

export interface UpdateUserRequest {
  name: string
  email: string
  role: string
  department?: string
  position?: string
}

export interface Role {
  id: string
  name: string
  description: string
}

export interface Menu {
  id: string
  name: string
  path: string
  icon?: string
  parentId?: string
  sortOrder: number
  isActive: boolean
  children?: Menu[]
}

export interface CreateMenuRequest {
  name: string
  path: string
  icon?: string
  parentId?: string
  sortOrder: number
}

export interface MenuRole {
  menuId: string
  roleId: string
}

export interface CommonCodeGroup {
  id: string
  name: string
  description?: string
  isActive: boolean
}

export interface CommonCode {
  id: string
  groupCode: string
  code: string
  name: string
  value?: string
  sortOrder: number
  isActive: boolean
  description?: string
}

export interface CreateCodeRequest {
  groupCode: string
  code: string
  name: string
  value?: string
  sortOrder: number
  description?: string
}

export interface PositionRole {
  positionId: string
  positionName: string
  roleIds: string[]
}

export interface AdminDashboardStats {
  totalUsers: number
  todayRegistered: number
  activeBoards: number
  todayPosts: number
}

export interface RecentUser {
  id: string
  username: string
  name: string
  email: string
  createdAt: string
}
