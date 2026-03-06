import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn', () => {
  it('단일 클래스', () => {
    expect(cn('text-red-500')).toBe('text-red-500')
  })

  it('여러 클래스 병합', () => {
    expect(cn('p-4', 'mt-2')).toBe('p-4 mt-2')
  })

  it('조건부 클래스', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })

  it('Tailwind 충돌 해소 (tailwind-merge)', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('빈 입력', () => {
    expect(cn()).toBe('')
  })
})
