import { apiClient } from "./client";
import type { Board } from "@/types/board";

export async function getBoards() {
  return apiClient.get("boards").json<Board[]>();
}

export async function getBoard(boardId: number) {
  return apiClient.get(`boards/${boardId}`).json<Board>();
}
