"use client";

import { useParams, useRouter } from "next/navigation";
import { usePost, useDeletePost } from "@/features/board/hooks/use-posts";
import { PostViewer } from "@/features/board/components/post-viewer";
import { Skeleton } from "@/components/ui/skeleton";

export default function PostDetailPage() {
  const { boardId, postId } = useParams<{
    boardId: string;
    postId: string;
  }>();
  const router = useRouter();
  const { data: post, isLoading } = usePost(Number(postId));
  const deletePost = useDeletePost();

  function handleDelete() {
    deletePost.mutate(Number(postId), {
      onSuccess: () => router.push(`/boards/${boardId}`),
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <p className="text-muted-foreground py-10 text-center">
        게시글을 찾을 수 없습니다.
      </p>
    );
  }

  return <PostViewer post={post} onDelete={handleDelete} />;
}
