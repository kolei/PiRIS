import { describe, expect, test } from 'vitest'
import { calcItog } from '../common.js'

const item100_1 = {title:'test',price:100,quantity:1}
const item50_2 = {title:'test',price:50,quantity:2}

describe('Расчет итога корзины', () => {
  test('Пустая корзина', () => {
    const cart = []
    expect(calcItog(cart)).toBe(0)
  })

  test('В корзине одно блюдо в одном экземпляре', () => {
    const cart = [item100_1]
    expect(calcItog(cart)).toBe(100)
  })

  test('В корзине одно блюдо в двух экземплярах', () => {
    const cart = [item50_2]
    expect(calcItog(cart)).toBe(100)
  })

  test('В корзине два блюда', () => {
    const cart = [item100_1, item50_2]
    expect(calcItog(cart)).toBe(200)
  })
})
