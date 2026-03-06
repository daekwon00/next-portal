"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Post } from "@/types/board";
import { formatDate } from "@/lib/format";
import Link from "next/link";

const columns: ColumnDef<Post>[] = [
  {
    accessorKey: "id",
    header: "번호",
    size: 80,
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "title",
    header: "제목",
    cell: ({ row }) => (
      <Link
        href={`/boards/${row.original.boardId}/posts/${row.original.id}`}
        className="hover:underline font-medium"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "author",
    header: "작성자",
    size: 120,
    cell: ({ row }) => row.original.author.name,
  },
  {
    accessorKey: "createdAt",
    header: "작성일",
    size: 120,
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    accessorKey: "viewCount",
    header: "조회",
    size: 80,
    cell: ({ row }) => row.original.viewCount,
  },
];

interface PostDataTableProps {
  data: Post[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PostDataTable({
  data,
  page,
  totalPages,
  onPageChange,
}: PostDataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  게시글이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 0}
          >
            <ChevronLeft className="size-4" />
            이전
          </Button>
          <span className="text-muted-foreground text-sm">
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages - 1}
          >
            다음
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
