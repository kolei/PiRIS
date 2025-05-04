import { test, expect } from '@playwright/test'

// See here how to get started:
// https://playwright.dev/docs/intro
test('на странице есть блюда', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.item')).toHaveCount(3)
})
