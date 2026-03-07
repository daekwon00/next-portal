import type { Metadata } from 'next'
import { ChatWindow } from '@/features/ai-chat/components/chat-window'

export const metadata: Metadata = {
  title: 'AI 채팅 | Next Portal',
}

export default function AiChatPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AI 채팅</h1>
      <ChatWindow />
    </div>
  )
}
