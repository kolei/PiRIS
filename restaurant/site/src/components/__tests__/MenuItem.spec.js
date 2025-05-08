 
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MenuItemVue from '../MenuItem.vue'
import { MenuItem } from '@/helpers/common'
import { createPinia, setActivePinia } from 'pinia'

describe('MenuItem', () => {
  let wrapper
  
  // перед выполнением каждого теста мы должны создать окружение
  // в нашем случае хранилище и экземпляр компонента
  beforeEach(() => {
    setActivePinia(createPinia())

    // метод mount монтирует компонент с параметрами
    wrapper = mount(MenuItemVue, { 
      props: { item: new MenuItem('test', 100) } 
    })
  })
  
  // в интернетах пишут, что it это просто алиас для test
  it('Элемент меню содержит название', () => {
    // здесь мы получаем текстовое представление компонента (text())
    // и ищем в нём название блюда (toContain)
    // если находит, значит компонент смонтировался нормально
    expect(wrapper.text()).toContain('test')
  })

  it('У элемента меню есть кнопка и при клике на неё цена переезжает в описание', async () => {
    // метод find ищет в компоненте элемент или класс (тема css-селекторы)
    // и генерирует на нём событие click
    await wrapper.find('.price-button').trigger('click')

    // все события, генерируемые компонентом, собираются в очередь
    // и мы просто проверяем длину очереди событий
    // expect(wrapper.emitted('click')).toHaveLength(1)

    // в название должна переехать цена
    const title = wrapper.find('.title')
    expect(title.text()).toContain('100')
  })

  it.skip('Элемент меню генерирует событие click', () => {
    // компонент обрабатывает клик прямо по внешнему div-у
    // поэтому можем генерировать событие прямо на нём
    wrapper.trigger('click')

    // если бы в компонента была какая-то кнопка, то надо было бы
    // генерировать событие у неё
    // wrapper.find('button').trigger('click')

    // все события, генерируемые компонентом, собираются в очередь
    // и мы просто проверяем длину очереди событий
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('При клике на кнопку с ценой должен появиться счётчик и кнопки "-" и "+", при клике на кнопку "+" счётчик должен приянть значение "2"', async () => {
    // после клика перестраивается DOM, поэтому заворачиваем в await
    await wrapper.find('.price-button').trigger('click')

    // в компоненте должен появиться элемент с классом .qty-value
    expect(wrapper.find('.qty-value').exists()).toBe(true)

    // кнопка "-"
    expect(wrapper.find('.qty-minus').exists()).toBe(true)

    // и кнопка "+"
    const plusButton = wrapper.find('.qty-plus')
    expect(plusButton.exists()).toBe(true)

    await plusButton.trigger('click')

    const value = wrapper.find('.qty-value')
    expect(value.text()).toEqual('2')

    // expect(value.element.text).toContain('1')
  })

})

// https://blog.logrocket.com/advanced-guide-vitest-testing-mocking/
// https://github.com/mayashavin/component-testing-vitest/blob/main/src/components/__tests__/Movies.spec.js
// https://www.vuemastery.com/blog/getting-started-with-vitest/#wrapping-up
// https://github.com/igorbabko/vue-unit-testing/blob/main/test/components/ActivityItem.test.ts
