import { useQuery } from "@tanstack/react-query";
import { getBoards, getBoard } from "@/lib/api/board";

export function useBoards() {
  return useQuery({
    queryKey: ["boards"],
    queryFn: getBoards,
  });
}

export function useBoard(boardId: number) {
  return useQuery({
    queryKey: ["boards", boardId],
    queryFn: () => getBoard(boardId),
    enabled: !!boardId,
  });
}
