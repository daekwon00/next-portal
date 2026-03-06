import type { AuthUser } from "./auth";

export interface Board {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  postCount?: number;
}

export interface Post {
  id: number;
  boardId: number;
  title: string;
  content: string;
  author: AuthUser;
  viewCount: number;
  files: FileInfo[];
  createdAt: string;
  updatedAt: string;
}

export interface FileInfo {
  id: number;
  originalName: string;
  storedName: string;
  size: number;
  contentType: string;
}

export interface CreatePostRequest {
  boardId: number;
  title: string;
  content: string;
  fileIds?: number[];
}

export interface UpdatePostRequest {
  title: string;
  content: string;
  fileIds?: number[];
}
