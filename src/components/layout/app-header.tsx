'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User } from 'lucide-react'
import { useMenuStore, type MenuItem } from '@/stores/menu-store'
import { useMemo } from 'react'

interface BreadcrumbEntry {
  label: string
  href?: string
}

/** 정적 경로 → 이름 매핑 (메뉴에 없는 경로용) */
const STATIC_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/ai-chat': 'AI 채팅',
}

/**
 * 메뉴 트리에서 pathname에 매칭되는 항목을 찾아 breadcrumb 경로를 반환
 */
function findBreadcrumbFromMenus(
  menus: MenuItem[],
  pathname: string
): BreadcrumbEntry[] | null {
  for (const menu of menus) {
    // 자식 메뉴 먼저 탐색
    if (menu.children?.length) {
      for (const child of menu.children) {
        if (pathname === child.path || pathname.startsWith(child.path + '/')) {
          return [{ label: menu.name, href: menu.path }, { label: child.name }]
        }
      }
    }

    // 부모 메뉴 자체 매칭
    if (pathname === menu.path || pathname.startsWith(menu.path + '/')) {
      return [{ label: menu.name }]
    }
  }
  return null
}

function useBreadcrumbs(): BreadcrumbEntry[] {
  const pathname = usePathname()
  const { menus, adminMenus } = useMenuStore()

  return useMemo(() => {
    // 1. 메뉴 스토어에서 매칭 시도 (일반 + 관리자 메뉴)
    const fromMenus =
      findBreadcrumbFromMenus(menus, pathname) ??
      findBreadcrumbFromMenus(adminMenus, pathname)
    if (fromMenus) return fromMenus

    // 2. 정적 매핑 확인
    const staticLabel = Object.entries(STATIC_LABELS).find(
      ([path]) => pathname === path || pathname.startsWith(path + '/')
    )
    if (staticLabel) return [{ label: staticLabel[1] }]

    // 3. fallback: pathname 세그먼트를 표시
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length === 0) return [{ label: 'Dashboard' }]

    return [{ label: segments[segments.length - 1] }]
  }, [pathname, menus, adminMenus])
}

export function AppHeader() {
  const { data: session } = useSession()
  const breadcrumbs = useBreadcrumbs()

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, i) => {
            const isLast = i === breadcrumbs.length - 1
            return (
              <BreadcrumbItem key={i}>
                {i > 0 && <BreadcrumbSeparator />}
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href ?? '#'}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus-visible:ring-ring rounded-full focus-visible:ring-2 focus-visible:outline-none">
              <Avatar className="size-8 cursor-pointer">
                <AvatarFallback>
                  {session?.user?.name?.charAt(0) ?? 'U'}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{session?.user?.name ?? '사용자'}</span>
                <span className="text-muted-foreground text-xs font-normal">
                  {session?.user?.email ?? ''}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/user/profile">
                <User className="mr-2 h-4 w-4" />
                프로필
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ redirectTo: '/login' })}>
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
