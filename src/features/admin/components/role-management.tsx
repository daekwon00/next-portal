"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useRoles, useCreateRole, useUpdateRole, useDeleteRole } from "../hooks/use-system";
import { roleSchema, type RoleFormValues } from "../schemas";
import type { Role } from "@/types/admin";

export function RoleManagement() {
  const { data: roles, isLoading } = useRoles();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
  });

  function openCreate() {
    setEditingRole(null);
    reset({ name: "", description: "" });
    setDialogOpen(true);
  }

  function openEdit(role: Role) {
    setEditingRole(role);
    reset({ name: role.name, description: role.description });
    setDialogOpen(true);
  }

  function onSubmit(data: RoleFormValues) {
    if (editingRole) {
      updateRole.mutate(
        { roleId: editingRole.id, data },
        {
          onSuccess: () => { toast.success("역할이 수정되었습니다."); setDialogOpen(false); },
          onError: () => toast.error("역할 수정에 실패했습니다."),
        },
      );
    } else {
      createRole.mutate(data, {
        onSuccess: () => { toast.success("역할이 생성되었습니다."); setDialogOpen(false); },
        onError: () => toast.error("역할 생성에 실패했습니다."),
      });
    }
  }

  function handleDelete(roleId: number) {
    deleteRole.mutate(roleId, {
      onSuccess: () => toast.success("역할이 삭제되었습니다."),
      onError: () => toast.error("역할 삭제에 실패했습니다."),
    });
  }

  const isPending = createRole.isPending || updateRole.isPending;

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="mr-2 size-4" />
          역할 추가
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRole ? "역할 수정" : "역할 추가"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role-name">역할명</Label>
              <Input id="role-name" {...register("name")} />
              {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-desc">설명</Label>
              <Input id="role-desc" {...register("description")} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>취소</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "저장 중..." : editingRole ? "수정" : "추가"}
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
              <TableHead style={{ width: 160 }}>역할명</TableHead>
              <TableHead>설명</TableHead>
              <TableHead style={{ width: 100 }}>관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles?.length ? (
              roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="text-muted-foreground">{role.id}</TableCell>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(role)}>
                        <Pencil className="size-4" />
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button variant="ghost" size="icon">
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        }
                        title="역할 삭제"
                        description={`"${role.name}" 역할을 삭제하시겠습니까?`}
                        onConfirm={() => handleDelete(role.id)}
                        variant="destructive"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">역할이 없습니다.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
