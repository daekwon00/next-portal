'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { getRecentPosts } from '@/lib/api/post'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/format'
import { FileText } from 'lucide-react'

function useRecentPosts() {
  return useQuery({
    queryKey: ['posts', 'recent'],
    queryFn: () => getRecentPosts(),
  })
}

export function RecentPosts() {
  const { data: posts, isLoading } = useRecentPosts()

  return (
    <div className="rounded-xl border">
      <div className="border-b px-5 py-4">
        <h3 className="text-sm font-semibold tracking-tight">최근 게시글</h3>
      </div>
      <div className="p-2">
        {isLoading ? (
          <div className="space-y-2 p-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full rounded-lg" />
            ))}
          </div>
        ) : !posts?.length ? (
          <div className="text-muted-foreground flex flex-col items-center gap-2 py-10 text-sm">
            <FileText className="size-8 opacity-40" />
            <p>게시글이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/boards/${post.boardId}/posts/${post.id}`}
                className="hover:bg-accent flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors"
              >
                <span className="truncate text-sm">{post.title}</span>
                <span className="text-muted-foreground shrink-0 pl-4 text-xs">
                  {formatDate(post.createdAt)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
