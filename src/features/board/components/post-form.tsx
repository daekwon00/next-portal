"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, type PostFormValues } from "../schemas/post-schema";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { FileUpload } from "@/components/common/file-upload";
import { uploadFiles } from "@/lib/api/file";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Post } from "@/types/board";

interface PostFormProps {
  boardId: number;
  initialData?: Post;
  onSubmit: (data: PostFormValues & { fileIds: number[] }) => void;
  isLoading?: boolean;
}

export function PostForm({
  initialData,
  onSubmit,
  isLoading,
}: PostFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      content: initialData?.content ?? "",
    },
  });

  async function handleFormSubmit(data: PostFormValues) {
    let fileIds: number[] = [];

    if (files.length > 0) {
      setUploading(true);
      try {
        const uploaded = await uploadFiles(files);
        fileIds = uploaded.map((f) => f.id);
      } catch {
        alert("파일 업로드에 실패했습니다.");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    onSubmit({ ...data, fileIds });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          placeholder="제목을 입력하세요"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-destructive text-sm">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>내용</Label>
        <TiptapEditor
          content={initialData?.content ?? ""}
          onChange={(html) => setValue("content", html, { shouldValidate: true })}
        />
        {errors.content && (
          <p className="text-destructive text-sm">{errors.content.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>첨부파일</Label>
        <FileUpload files={files} onChange={setFiles} />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading || uploading}>
          {uploading
            ? "파일 업로드 중..."
            : isLoading
              ? "저장 중..."
              : initialData
                ? "수정"
                : "작성"}
        </Button>
      </div>
    </form>
  );
}
