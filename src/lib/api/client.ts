import ky, { type KyRequest, type KyResponse } from 'ky'
import { getSession, signOut } from 'next-auth/react'

let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const session = await getSession()
  if (!session?.refreshToken) return null

  try {
    const res = await ky
      .post('auth/refresh', {
        prefixUrl: '/api/v1',
        json: { refreshToken: session.refreshToken },
      })
      .json<{ data?: { accessToken: string }; accessToken?: string }>()

    return res.data?.accessToken ?? res.accessToken ?? null
  } catch {
    return null
  }
}

async function forceLogout() {
  try {
    await signOut({ redirect: false })
  } catch {
    // signOut 실패해도 리다이렉트는 진행
  }
  window.location.href = '/login'
}

export class ApiError extends Error {
  status: number
  errors?: Record<string, string>

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string>
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

export const apiClient = ky.create({
  prefixUrl: '/api/v1',
  hooks: {
    beforeRequest: [
      async (request: KyRequest) => {
        const session = await getSession()
        if (session?.accessToken) {
          request.headers.set('Authorization', `Bearer ${session.accessToken}`)
        }
      },
    ],
    afterResponse: [
      async (request: KyRequest, _options, response: KyResponse) => {
        // 401 → 토큰 갱신 시도
        if (response.status === 401) {
          if (!isRefreshing) {
            isRefreshing = true
            refreshPromise = refreshAccessToken()
          }

          const newToken = await refreshPromise
          isRefreshing = false
          refreshPromise = null

          if (newToken) {
            request.headers.set('Authorization', `Bearer ${newToken}`)
            return ky(request)
          }

          await forceLogout()
          throw new ApiError('인증이 만료되었습니다.', 401)
        }

        // 에러 응답 처리 (4xx, 5xx)
        if (!response.ok) {
          let message = '요청 처리 중 오류가 발생했습니다.'
          let errors: Record<string, string> | undefined

          try {
            const body = (await response.json()) as Record<string, unknown>
            if (typeof body.message === 'string') message = body.message
            if (body.errors) errors = body.errors as Record<string, string>
          } catch {
            // JSON 파싱 실패 시 기본 메시지 사용
          }

          throw new ApiError(message, response.status, errors)
        }

        // 성공 응답: { success, data } 래퍼 자동 언래핑
        const contentType = response.headers.get('content-type')
        if (contentType?.includes('application/json')) {
          const body = (await response.json()) as Record<string, unknown>

          // 래퍼 형식이면 data만 추출
          const unwrapped =
            body != null &&
            typeof body === 'object' &&
            'success' in body &&
            'data' in body
              ? body.data
              : body

          return new Response(JSON.stringify(unwrapped), {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
          })
        }

        return response
      },
    ],
  },
})
