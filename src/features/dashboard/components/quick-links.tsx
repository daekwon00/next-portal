'use client'

import Link from 'next/link'
import { User, FileText, MessageSquare, Shield, Bell } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const links = [
  { href: '/user/mypage', label: '마이페이지', icon: User },
  { href: '/boards', label: '게시판', icon: FileText },
  { href: '/boards/NOTICE', label: '공지사항', icon: Bell },
  { href: '/ai-chat', label: 'AI 채팅', icon: MessageSquare },
]

const adminLink = { href: '/admin', label: '관리자 대시보드', icon: Shield }

export function QuickLinks({ isAdmin }: { isAdmin: boolean }) {
  const allLinks = isAdmin ? [...links, adminLink] : links

  return (
    <Card>
      <CardHeader>
        <CardTitle>바로가기</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {allLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:bg-accent flex items-center gap-3 px-6 py-3 transition-colors"
            >
              <link.icon className="text-primary size-4" />
              <span className="text-sm">{link.label}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
