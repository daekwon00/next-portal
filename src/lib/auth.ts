import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import type { LoginResponse } from '@/types/auth'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: '아이디', type: 'text' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.API_BASE_URL}/api/v1/auth/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
          }
        )

        if (!res.ok) return null

        const json = await res.json()
        const data: LoginResponse = json.data ?? json

        return {
          id: String(data.user.id),
          username: data.user.username,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.username = user.username
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      session.user.id = token.sub!
      session.user.username = token.username as string
      session.user.role = token.role as string
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
})
