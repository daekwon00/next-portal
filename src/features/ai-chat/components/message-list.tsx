'use client'

import { useEffect, useRef } from 'react'
import { Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/types/ai-chat'

interface MessageListProps {
  messages: ChatMessage[]
  isStreaming: boolean
}

export function MessageList({ messages, isStreaming }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-muted-foreground text-center">
          <Bot className="mx-auto mb-4 size-12 opacity-50" />
          <p className="text-lg font-medium">AI 채팅을 시작해보세요</p>
          <p className="mt-1 text-sm">메시지를 입력하면 AI가 응답합니다</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'flex gap-3',
            message.role === 'user' ? 'justify-end' : 'justify-start'
          )}
        >
          {message.role === 'assistant' && (
            <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full">
              <Bot className="size-4" />
            </div>
          )}
          <div
            className={cn(
              'max-w-[75%] rounded-2xl px-4 py-2.5',
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            )}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
              {isStreaming &&
                message.role === 'assistant' &&
                !message.content && (
                  <span className="inline-block animate-pulse">...</span>
                )}
            </p>
            {message.usage && (
              <p className="text-muted-foreground mt-1 text-xs opacity-60">
                토큰: {message.usage.promptTokens} +{' '}
                {message.usage.completionTokens}
              </p>
            )}
            {message.provider && (
              <p className="text-muted-foreground mt-0.5 text-xs opacity-60">
                {message.provider}
              </p>
            )}
          </div>
          {message.role === 'user' && (
            <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full">
              <User className="size-4" />
            </div>
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
