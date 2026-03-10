'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, ChevronRight, Shield } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useMemo } from 'react'
import { useMenuStore, type MenuItem } from '@/stores/menu-store'
import { iconMap, defaultIcon } from '@/lib/icon-map'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

function MenuItemComponent({
  item,
  pathname,
}: {
  item: MenuItem
  pathname: string
}) {
  const Icon = useMemo(
    () => (item.icon ? iconMap[item.icon] : undefined) ?? defaultIcon,
    [item.icon]
  )
  const hasChildren = item.children && item.children.length > 0
  const isActive =
    pathname === item.path || pathname.startsWith(item.path + '/')

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive}>
          <Link href={item.path}>
            <Icon />
            <span>{item.name}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <Collapsible asChild defaultOpen={isActive} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.name} isActive={isActive}>
            <Icon />
            <span>{item.name}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children!.map((child) => (
              <SidebarMenuSubItem key={child.id}>
                <SidebarMenuSubButton
                  asChild
                  isActive={pathname === child.path}
                >
                  <Link href={child.path}>
                    <span>{child.name}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { menus, isLoaded, fetchMenus } = useMenuStore()

  useEffect(() => {
    if (session) {
      fetchMenus()
    }
  }, [session, fetchMenus])

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg text-sm font-bold">
                  NP
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Next Portal</span>
                  <span className="text-muted-foreground truncate text-xs">
                    포털 시스템
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoaded &&
                menus.map((item) => (
                  <MenuItemComponent
                    key={item.id}
                    item={item}
                    pathname={pathname}
                  />
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {session?.user?.role === 'ADMIN' && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin">
                  <Shield />
                  <span>관리자 모드</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarFallback>
                    {session?.user?.name?.charAt(0) ?? 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {session?.user?.name ?? '사용자'}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {session?.user?.email ?? ''}
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => signOut({ redirectTo: '/login' })}
            >
              <LogOut />
              <span>로그아웃</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
