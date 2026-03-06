import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from '@/features/auth/schemas'
import { postSchema } from '@/features/board/schemas/post-schema'

describe('loginSchema', () => {
  it('유효한 입력 통과', () => {
    const result = loginSchema.safeParse({
      username: 'admin',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('빈 아이디 실패', () => {
    const result = loginSchema.safeParse({ username: '', password: '1234' })
    expect(result.success).toBe(false)
  })

  it('빈 비밀번호 실패', () => {
    const result = loginSchema.safeParse({ username: 'admin', password: '' })
    expect(result.success).toBe(false)
  })
})

describe('registerSchema', () => {
  const validData = {
    username: 'testuser',
    name: '테스트',
    email: 'test@example.com',
    password: 'password123',
    confirmPassword: 'password123',
  }

  it('유효한 입력 통과', () => {
    const result = registerSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('아이디 4자 미만 실패', () => {
    const result = registerSchema.safeParse({ ...validData, username: 'abc' })
    expect(result.success).toBe(false)
  })

  it('비밀번호 불일치 실패', () => {
    const result = registerSchema.safeParse({
      ...validData,
      confirmPassword: 'different',
    })
    expect(result.success).toBe(false)
  })

  it('이메일 형식 오류 실패', () => {
    const result = registerSchema.safeParse({
      ...validData,
      email: 'invalid-email',
    })
    expect(result.success).toBe(false)
  })
})

describe('postSchema', () => {
  it('유효한 입력 통과', () => {
    const result = postSchema.safeParse({
      title: '테스트 제목',
      content: '테스트 내용',
    })
    expect(result.success).toBe(true)
  })

  it('빈 제목 실패', () => {
    const result = postSchema.safeParse({ title: '', content: '내용' })
    expect(result.success).toBe(false)
  })

  it('제목 200자 초과 실패', () => {
    const result = postSchema.safeParse({
      title: 'a'.repeat(201),
      content: '내용',
    })
    expect(result.success).toBe(false)
  })

  it('빈 내용 실패', () => {
    const result = postSchema.safeParse({ title: '제목', content: '' })
    expect(result.success).toBe(false)
  })
})
