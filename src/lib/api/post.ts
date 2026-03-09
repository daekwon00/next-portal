import { apiClient } from './client'
import type {
  Post,
  PostListItem,
  CreatePostRequest,
  UpdatePostRequest,
} from '@/types/board'
import type { PageResponse, PageParams } from '@/types/api'

export async function getPosts(boardId: string, params?: PageParams) {
  const searchParams: Record<string, string> = {}
  if (params?.page != null) searchParams.page = String(params.page)
  if (params?.size != null) searchParams.size = String(params.size)
  if (params?.search) searchParams.search = params.search
  if (params?.searchType) searchParams.searchType = params.searchType

  return apiClient
    .get(`boards/${boardId}/posts`, { searchParams })
    .json<PageResponse<PostListItem>>()
}

export async function getPost(postId: number) {
  return apiClient.get(`posts/${postId}`).json<Post>()
}

export async function createPost(data: CreatePostRequest) {
  return apiClient.post('posts', { json: data }).json<Post>()
}

export async function updatePost(postId: number, data: UpdatePostRequest) {
  return apiClient.put(`posts/${postId}`, { json: data }).json<Post>()
}

export async function deletePost(postId: number) {
  return apiClient.delete(`posts/${postId}`).json()
}

export async function getRecentPosts() {
  return apiClient.get('posts/recent').json<PostListItem[]>()
}
