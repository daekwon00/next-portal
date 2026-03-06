import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPosts, getPost, createPost, updatePost, deletePost } from "@/lib/api/post";
import type { PageParams } from "@/types/api";
import type { CreatePostRequest, UpdatePostRequest } from "@/types/board";

export function usePosts(boardId: number, params?: PageParams) {
  return useQuery({
    queryKey: ["posts", boardId, params],
    queryFn: () => getPosts(boardId, params),
    enabled: !!boardId,
    placeholderData: (prev) => prev,
  });
}

export function usePost(postId: number) {
  return useQuery({
    queryKey: ["posts", "detail", postId],
    queryFn: () => getPost(postId),
    enabled: !!postId,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => createPost(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts", variables.boardId] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }: { postId: number; data: UpdatePostRequest }) =>
      updatePost(postId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({
        queryKey: ["posts", "detail", variables.postId],
      });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
