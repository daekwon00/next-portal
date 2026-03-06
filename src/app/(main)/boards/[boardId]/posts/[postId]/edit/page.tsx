"use client";

import { useParams, useRouter } from "next/navigation";
import { usePost, useUpdatePost } from "@/features/board/hooks/use-posts";
import { PostForm } from "@/features/board/components/post-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditPostPage() {
  const { boardId, postId } = useParams<{
    boardId: string;
    postId: string;
  }>();
  const router = useRouter();
  const { data: post, isLoading } = usePost(Number(postId));
  const updatePost = useUpdatePost();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">게시글 수정</h1>
      <PostForm
        boardId={Number(boardId)}
        initialData={post}
        isLoading={updatePost.isPending}
        onSubmit={(data) => {
          updatePost.mutate(
            {
              postId: Number(postId),
              data: { title: data.title, content: data.content, fileIds: data.fileIds },
            },
            {
              onSuccess: () =>
                router.push(`/boards/${boardId}/posts/${postId}`),
            }
          );
        }}
      />
    </div>
  );
}
