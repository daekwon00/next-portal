import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/features/auth/components/login-form'

const mockPush = vi.fn()
const mockSignIn = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('next-auth/react', () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}))

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('폼이 렌더링된다', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText('아이디')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
  })

  it('빈 필드 제출 시 에러 표시', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.click(screen.getByRole('button', { name: '로그인' }))

    await waitFor(() => {
      expect(screen.getByText('아이디를 입력해주세요')).toBeInTheDocument()
      expect(screen.getByText('비밀번호를 입력해주세요')).toBeInTheDocument()
    })
  })

  it('올바른 입력 시 signIn 호출', async () => {
    mockSignIn.mockResolvedValue({ error: null })
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText('아이디'), 'admin')
    await user.type(screen.getByLabelText('비밀번호'), 'password123')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        username: 'admin',
        password: 'password123',
        redirect: false,
      })
    })
  })

  it('로그인 실패 시 에러 메시지 표시', async () => {
    mockSignIn.mockResolvedValue({ error: 'CredentialsSignin' })
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText('아이디'), 'wrong')
    await user.type(screen.getByLabelText('비밀번호'), 'wrong')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    await waitFor(() => {
      expect(
        screen.getByText('아이디 또는 비밀번호가 올바르지 않습니다.')
      ).toBeInTheDocument()
    })
  })

  it('로그인 성공 시 대시보드로 이동', async () => {
    mockSignIn.mockResolvedValue({ error: null })
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText('아이디'), 'admin')
    await user.type(screen.getByLabelText('비밀번호'), 'admin1234')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })
})
