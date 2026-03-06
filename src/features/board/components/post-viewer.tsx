"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Download, Edit, Trash2 } from "lucide-react";
import type { Post } from "@/types/board";
import { formatDateTime } from "@/lib/format";
import { formatNumber } from "@/lib/format";
import { downloadFile } from "@/lib/api/file";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface PostViewerProps {
  post: Post;
  onDelete: () => void;
}

export function PostViewer({ post, onDelete }: PostViewerProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const isAuthor = session?.user?.username === post.author.username;

  async function handleDownload(fileId: number, fileName: string) {
    const blob = await downloadFile(fileId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <div className="text-muted-foreground mt-2 flex items-center gap-4 text-sm">
          <span>{post.author.name}</span>
          <span>{formatDateTime(post.createdAt)}</span>
          <span>조회 {formatNumber(post.viewCount)}</span>
        </div>
      </div>

      <Separator />

      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.files.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <h3 className="text-sm font-medium">
              첨부파일 ({post.files.length})
            </h3>
            <div className="space-y-1">
              {post.files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => handleDownload(file.id, file.originalName)}
                  className="text-primary flex items-center gap-2 text-sm hover:underline"
                >
                  <Download className="size-4" />
                  <span>{file.originalName}</span>
                  <Badge variant="secondary" className="text-xs">
                    {(file.size / 1024).toFixed(0)} KB
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <Separator />

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => router.push(`/boards/${post.boardId}`)}
        >
          목록
        </Button>
        {isAuthor && (
          <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  `/boards/${post.boardId}/posts/${post.id}/edit`
                )
              }
            >
              <Edit className="size-4" />
              수정
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="size-4" />
              삭제
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
