'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
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
  usePositionRoles,
  useUpdatePositionRoles,
} from '../hooks/use-system'

export function PositionRoleManagement() {
  const { data: roles, isLoading: rolesLoading } = useRoles()
  const { data: positionRoles, isLoading: prLoading } = usePositionRoles()
  const updatePositionRoles = useUpdatePositionRoles()

  const [editMap, setEditMap] = useState<Record<string, string[]>>({})
  const [prevPositionRoles, setPrevPositionRoles] = useState(positionRoles)
  const isLoading = rolesLoading || prLoading

  if (positionRoles !== prevPositionRoles) {
    setPrevPositionRoles(positionRoles)
    if (positionRoles) {
      const map: Record<string, string[]> = {}
      positionRoles.forEach((pr) => {
        map[pr.positionId] = [...pr.roleIds]
      })
      setEditMap(map)
    }
  }

  function toggleRole(positionId: string, roleId: string) {
    setEditMap((prev) => {
      const current = prev[positionId] ?? []
      const next = current.includes(roleId)
        ? current.filter((id) => id !== roleId)
        : [...current, roleId]
      return { ...prev, [positionId]: next }
    })
  }

  function handleSave(positionId: string) {
    const roleIds = editMap[positionId] ?? []
    updatePositionRoles.mutate(
      { positionId, roleIds },
      {
        onSuccess: () => toast.success('직급-역할 매핑이 저장되었습니다.'),
        onError: () => toast.error('저장에 실패했습니다.'),
      }
    )
  }

  if (isLoading) return <Skeleton className="h-64 w-full" />

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: 160 }}>직급</TableHead>
              {roles?.map((role) => (
                <TableHead
                  key={role.id}
                  className="text-center"
                  style={{ width: 120 }}
                >
                  {role.name}
                </TableHead>
              ))}
              <TableHead style={{ width: 80 }}>저장</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positionRoles?.length ? (
              positionRoles.map((pr) => (
                <TableRow key={pr.positionId}>
                  <TableCell className="font-medium">
                    {pr.positionName}
                  </TableCell>
                  {roles?.map((role) => (
                    <TableCell key={role.id} className="text-center">
                      <Checkbox
                        checked={(editMap[pr.positionId] ?? []).includes(
                          role.id
                        )}
                        onCheckedChange={() =>
                          toggleRole(pr.positionId, role.id)
                        }
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSave(pr.positionId)}
                      disabled={updatePositionRoles.isPending}
                    >
                      <Save className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={(roles?.length ?? 0) + 2}
                  className="h-24 text-center"
                >
                  직급 데이터가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
