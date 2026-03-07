export type AiProvider = 'anthropic' | 'openai' | 'gemini'

export interface AiChatRequest {
  provider?: AiProvider
  messages: AiMessage[]
  conversationId?: string
}

export interface AiMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AiSseStartEvent {
  type: 'start'
  conversationId: string
  provider: AiProvider
}

export interface AiSseDeltaEvent {
  type: 'delta'
  content: string
}

export interface AiSseDoneEvent {
  type: 'done'
  usage: {
    promptTokens: number
    completionTokens: number
  }
}

export interface AiSseErrorEvent {
  type: 'error'
  message: string
}

export type AiSseEvent =
  | AiSseStartEvent
  | AiSseDeltaEvent
  | AiSseDoneEvent
  | AiSseErrorEvent

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  provider?: AiProvider
  usage?: {
    promptTokens: number
    completionTokens: number
  }
}

export const AI_PROVIDERS = [
  { value: 'anthropic' as const, label: 'Claude (Anthropic)' },
  { value: 'openai' as const, label: 'ChatGPT (OpenAI)' },
  { value: 'gemini' as const, label: 'Gemini (Google)' },
]
