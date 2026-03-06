import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  adminGetBoards,
  createBoard,
  updateBoard,
  toggleBoardActive,
} from '@/lib/api/admin'

export function useAdminBoards() {
  return useQuery({
    queryKey: ['admin', 'boards'],
    queryFn: adminGetBoards,
  })
}

export function useCreateBoard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; description: string }) =>
      createBoard(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin', 'boards'] }),
  })
}

export function useUpdateBoard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      boardId,
      data,
    }: {
      boardId: string
      data: { name: string; description: string }
    }) => updateBoard(boardId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin', 'boards'] }),
  })
}

export function useToggleBoardActive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (boardId: string) => toggleBoardActive(boardId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin', 'boards'] }),
  })
}
