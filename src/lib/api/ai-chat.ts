import { getSession } from 'next-auth/react'
import type { AiChatRequest, AiSseEvent } from '@/types/ai-chat'

export async function streamAiChat(
  request: AiChatRequest,
  onEvent: (event: AiSseEvent) => void,
  signal?: AbortSignal
) {
  const session = await getSession()
  const token = (session as { accessToken?: string })?.accessToken

  const response = await fetch('/api/v1/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(request),
    signal,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `요청 실패 (${response.status})`)
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error('스트림을 읽을 수 없습니다')

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    let eventType = ''
    let eventData = ''

    for (const line of lines) {
      if (line.startsWith('event:')) {
        eventType = line.slice(6).trim()
      } else if (line.startsWith('data:')) {
        eventData = line.slice(5).trim()
      } else if (line === '' && eventData) {
        try {
          const parsed = JSON.parse(eventData)
          onEvent({ type: eventType || parsed.type, ...parsed } as AiSseEvent)
        } catch {
          // skip malformed data
        }
        eventType = ''
        eventData = ''
      }
    }
  }
}
