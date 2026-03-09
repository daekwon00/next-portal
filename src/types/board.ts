import type { AuthUser } from './auth'

export interface Board {
  id: string
  name: string
  description: string
  isActive: boolean
  postCount?: number
}

export interface Post {
  id: number
  boardId: string
  title: string
  content: string
  author: AuthUser
  viewCount: number
  files: FileInfo[]
  createdAt: string
  updatedAt: string
}

export interface FileInfo {
  id: string
  originalName: string
  storedName: string
  size: number
  contentType: string
}

export interface PostListItem {
  id: number
  boardId: string
  title: string
  authorName: string
  viewCount: number
  createdAt: string
  updatedAt: string
}

export interface CreatePostRequest {
  boardId: string
  title: string
  content: string
  fileIds?: string[]
}

export interface UpdatePostRequest {
  title: string
  content: string
  fileIds?: string[]
}
