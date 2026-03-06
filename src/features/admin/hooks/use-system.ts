import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRoles, createRole, updateRole, deleteRole,
  getMenus, createMenu, updateMenu, deleteMenu,
  getMenuRoles, updateMenuRoles,
  getCodeGroups, getCodes, createCode, updateCode, deleteCode,
  getPositionRoles, updatePositionRoles,
} from "@/lib/api/system";
import type { CreateMenuRequest, CreateCodeRequest } from "@/types/admin";

// 역할
export function useRoles() {
  return useQuery({ queryKey: ["admin", "roles"], queryFn: getRoles });
}

export function useCreateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description: string }) => createRole(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "roles"] }),
  });
}

export function useUpdateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: number; data: { name: string; description: string } }) =>
      updateRole(roleId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "roles"] }),
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (roleId: number) => deleteRole(roleId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "roles"] }),
  });
}

// 메뉴
export function useMenus() {
  return useQuery({ queryKey: ["admin", "menus"], queryFn: getMenus });
}

export function useCreateMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMenuRequest) => createMenu(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "menus"] }),
  });
}

export function useUpdateMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ menuId, data }: { menuId: number; data: CreateMenuRequest }) =>
      updateMenu(menuId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "menus"] }),
  });
}

export function useDeleteMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (menuId: number) => deleteMenu(menuId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "menus"] }),
  });
}

// 메뉴-역할
export function useMenuRoles() {
  return useQuery({ queryKey: ["admin", "menu-roles"], queryFn: getMenuRoles });
}

export function useUpdateMenuRoles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, menuIds }: { roleId: number; menuIds: number[] }) =>
      updateMenuRoles(roleId, menuIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "menu-roles"] }),
  });
}

// 공통코드
export function useCodeGroups() {
  return useQuery({ queryKey: ["admin", "code-groups"], queryFn: getCodeGroups });
}

export function useCodes(groupCode?: string) {
  return useQuery({
    queryKey: ["admin", "codes", groupCode],
    queryFn: () => getCodes(groupCode),
    enabled: !!groupCode,
  });
}

export function useCreateCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCodeRequest) => createCode(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "codes"] }),
  });
}

export function useUpdateCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ codeId, data }: { codeId: string; data: Partial<CreateCodeRequest> }) =>
      updateCode(codeId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "codes"] }),
  });
}

export function useDeleteCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (codeId: string) => deleteCode(codeId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "codes"] }),
  });
}

// 직급-역할
export function usePositionRoles() {
  return useQuery({ queryKey: ["admin", "position-roles"], queryFn: getPositionRoles });
}

export function useUpdatePositionRoles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ positionId, roleIds }: { positionId: number; roleIds: number[] }) =>
      updatePositionRoles(positionId, roleIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "position-roles"] }),
  });
}
