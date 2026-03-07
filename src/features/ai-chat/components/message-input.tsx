'use client'

import { useState, type KeyboardEvent } from 'react'
import { Send, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface MessageInputProps {
  onSend: (content: string) => void
  onStop: () => void
  isStreaming: boolean
}

export function MessageInput({
  onSend,
  onStop,
  isStreaming,
}: MessageInputProps) {
  const [input, setInput] = useState('')

  function handleSend() {
    const trimmed = input.trim()
    if (!trimmed || isStreaming) return
    onSend(trimmed)
    setInput('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t p-4">
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요... (Shift+Enter로 줄바꿈)"
          className="max-h-[120px] min-h-[44px] resize-none"
          rows={1}
          disabled={isStreaming}
        />
        {isStreaming ? (
          <Button
            variant="destructive"
            size="icon"
            className="shrink-0"
            onClick={onStop}
          >
            <Square className="size-4" />
          </Button>
        ) : (
          <Button
            size="icon"
            className="shrink-0"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <Send className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
