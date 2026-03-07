'use client'

import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { useAiChat } from '../hooks/use-ai-chat'
import { MessageList } from './message-list'
import { MessageInput } from './message-input'
import { AI_PROVIDERS, type AiProvider } from '@/types/ai-chat'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ChatWindow() {
  const [provider, setProvider] = useState<AiProvider>('anthropic')
  const { messages, isStreaming, sendMessage, stopStreaming, clearMessages } =
    useAiChat()

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-lg border">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <Select
          value={provider}
          onValueChange={(v) => setProvider(v as AiProvider)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AI_PROVIDERS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearMessages}
          disabled={isStreaming || messages.length === 0}
        >
          <RotateCcw className="mr-1 size-4" />새 대화
        </Button>
      </div>

      <MessageList messages={messages} isStreaming={isStreaming} />

      <MessageInput
        onSend={(content) => sendMessage(content, provider)}
        onStop={stopStreaming}
        isStreaming={isStreaming}
      />
    </div>
  )
}
