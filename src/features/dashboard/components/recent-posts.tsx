"use client";

import Link from "next/link";
import { usePosts } from "@/features/board/hooks/use-posts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";

export function RecentPosts() {
  const { data, isLoading } = usePosts(0, { page: 0, size: 5 });

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 게시글</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : !data?.content.length ? (
          <p className="text-muted-foreground py-4 text-center text-sm">
            게시글이 없습니다.
          </p>
        ) : (
          <div className="space-y-1">
            {data.content.map((post) => (
              <Link
                key={post.id}
                href={`/boards/${post.boardId}/posts/${post.id}`}
                className="hover:bg-accent flex items-center justify-between rounded-md px-3 py-2 transition-colors"
              >
                <span className="truncate text-sm font-medium">
                  {post.title}
                </span>
                <span className="text-muted-foreground shrink-0 text-xs">
                  {formatDate(post.createdAt)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
