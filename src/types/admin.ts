import type { UserProfile } from "./user";

export interface AdminUser extends UserProfile {
  isActive: boolean;
  lastLoginAt?: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  position?: string;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  role: string;
  department?: string;
  position?: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface Menu {
  id: number;
  name: string;
  path: string;
  icon?: string;
  parentId?: number;
  sortOrder: number;
  isActive: boolean;
  children?: Menu[];
}

export interface CreateMenuRequest {
  name: string;
  path: string;
  icon?: string;
  parentId?: number;
  sortOrder: number;
}

export interface MenuRole {
  menuId: number;
  roleId: number;
}

export interface CommonCodeGroup {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CommonCode {
  id: string;
  groupCode: string;
  code: string;
  name: string;
  value?: string;
  sortOrder: number;
  isActive: boolean;
  description?: string;
}

export interface CreateCodeRequest {
  groupCode: string;
  code: string;
  name: string;
  value?: string;
  sortOrder: number;
  description?: string;
}

export interface PositionRole {
  positionId: number;
  positionName: string;
  roleIds: number[];
}

export interface AdminDashboardStats {
  totalUsers: number;
  todayRegistered: number;
  activeBoards: number;
  todayPosts: number;
}

export interface RecentUser {
  id: number;
  username: string;
  name: string;
  email: string;
  createdAt: string;
}
