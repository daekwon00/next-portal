'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  useRoles,
  useMenus,
  useMenuRoles,
  useUpdateMenuRoles,
} from '../hooks/use-system'

export function MenuRoleManagement() {
  const { data: roles, isLoading: rolesLoading } = useRoles()
  const { data: menus, isLoading: menusLoading } = useMenus()
  const { data: menuRoles, isLoading: menuRolesLoading } = useMenuRoles()
  const updateMenuRoles = useUpdateMenuRoles()

  const [selectedRoleId, setSelectedRoleId] = useState<string>('')
  const [checkedMenuIds, setCheckedMenuIds] = useState<string[]>([])
  const [prevRoleId, setPrevRoleId] = useState<string>('')

  const isLoading = rolesLoading || menusLoading || menuRolesLoading

  if (selectedRoleId !== prevRoleId) {
    setPrevRoleId(selectedRoleId)
    const assigned =
      selectedRoleId && menuRoles
        ? menuRoles
            .filter((mr) => mr.roleId === selectedRoleId)
            .map((mr) => mr.menuId)
        : []
    setCheckedMenuIds(assigned)
  }

  function toggleMenu(menuId: string) {
    setCheckedMenuIds((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    )
  }

  function handleSave() {
    if (!selectedRoleId) return
    updateMenuRoles.mutate(
      { roleId: selectedRoleId, menuIds: checkedMenuIds },
      {
        onSuccess: () => toast.success('메뉴-역할 매핑이 저장되었습니다.'),
        onError: () => toast.error('저장에 실패했습니다.'),
      }
    )
  }

  function flattenMenus(
    items: typeof menus,
    depth = 0
  ): { id: string; name: string; depth: number }[] {
    if (!items) return []
    return items.flatMap((menu) => [
      { id: menu.id, name: menu.name, depth },
      ...flattenMenus(menu.children, depth + 1),
    ])
  }

  if (isLoading) return <Skeleton className="h-64 w-full" />

  const flatMenus = flattenMenus(menus)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="역할 선택" />
          </SelectTrigger>
          <SelectContent>
            {roles?.map((role) => (
              <SelectItem key={role.id} value={String(role.id)}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={handleSave}
          disabled={!selectedRoleId || updateMenuRoles.isPending}
        >
          <Save className="mr-2 size-4" />
          {updateMenuRoles.isPending ? '저장 중...' : '저장'}
        </Button>
      </div>

      {selectedRoleId ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: 60 }}>선택</TableHead>
                <TableHead>메뉴명</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flatMenus.length ? (
                flatMenus.map((menu) => (
                  <TableRow key={menu.id}>
                    <TableCell>
                      <Checkbox
                        checked={checkedMenuIds.includes(menu.id)}
                        onCheckedChange={() => toggleMenu(menu.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <span style={{ paddingLeft: menu.depth * 20 }}>
                        {menu.depth > 0 && '└ '}
                        {menu.name}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center">
                    메뉴가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-muted-foreground py-8 text-center">
          역할을 선택해주세요.
        </p>
      )}
    </div>
  )
}
