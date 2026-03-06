"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import type { Board } from "@/types/board";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function BoardCard({ board }: { board: Board }) {
  return (
    <Link href={`/boards/${board.id}`}>
      <Card className="transition-colors hover:border-primary">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              <FileText className="size-5" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">{board.name}</CardTitle>
              <CardDescription className="text-sm">
                {board.description}
              </CardDescription>
            </div>
            {board.postCount != null && (
              <span className="text-muted-foreground text-sm">
                {board.postCount}개 게시글
              </span>
            )}
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
