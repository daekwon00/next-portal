import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  toggleUserActive,
} from '@/lib/api/admin'
import type { PageParams } from '@/types/api'
import type { CreateUserRequest, UpdateUserRequest } from '@/types/admin'

export function useAdminUsers(params?: PageParams) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => getUsers(params),
    placeholderData: (prev) => prev,
  })
}

export function useAdminUser(userId: string) {
  return useQuery({
    queryKey: ['admin', 'users', userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUserRequest) => createUser(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string
      data: UpdateUserRequest
    }) => updateUser(userId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}

export function useToggleUserActive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => toggleUserActive(userId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}
