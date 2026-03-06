import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '@/hooks/use-debounce'

describe('useDebounce', () => {
  it('초기값 반환', () => {
    const { result } = renderHook(() => useDebounce('hello', 300))
    expect(result.current).toBe('hello')
  })

  it('지연 후 값 업데이트', async () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'hello' } }
    )

    rerender({ value: 'world' })
    expect(result.current).toBe('hello')

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('world')

    vi.useRealTimers()
  })

  it('지연 시간 전에 값이 바뀌면 이전 타이머 취소', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    )

    rerender({ value: 'b' })
    act(() => {
      vi.advanceTimersByTime(100)
    })

    rerender({ value: 'c' })
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('c')
    vi.useRealTimers()
  })
})
