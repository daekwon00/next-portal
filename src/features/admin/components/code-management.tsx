"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useCodeGroups, useCodes, useCreateCode, useUpdateCode, useDeleteCode } from "../hooks/use-system";
import { codeSchema, type CodeFormValues } from "../schemas";
import type { CommonCode } from "@/types/admin";

export function CodeManagement() {
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const { data: groups, isLoading: groupsLoading } = useCodeGroups();
  const { data: codes, isLoading: codesLoading } = useCodes(selectedGroup);
  const createCode = useCreateCode();
  const updateCode = useUpdateCode();
  const deleteCode = useDeleteCode();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<CommonCode | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CodeFormValues>({
    resolver: zodResolver(codeSchema),
  });

  function openCreate() {
    setEditingCode(null);
    reset({ groupCode: selectedGroup, code: "", name: "", value: "", sortOrder: 0, description: "" });
    setDialogOpen(true);
  }

  function openEdit(code: CommonCode) {
    setEditingCode(code);
    reset({
      groupCode: code.groupCode,
      code: code.code,
      name: code.name,
      value: code.value ?? "",
      sortOrder: code.sortOrder,
      description: code.description ?? "",
    });
    setDialogOpen(true);
  }

  function onSubmit(data: CodeFormValues) {
    if (editingCode) {
      updateCode.mutate(
        { codeId: editingCode.id, data },
        {
          onSuccess: () => { toast.success("코드가 수정되었습니다."); setDialogOpen(false); },
          onError: () => toast.error("코드 수정에 실패했습니다."),
        },
      );
    } else {
      createCode.mutate(data, {
        onSuccess: () => { toast.success("코드가 생성되었습니다."); setDialogOpen(false); },
        onError: () => toast.error("코드 생성에 실패했습니다."),
      });
    }
  }

  function handleDelete(codeId: string) {
    deleteCode.mutate(codeId, {
      onSuccess: () => toast.success("코드가 삭제되었습니다."),
      onError: () => toast.error("코드 삭제에 실패했습니다."),
    });
  }

  const isPending = createCode.isPending || updateCode.isPending;

  if (groupsLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="그룹코드 선택" />
          </SelectTrigger>
          <SelectContent>
            {groups?.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name} ({group.id})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={openCreate} disabled={!selectedGroup}>
          <Plus className="mr-2 size-4" />
          코드 추가
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCode ? "코드 수정" : "코드 추가"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>그룹코드</Label>
              <Input value={editingCode?.groupCode ?? selectedGroup} disabled />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="code-code">코드</Label>
                <Input id="code-code" {...register("code")} disabled={!!editingCode} />
                {errors.code && <p className="text-destructive text-sm">{errors.code.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="code-name">코드명</Label>
                <Input id="code-name" {...register("name")} />
                {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="code-value">값</Label>
                <Input id="code-value" {...register("value")} placeholder="선택사항" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code-sort">정렬순서</Label>
                <Input id="code-sort" type="number" {...register("sortOrder", { valueAsNumber: true })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="code-desc">설명</Label>
              <Input id="code-desc" {...register("description")} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>취소</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "저장 중..." : editingCode ? "수정" : "추가"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {selectedGroup ? (
        codesLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ width: 120 }}>코드</TableHead>
                  <TableHead style={{ width: 160 }}>코드명</TableHead>
                  <TableHead>값</TableHead>
                  <TableHead style={{ width: 80 }}>순서</TableHead>
                  <TableHead style={{ width: 80 }}>상태</TableHead>
                  <TableHead style={{ width: 100 }}>관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {codes?.length ? (
                  codes.map((code) => (
                    <TableRow key={code.id}>
                      <TableCell className="font-mono text-sm">{code.code}</TableCell>
                      <TableCell className="font-medium">{code.name}</TableCell>
                      <TableCell className="text-muted-foreground">{code.value ?? "-"}</TableCell>
                      <TableCell>{code.sortOrder}</TableCell>
                      <TableCell>
                        <Badge variant={code.isActive ? "default" : "secondary"}>
                          {code.isActive ? "활성" : "비활성"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(code)}>
                            <Pencil className="size-4" />
                          </Button>
                          <ConfirmDialog
                            trigger={
                              <Button variant="ghost" size="icon">
                                <Trash2 className="size-4 text-destructive" />
                              </Button>
                            }
                            title="코드 삭제"
                            description={`"${code.name}" 코드를 삭제하시겠습니까?`}
                            onConfirm={() => handleDelete(code.id)}
                            variant="destructive"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">코드가 없습니다.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )
      ) : (
        <p className="text-muted-foreground py-8 text-center">그룹코드를 선택해주세요.</p>
      )}
    </div>
  );
}
