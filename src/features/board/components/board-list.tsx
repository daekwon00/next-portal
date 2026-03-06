"use client";

import { useBoards } from "../hooks/use-boards";
import { BoardCard } from "./board-card";
import { Skeleton } from "@/components/ui/skeleton";

export function BoardList() {
  const { data: boards, isLoading } = useBoards();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!boards?.length) {
    return (
      <p className="text-muted-foreground py-10 text-center">
        등록된 게시판이 없습니다.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {boards
        .filter((b) => b.isActive)
        .map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}
    </div>
  );
}
