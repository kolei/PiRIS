# Тестирование web-приложений (часть 3:  тестирование АПИ)

Из АПИ мы получаем только список блюд, используя метод _getItems_ из файла [`./site/src/stores/items.js`](./site/src/stores/items.js)

```js
async function getItems () {
  if (itemList.value.length == 0) {
    const response = await fetch(`${API_URL}`);
    if (!response.ok) {
      throw new Error('Ошибка при получении списка блюд');
    }
    itemList.value = await response.json()
  }
  return itemList.value
}
```

Напишем тесты для этого метода API в файле [`./site/src/stores/__tests__/items.test.js`](./site/src/stores/__tests__/items.test.js)

Чтобы не слать реальные запросы к апи делаются "заглушки" - методы, которые перехватывают обращение к реальным вызовам функций и возвращают тестовые данные.

>Mock-тестирование — это испытание программы, при котором реальные её компоненты заменяются «дублёрами» — тестовыми объектами.

```js
import { MenuItem } from '@/helpers/common';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useItemsStore, API_URL } from '../items';

// vi - это алиас к VitestUtils
// в следующих 3-х строчках мы ставим заглушку на fetch вызовы
vi.mock('node-fetch')
const mockFetch = vi.fn()

// линтер ругается, что мы переопределяем глобальную функцию (fetch)
// eslint-disable-next-line no-global-assign
fetch = mockFetch

describe('Тестирование АПИ', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('Успешное получение списка блюд', async () => {
    // подгатавливаем фейковый объект
    const mockItems = [new MenuItem('test', 10)]
    const itemStore = useItemsStore()

    // метод mockResolvedValueOnce сработает один раз при первом вызове fetch
    // вместо реального вызова вернутся фейковые данные
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockItems)
    })

    // делаем штатный запрос к АПИ
    // запрос будет перехвачен и в ответ должны получить фейковые данные
    const items = await itemStore.getItems()

    // сравниваем полученные данные с теми, которые переданы в заглушку
    expect(items).toEqual(mockItems)

    // убеждаемся что запрос был именно на тот endpoint, который ожидался от метода getItems
    expect(mockFetch).toHaveBeenCalledWith(API_URL)
  })

  test('Ошибка при получении списка блюд', async () => {
    // симулируем response.ok == false для следующего запроса
    mockFetch.mockResolvedValueOnce({ ok: false })
    const itemStore = useItemsStore()
  
    // при ошибке получения данных метод должен сгенерировать исключение
    // которое мы и ожидаем получить
    await expect(itemStore.getItems()).rejects.toThrow('Ошибка при получении списка блюд')
  })
})
```
