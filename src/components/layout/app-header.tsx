'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
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
import { useMenuStore, type MenuItem } from '@/stores/menu-store'
import { useQueryClient } from '@tanstack/react-query'
import React, { useMemo } from 'react'

interface BreadcrumbEntry {
  label: string
  href?: string
}

const STATIC_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/ai-chat': 'AI 채팅',
}

function findBreadcrumbFromMenus(
  menus: MenuItem[],
  pathname: string
): BreadcrumbEntry[] | null {
  for (const menu of menus) {
    if (menu.children?.length) {
      for (const child of menu.children) {
        if (pathname === child.path || pathname.startsWith(child.path + '/')) {
          return [{ label: menu.name, href: menu.path }, { label: child.name }]
        }
      }
    }

    // 정확히 매칭될 때만 (하위 경로는 동적 처리로 넘김)
    if (pathname === menu.path) {
      return [{ label: menu.name }]
    }
  }
  return null
}

/** /boards/{boardId}... 경로에서 게시판명/게시글명을 쿼리 캐시에서 추출 */
function useBoardBreadcrumbs(pathname: string): BreadcrumbEntry[] | null {
  const queryClient = useQueryClient()

  // /boards/{boardId} 패턴 매칭
  const boardMatch = pathname.match(/^\/boards\/([^/]+)/)
  if (!boardMatch) return null

  const boardId = boardMatch[1]

  // 쿼리 캐시에서 게시판 정보 조회
  const board = queryClient.getQueryData<{ name: string }>(['boards', boardId])
  const boardName = board?.name ?? boardId

  const crumbs: BreadcrumbEntry[] = [
    { label: '게시판', href: '/boards' },
    { label: boardName, href: `/boards/${boardId}` },
  ]

  // /boards/{boardId}/posts/{postId} 패턴
  const postMatch = pathname.match(/^\/boards\/[^/]+\/posts\/(\d+)/)
  if (postMatch) {
    const postId = Number(postMatch[1])
    const post = queryClient.getQueryData<{ title: string }>([
      'posts',
      'detail',
      postId,
    ])

    if (pathname.endsWith('/edit')) {
      crumbs.push({
        label: post?.title ?? '게시글',
        href: `/boards/${boardId}/posts/${postId}`,
      })
      crumbs.push({ label: '수정' })
    } else {
      crumbs.push({ label: post?.title ?? '게시글' })
    }
  }

  // /boards/{boardId}/write 패턴
  if (pathname.endsWith('/write')) {
    crumbs.push({ label: '새 글 작성' })
  }

  return crumbs
}

function useBreadcrumbs(): BreadcrumbEntry[] {
  const pathname = usePathname()
  const { menus, adminMenus } = useMenuStore()
  const boardCrumbs = useBoardBreadcrumbs(pathname)

  return useMemo(() => {
    // 1. 게시판 동적 경로 처리
    if (boardCrumbs) return boardCrumbs

    // 2. 메뉴 스토어에서 매칭
    const fromMenus =
      findBreadcrumbFromMenus(menus, pathname) ??
      findBreadcrumbFromMenus(adminMenus, pathname)
    if (fromMenus) return fromMenus

    // 3. 정적 매핑
    const staticLabel = Object.entries(STATIC_LABELS).find(
      ([path]) => pathname === path || pathname.startsWith(path + '/')
    )
    if (staticLabel) return [{ label: staticLabel[1] }]

    // 4. fallback
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length === 0) return [{ label: 'Dashboard' }]

    return [{ label: segments[segments.length - 1] }]
  }, [pathname, menus, adminMenus, boardCrumbs])
}

export function AppHeader() {
  const breadcrumbs = useBreadcrumbs()

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1 size-7" />
      <Separator orientation="vertical" className="mr-1 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, i) => {
            const isLast = i === breadcrumbs.length - 1
            return (
              <React.Fragment key={i}>
                {i > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="max-w-48 truncate text-sm font-medium">
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        href={crumb.href ?? '#'}
                        className="text-muted-foreground text-sm"
                      >
                        {crumb.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  )
}
