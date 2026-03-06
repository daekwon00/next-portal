"use client";

import { useParams, useRouter } from "next/navigation";
import { useBoard } from "@/features/board/hooks/use-boards";
import { useCreatePost } from "@/features/board/hooks/use-posts";
import { PostForm } from "@/features/board/components/post-form";

export default function WritePostPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const router = useRouter();
  const id = Number(boardId);
  const { data: board } = useBoard(id);
  const createPost = useCreatePost();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {board?.name ? `${board.name} - 글쓰기` : "글쓰기"}
      </h1>
      <PostForm
        boardId={id}
        isLoading={createPost.isPending}
        onSubmit={(data) => {
          createPost.mutate(
            { boardId: id, title: data.title, content: data.content, fileIds: data.fileIds },
            { onSuccess: () => router.push(`/boards/${boardId}`) }
          );
        }}
      />
    </div>
  );
}
