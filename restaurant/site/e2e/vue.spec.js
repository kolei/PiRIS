import { test, expect } from '@playwright/test'

test('на странице есть блюда', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.item')).toHaveCount(3)
})

test('На странице есть блюдо "Салат" и при клике по нему появляется корзина', async ({ page }) => {
  await page.goto('/')
  const salat = page.getByText('Салат')
  // await expect(salat).toBeVisible()
  expect(salat).toBeTruthy()
  const salatButton = salat.locator('xpath=..').getByRole('button')
  expect(salatButton).toBeTruthy()

  await salatButton.click()
  const cart = page.locator('.cart')
  expect(cart).toBeTruthy()
  expect(cart.getByText('Итого: 100')).toBeTruthy()
})
