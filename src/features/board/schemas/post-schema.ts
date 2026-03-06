import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 입력해주세요")
    .max(200, "제목은 200자 이하여야 합니다"),
  content: z.string().min(1, "내용을 입력해주세요"),
});

export type PostFormValues = z.infer<typeof postSchema>;
