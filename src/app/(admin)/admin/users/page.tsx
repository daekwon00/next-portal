"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminUsers, useToggleUserActive } from "@/features/admin/hooks/use-admin-users";
import { useDebounce } from "@/hooks/use-debounce";
import { formatDate } from "@/lib/format";
import type { AdminUser } from "@/types/admin";

export default function AdminUsersPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useAdminUsers({ page, size: 10, search: debouncedSearch });
  const toggleActive = useToggleUserActive();

  function handleToggleActive(userId: number) {
    toggleActive.mutate(userId, {
      onSuccess: () => toast.success("상태가 변경되었습니다."),
      onError: () => toast.error("상태 변경에 실패했습니다."),
    });
  }

  const columns: ColumnDef<AdminUser>[] = [
    {
      accessorKey: "username",
      header: "아이디",
      size: 120,
    },
    {
      accessorKey: "name",
      header: "이름",
      size: 100,
      cell: ({ row }) => (
        <button
          className="hover:underline font-medium"
          onClick={() => router.push(`/admin/users/${row.original.id}/edit`)}
        >
          {row.original.name}
        </button>
      ),
    },
    {
      accessorKey: "email",
      header: "이메일",
    },
    {
      accessorKey: "role",
      header: "역할",
      size: 100,
      cell: ({ row }) => (
        <Badge variant={row.original.role === "ADMIN" ? "default" : "secondary"}>
          {row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: "isActive",
      header: "상태",
      size: 80,
      cell: ({ row }) => (
        <Switch
          checked={row.original.isActive}
          onCheckedChange={() => handleToggleActive(row.original.id)}
        />
      ),
    },
    {
      accessorKey: "createdAt",
      header: "가입일",
      size: 120,
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
  ];

  const table = useReactTable({
    data: data?.content ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader title="사용자 관리" description="사용자를 조회하고 관리합니다.">
        <Button onClick={() => router.push("/admin/users/register")}>
          <Plus className="mr-2 size-4" />
          사용자 등록
        </Button>
      </PageHeader>

      <div className="relative max-w-sm">
        <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          placeholder="이름 또는 이메일로 검색"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} style={{ width: header.getSize() }}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
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
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      사용자가 없습니다.
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
                onClick={() => setPage(page - 1)}
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
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}
              >
                다음
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
