import { describe, it, expect } from 'vitest'
import { formatDate, formatDateTime, formatNumber } from '@/lib/format'

describe('formatDate', () => {
  it('기본 포맷 (YYYY-MM-DD)', () => {
    expect(formatDate('2026-03-07T10:30:00')).toBe('2026-03-07')
  })

  it('커스텀 포맷', () => {
    expect(formatDate('2026-03-07', 'YYYY/MM/DD')).toBe('2026/03/07')
  })

  it('Date 객체 입력', () => {
    const date = new Date('2026-01-15T00:00:00')
    expect(formatDate(date)).toBe('2026-01-15')
  })
})

describe('formatDateTime', () => {
  it('날짜+시간 포맷', () => {
    expect(formatDateTime('2026-03-07T14:30:00')).toBe('2026-03-07 14:30')
  })
})

describe('formatNumber', () => {
  it('한국어 숫자 포맷 (천 단위 구분)', () => {
    expect(formatNumber(1234567)).toBe('1,234,567')
  })

  it('0', () => {
    expect(formatNumber(0)).toBe('0')
  })

  it('음수', () => {
    expect(formatNumber(-9876)).toBe('-9,876')
  })
})
