import { test, expect } from 'playwright/test'

async function login(page: import('playwright/test').Page) {
  await page.goto('/login')
  await page.getByLabel('아이디').fill('admin')
  await page.getByLabel('비밀번호').fill('admin1234')
  await page.getByRole('button', { name: '로그인' }).click()
  await page.waitForURL('**/dashboard', { timeout: 15000 })
}

test.describe('게시판 플로우', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('게시판 목록 페이지 접근', async ({ page }) => {
    await page.goto('/boards')
    await expect(page.getByRole('heading', { name: '게시판' })).toBeVisible()
  })

  test('게시판 → 게시글 목록 이동', async ({ page }) => {
    await page.goto('/boards')
    const boardLink = page
      .getByRole('link')
      .filter({ hasText: /공지사항/ })
      .first()
    if (await boardLink.isVisible()) {
      await boardLink.click()
      await page.waitForURL(/boards\/\d+/, { timeout: 10000 })
    }
  })
})
