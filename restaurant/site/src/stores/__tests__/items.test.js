import { MenuItem } from '@/helpers/common';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useItemsStore, API_URL } from '../items';

// vi - это алиас к VitestUtils
vi.mock('node-fetch')

const mockFetch = vi.fn()
// eslint-disable-next-line no-global-assign
fetch = mockFetch

describe('Тестирование АПИ', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('Успешное получение списка блюд', async () => {
    const mockItems = [new MenuItem('test', 10)]
    const itemStore = useItemsStore()

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockItems)
    })

    const items = await itemStore.getItems()

    expect(items).toEqual(mockItems)
    expect(mockFetch).toHaveBeenCalledWith(`${API_URL}`)
  })

  test('Ошибка при получении списка блюд', async () => {
    // симулируем response.ok == false
    mockFetch.mockResolvedValueOnce({ ok: false })
    const itemStore = useItemsStore()
  
    // при ошибке получения данных метод должен сгенерировать исключение
    // которое мы и ожидаем получить
    await expect(itemStore.getItems()).rejects.toThrow('Ошибка при получении списка блюд')
  })
})