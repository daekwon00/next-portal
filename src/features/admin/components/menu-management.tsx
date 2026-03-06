"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { useMenus, useCreateMenu, useUpdateMenu, useDeleteMenu } from "../hooks/use-system";
import { menuSchema, type MenuFormValues } from "../schemas";
import type { Menu } from "@/types/admin";

export function MenuManagement() {
  const { data: menus, isLoading } = useMenus();
  const createMenu = useCreateMenu();
  const updateMenu = useUpdateMenu();
  const deleteMenu = useDeleteMenu();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MenuFormValues>({
    resolver: zodResolver(menuSchema),
  });

  function openCreate() {
    setEditingMenu(null);
    reset({ name: "", path: "", icon: "", sortOrder: 0 });
    setDialogOpen(true);
  }

  function openEdit(menu: Menu) {
    setEditingMenu(menu);
    reset({
      name: menu.name,
      path: menu.path,
      icon: menu.icon ?? "",
      parentId: menu.parentId,
      sortOrder: menu.sortOrder,
    });
    setDialogOpen(true);
  }

  function onSubmit(data: MenuFormValues) {
    if (editingMenu) {
      updateMenu.mutate(
        { menuId: editingMenu.id, data },
        {
          onSuccess: () => { toast.success("메뉴가 수정되었습니다."); setDialogOpen(false); },
          onError: () => toast.error("메뉴 수정에 실패했습니다."),
        },
      );
    } else {
      createMenu.mutate(data, {
        onSuccess: () => { toast.success("메뉴가 생성되었습니다."); setDialogOpen(false); },
        onError: () => toast.error("메뉴 생성에 실패했습니다."),
      });
    }
  }

  function handleDelete(menuId: number) {
    deleteMenu.mutate(menuId, {
      onSuccess: () => toast.success("메뉴가 삭제되었습니다."),
      onError: () => toast.error("메뉴 삭제에 실패했습니다."),
    });
  }

  const isPending = createMenu.isPending || updateMenu.isPending;

  function renderMenuRows(items: Menu[], depth = 0): React.ReactNode[] {
    return items.flatMap((menu) => [
      <TableRow key={menu.id}>
        <TableCell className="text-muted-foreground">{menu.id}</TableCell>
        <TableCell className="font-medium">
          <span style={{ paddingLeft: depth * 20 }}>
            {depth > 0 && "└ "}
            {menu.name}
          </span>
        </TableCell>
        <TableCell className="text-muted-foreground">{menu.path}</TableCell>
        <TableCell>{menu.icon ?? "-"}</TableCell>
        <TableCell>{menu.sortOrder}</TableCell>
        <TableCell>
          <Badge variant={menu.isActive ? "default" : "secondary"}>
            {menu.isActive ? "활성" : "비활성"}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => openEdit(menu)}>
              <Pencil className="size-4" />
            </Button>
            <ConfirmDialog
              trigger={
                <Button variant="ghost" size="icon">
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              }
              title="메뉴 삭제"
              description={`"${menu.name}" 메뉴를 삭제하시겠습니까?`}
              onConfirm={() => handleDelete(menu.id)}
              variant="destructive"
            />
          </div>
        </TableCell>
      </TableRow>,
      ...(menu.children ? renderMenuRows(menu.children, depth + 1) : []),
    ]);
  }

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="mr-2 size-4" />
          메뉴 추가
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMenu ? "메뉴 수정" : "메뉴 추가"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="menu-name">메뉴명</Label>
                <Input id="menu-name" {...register("name")} />
                {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="menu-path">경로</Label>
                <Input id="menu-path" {...register("path")} />
                {errors.path && <p className="text-destructive text-sm">{errors.path.message}</p>}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="menu-icon">아이콘</Label>
                <Input id="menu-icon" {...register("icon")} placeholder="선택사항" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="menu-sort">정렬순서</Label>
                <Input
                  id="menu-sort"
                  type="number"
                  {...register("sortOrder", { valueAsNumber: true })}
                />
                {errors.sortOrder && <p className="text-destructive text-sm">{errors.sortOrder.message}</p>}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>취소</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "저장 중..." : editingMenu ? "수정" : "추가"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: 60 }}>ID</TableHead>
              <TableHead style={{ width: 180 }}>메뉴명</TableHead>
              <TableHead>경로</TableHead>
              <TableHead style={{ width: 100 }}>아이콘</TableHead>
              <TableHead style={{ width: 80 }}>순서</TableHead>
              <TableHead style={{ width: 80 }}>상태</TableHead>
              <TableHead style={{ width: 100 }}>관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menus?.length ? (
              renderMenuRows(menus)
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">메뉴가 없습니다.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
