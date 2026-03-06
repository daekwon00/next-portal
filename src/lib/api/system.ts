import { apiClient } from "./client";
import type {
  Role,
  Menu,
  CreateMenuRequest,
  MenuRole,
  CommonCodeGroup,
  CommonCode,
  CreateCodeRequest,
  PositionRole,
} from "@/types/admin";

// 역할 관리
export async function getRoles() {
  return apiClient.get("admin/roles").json<Role[]>();
}

export async function createRole(data: { name: string; description: string }) {
  return apiClient.post("admin/roles", { json: data }).json<Role>();
}

export async function updateRole(roleId: number, data: { name: string; description: string }) {
  return apiClient.put(`admin/roles/${roleId}`, { json: data }).json<Role>();
}

export async function deleteRole(roleId: number) {
  return apiClient.delete(`admin/roles/${roleId}`).json();
}

// 메뉴 관리
export async function getMenus() {
  return apiClient.get("admin/menus").json<Menu[]>();
}

export async function createMenu(data: CreateMenuRequest) {
  return apiClient.post("admin/menus", { json: data }).json<Menu>();
}

export async function updateMenu(menuId: number, data: CreateMenuRequest) {
  return apiClient.put(`admin/menus/${menuId}`, { json: data }).json<Menu>();
}

export async function deleteMenu(menuId: number) {
  return apiClient.delete(`admin/menus/${menuId}`).json();
}

// 메뉴-역할 매핑
export async function getMenuRoles() {
  return apiClient.get("admin/menu-roles").json<MenuRole[]>();
}

export async function updateMenuRoles(roleId: number, menuIds: number[]) {
  return apiClient.put(`admin/menu-roles/${roleId}`, { json: { menuIds } }).json();
}

// 공통코드 관리
export async function getCodeGroups() {
  return apiClient.get("admin/code-groups").json<CommonCodeGroup[]>();
}

export async function getCodes(groupCode?: string) {
  const searchParams = groupCode ? { groupCode } : {};
  return apiClient.get("admin/codes", { searchParams }).json<CommonCode[]>();
}

export async function createCode(data: CreateCodeRequest) {
  return apiClient.post("admin/codes", { json: data }).json<CommonCode>();
}

export async function updateCode(codeId: string, data: Partial<CreateCodeRequest>) {
  return apiClient.put(`admin/codes/${codeId}`, { json: data }).json<CommonCode>();
}

export async function deleteCode(codeId: string) {
  return apiClient.delete(`admin/codes/${codeId}`).json();
}

// 직급-역할 매핑
export async function getPositionRoles() {
  return apiClient.get("admin/position-roles").json<PositionRole[]>();
}

export async function updatePositionRoles(positionId: number, roleIds: number[]) {
  return apiClient.put(`admin/position-roles/${positionId}`, { json: { roleIds } }).json();
}
