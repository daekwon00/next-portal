import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const publicPaths = ['/login', '/register']

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // 공개 경로: 로그인된 사용자는 대시보드로
  if (publicPaths.includes(pathname)) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
  }

  // 보호 경로: 미인증 시 로그인으로
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 관리자 경로: role 체크
  if (pathname.startsWith('/admin')) {
    const role = req.auth?.user?.role
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/boards/:path*',
    '/user/:path*',
    '/admin/:path*',
    '/ai-chat',
    '/login',
    '/register',
  ],
}
