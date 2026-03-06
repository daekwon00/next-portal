'use client'

import { useCallback, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useBoard } from '@/features/board/hooks/use-boards'
import { usePosts } from '@/features/board/hooks/use-posts'
import { PostDataTable } from '@/features/board/components/post-data-table'
import { SearchInput } from '@/components/common/search-input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function BoardPostsPage() {
  const { boardId } = useParams<{ boardId: string }>()

  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [searchType, setSearchType] = useState<string>('all')

  const { data: board } = useBoard(boardId)
  const { data: postsData, isLoading } = usePosts(boardId, {
    page,
    size: 10,
    search: search || undefined,
    searchType: searchType as 'title' | 'author' | 'all',
  })

  const handleSearch = useCallback((newSearch: string, newType: string) => {
    setSearch(newSearch)
    setSearchType(newType)
    setPage(0)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {board?.name ?? <Skeleton className="h-8 w-32" />}
        </h1>
        <Button asChild>
          <Link href={`/boards/${boardId}/write`}>
            <Plus className="size-4" />
            글쓰기
          </Link>
        </Button>
      </div>

      <SearchInput onSearch={handleSearch} />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <PostDataTable
          data={postsData?.content ?? []}
          page={postsData?.page ?? 0}
          totalPages={postsData?.totalPages ?? 0}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
