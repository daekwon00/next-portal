'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Plus, Pencil } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  useAdminBoards,
  useCreateBoard,
  useUpdateBoard,
  useToggleBoardActive,
} from '@/features/admin/hooks/use-admin-boards'
import { boardSchema, type BoardFormValues } from '@/features/admin/schemas'
import type { Board } from '@/types/board'

export default function AdminBoardsPage() {
  const { data: boards, isLoading } = useAdminBoards()
  const createBoard = useCreateBoard()
  const updateBoard = useUpdateBoard()
  const toggleActive = useToggleBoardActive()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBoard, setEditingBoard] = useState<Board | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BoardFormValues>({
    resolver: zodResolver(boardSchema),
  })

  function openCreate() {
    setEditingBoard(null)
    reset({ name: '', description: '' })
    setDialogOpen(true)
  }

  function openEdit(board: Board) {
    setEditingBoard(board)
    reset({ name: board.name, description: board.description })
    setDialogOpen(true)
  }

  function onSubmit(data: BoardFormValues) {
    if (editingBoard) {
      updateBoard.mutate(
        { boardId: editingBoard.id, data },
        {
          onSuccess: () => {
            toast.success('게시판이 수정되었습니다.')
            setDialogOpen(false)
          },
          onError: () => toast.error('게시판 수정에 실패했습니다.'),
        }
      )
    } else {
      createBoard.mutate(data, {
        onSuccess: () => {
          toast.success('게시판이 생성되었습니다.')
          setDialogOpen(false)
        },
        onError: () => toast.error('게시판 생성에 실패했습니다.'),
      })
    }
  }

  function handleToggleActive(boardId: string) {
    toggleActive.mutate(boardId, {
      onSuccess: () => toast.success('상태가 변경되었습니다.'),
      onError: () => toast.error('상태 변경에 실패했습니다.'),
    })
  }

  const isPending = createBoard.isPending || updateBoard.isPending

  return (
    <div className="space-y-6">
      <PageHeader
        title="게시판 관리"
        description="게시판을 생성하고 관리합니다."
      >
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 size-4" />
              게시판 생성
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBoard ? '게시판 수정' : '게시판 생성'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">게시판 이름</Label>
                <Input id="name" {...register('name')} />
                {errors.name && (
                  <p className="text-destructive text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Input id="description" {...register('description')} />
                {errors.description && (
                  <p className="text-destructive text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  취소
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? '저장 중...' : editingBoard ? '수정' : '생성'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: 60 }}>ID</TableHead>
                <TableHead style={{ width: 180 }}>이름</TableHead>
                <TableHead>설명</TableHead>
                <TableHead style={{ width: 100 }}>게시글 수</TableHead>
                <TableHead style={{ width: 80 }}>상태</TableHead>
                <TableHead style={{ width: 80 }}>관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {boards?.length ? (
                boards.map((board) => (
                  <TableRow key={board.id}>
                    <TableCell className="text-muted-foreground">
                      {board.id}
                    </TableCell>
                    <TableCell className="font-medium">{board.name}</TableCell>
                    <TableCell>{board.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{board.postCount ?? 0}</Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={board.isActive}
                        onCheckedChange={() => handleToggleActive(board.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(board)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    게시판이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
