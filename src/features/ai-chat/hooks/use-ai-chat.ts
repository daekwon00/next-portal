'use client'

import { useCallback, useRef, useState } from 'react'
import { streamAiChat } from '@/lib/api/ai-chat'
import type { AiProvider, ChatMessage } from '@/types/ai-chat'

export function useAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [conversationId, setConversationId] = useState<string>()
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(
    async (content: string, provider?: AiProvider) => {
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
      }

      setMessages((prev) => [...prev, userMessage, assistantMessage])
      setIsStreaming(true)

      const abortController = new AbortController()
      abortRef.current = abortController

      try {
        const apiMessages = [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        }))

        await streamAiChat(
          {
            provider,
            messages: apiMessages,
            conversationId,
          },
          (event) => {
            switch (event.type) {
              case 'start':
                setConversationId(event.conversationId)
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, provider: event.provider }
                      : m
                  )
                )
                break
              case 'delta':
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, content: m.content + event.content }
                      : m
                  )
                )
                break
              case 'done':
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, usage: event.usage }
                      : m
                  )
                )
                break
              case 'error':
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, content: `오류: ${event.message}` }
                      : m
                  )
                )
                break
            }
          },
          abortController.signal
        )
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? {
                    ...m,
                    content: `오류: ${(error as Error).message || '요청에 실패했습니다'}`,
                  }
                : m
            )
          )
        }
      } finally {
        setIsStreaming(false)
        abortRef.current = null
      }
    },
    [messages, conversationId]
  )

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort()
    setIsStreaming(false)
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setConversationId(undefined)
  }, [])

  return {
    messages,
    isStreaming,
    conversationId,
    sendMessage,
    stopStreaming,
    clearMessages,
  }
}
