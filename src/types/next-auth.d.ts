import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken: string
    refreshToken: string
    user: {
      id: string
      username: string
      name: string
      email: string
      role: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
    username: string
    name: string
    email: string
    role: string
    accessToken: string
    refreshToken: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string
    refreshToken: string
    username: string
    role: string
  }
}
