import type { Metadata } from 'next'
import { BoardList } from '@/features/board/components/board-list'

export const metadata: Metadata = {
  title: '게시판 | Next Portal',
}

export default function BoardsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">게시판</h1>
      <BoardList />
    </div>
  )
}
