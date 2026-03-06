import { test, expect } from 'playwright/test'

test.describe('인증 플로우', () => {
  test('로그인 페이지 렌더링', async ({ page }) => {
    await page.goto('/login')
    await expect(
      page.getByText('로그인', { exact: true }).first()
    ).toBeVisible()
    await expect(page.getByLabel('아이디')).toBeVisible()
    await expect(page.getByLabel('비밀번호')).toBeVisible()
  })

  test('빈 필드 제출 시 검증 에러', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: '로그인' }).click()
    await expect(page.getByText('아이디를 입력해주세요')).toBeVisible()
    await expect(page.getByText('비밀번호를 입력해주세요')).toBeVisible()
  })

  test('잘못된 자격증명 → 에러 메시지', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('아이디').fill('wronguser')
    await page.getByLabel('비밀번호').fill('wrongpass')
    await page.getByRole('button', { name: '로그인' }).click()
    await expect(
      page.getByText('아이디 또는 비밀번호가 올바르지 않습니다.')
    ).toBeVisible({ timeout: 10000 })
  })

  test('로그인 성공 → 대시보드 이동', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('아이디').fill('admin')
    await page.getByLabel('비밀번호').fill('admin1234')
    await page.getByRole('button', { name: '로그인' }).click()
    await page.waitForURL('**/dashboard', { timeout: 15000 })
    await expect(page).toHaveURL(/dashboard/)
  })

  test('비인증 사용자 → 로그인 페이지 리다이렉트', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL('**/login**', { timeout: 10000 })
    await expect(page).toHaveURL(/login/)
  })
})
