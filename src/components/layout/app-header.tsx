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
import { useMemo } from 'react'

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
    const fromMenus =
      findBreadcrumbFromMenus(menus, pathname) ??
      findBreadcrumbFromMenus(adminMenus, pathname)
    if (fromMenus) return fromMenus

    const staticLabel = Object.entries(STATIC_LABELS).find(
      ([path]) => pathname === path || pathname.startsWith(path + '/')
    )
    if (staticLabel) return [{ label: staticLabel[1] }]

    const segments = pathname.split('/').filter(Boolean)
    if (segments.length === 0) return [{ label: 'Dashboard' }]

    return [{ label: segments[segments.length - 1] }]
  }, [pathname, menus, adminMenus])
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
              <BreadcrumbItem key={i}>
                {i > 0 && <BreadcrumbSeparator />}
                {isLast ? (
                  <BreadcrumbPage className="text-sm font-medium">
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
