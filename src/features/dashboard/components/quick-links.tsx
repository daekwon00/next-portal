'use client'

import Link from 'next/link'
import {
  User,
  FileText,
  MessageSquare,
  Shield,
  Bell,
  ArrowRight,
} from 'lucide-react'

const links = [
  {
    href: '/user/mypage',
    label: '마이페이지',
    desc: '내 정보 확인',
    icon: User,
  },
  {
    href: '/boards',
    label: '게시판',
    desc: '게시판 목록',
    icon: FileText,
  },
  {
    href: '/boards/NOTICE',
    label: '공지사항',
    desc: '전체 공지 확인',
    icon: Bell,
  },
  {
    href: '/ai-chat',
    label: 'AI 채팅',
    desc: 'AI와 대화하기',
    icon: MessageSquare,
  },
]

const adminLink = {
  href: '/admin',
  label: '관리자',
  desc: '관리자 대시보드',
  icon: Shield,
}

export function QuickLinks({ isAdmin }: { isAdmin: boolean }) {
  const allLinks = isAdmin ? [...links, adminLink] : links

  return (
    <div className="rounded-xl border">
      <div className="border-b px-5 py-4">
        <h3 className="text-sm font-semibold tracking-tight">바로가기</h3>
      </div>
      <div className="p-2">
        <div className="space-y-0.5">
          {allLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:bg-accent group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors"
            >
              <div className="bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-lg">
                <link.icon className="text-primary size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{link.label}</p>
                <p className="text-muted-foreground text-xs">{link.desc}</p>
              </div>
              <ArrowRight className="text-muted-foreground size-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
