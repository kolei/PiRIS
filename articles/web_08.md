[К содержанию](../readme.md#введение-в-web-разработку)

# Vue.js: LocalStorage, фильтрация, пагинация, наблюдатели, history

## #16 Криптономикон-5: Работа со списком - Vue.js: практика

>Внимание! Код, который мы пишем всё ещё "плохой" и пишем мы его только в ознакомительных целях, чтобы понимать что такое хорошо и что  такое плохо.

>31 минута

* [YouTube](https://www.youtube.com/watch?v=BNDo6MVbPn4)
* [RuTube](https://rutube.ru/video/9213d9aa1e64af06a9f471d0b22c3e6e/)

**Содержание урока:**

* [сохранение/восстановление тикеров в *LocalStorage* (с переподпиской при обновлении страницы)](#сохранениевосстановление-тикеров-в-localstorage-с-переподпиской-при-обновлении-страницы)

* [фильтрация](#фильтрация)

* [пагинация](#пагинация)

* [watch](#наблюдение-watch)

* [хранение фильтра и пагинатора (url history)](#сохранение-фильтра-и-пагинации-при-перезагрузке-страницы)

**Материалы к изучению:**

- [watch (наблюдатели)](https://ru.vuejs.org/guide/essentials/watchers.html)

## Сохранение/восстановление тикеров в **LocalStorage** (с переподпиской при обновлении страницы)

Проблема: при обновлении страницы у нас пропадает список тикеров

1. В методе `add()` после добавления нового тикера в массив тикеров сохраняем его в **localStorage**   

    >**LocalStorage** это хранилище данных в браузере. Данные хранятся парами "ключ:значение", причем значения могут хранить только скалярные типы данных. Поэтому перед записью данных мы их "сериализуем" (преобразуем в строку) методом **JSON.stringify**, а после извлечения "десериализуем" методом **JSON.parse**

    ```js
    localStorage.setItem(   
        'cryptonomicon-list', 
        JSON.stringify(tickers.value))
    ```

1. Восстанавливаем список тикеров в методе жизненного цикла     

    В видео используется метод **created**, но во **vue3** нет такого метода, будем использовать **onBeforeMount** (в видео запретили использовать метод **onMount** без объяснения причин)

    ```js
    onBeforeMount(() => {
        const tickersData = localStorage.getItem('cryptonomicon-list') ?? '[]'
        tickers.value = JSON.parse(tickersData)
    })
    ```

    Если сейчас обновить страницу, то тикеры восстановятся, но обновления данных не будет, т.к. оно включается только в методе **add** 

1. Выносим код обновления тикеров в отдельную функцию **subdcribeToUpdates**

    ```js
    function subscribeToUpdates (tickerName) {
        setInterval(async () => {
            const f = await fetch(  
                `https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD&api_key=ce3fd966e7a1d10d65f907b20bf000552158fd3ed1bd614110baa0ac6cb57a7e`
            )

            const data = await f.json()

            // тут я добавил проверку data.USD - некоторые валюты возвращают ошибку
            if (typeof data.USD != 'undefined') {
                tickers.value.find(t => t.name === tickerName).price = data.USD  > 1 ? data.USD.toFixed(2) : data.USD.toPrecision(2)

                if (sel.value?.name === tickerName) {
                    graph.value.push(data.USD)
                }
            }
        }, 5000);
    }
    ```

    И используем её и в методе **add** (сделайте сами) и в **onBeforeMount**

    ```js
    onBeforeMount(() => {
        const tickersData = localStorage.getItem('cryptonomicon-list') ?? '[]'
        tickers.value = JSON.parse(tickersData)
        tickers.value.forEach(ticker => {
            subscribeToUpdates(ticker.name)
        })
    })
    ```

## Фильтрация

1. В шаблоне перед списком тикеров добавим фильтр и кнопки 

    ```html
    <div>
        Фильтр: <input/> 
        <button
            class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >Назад</button>
        <button
            class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >Вперед</button>
        </div>
    ```

1. В скрипте определяем реактивные переменные

    ```js
    const page = ref(1)
    const filter = ref('')
    ```

1. В шаблоне в поле ввода вильтра добавляем двустороннее связывание с нашей реактивной переменной

    ```html
    Фильтр: <input v-model="filter"/> 
    ```

1. В скрипте создаём функцию, возвращающую фильтрованный список тикеров:

    ```js
    function filteredTickers () {
        return tickers.value.filter(t => t.name.includes(filter.value.toUpperCase()))
    }
    ```

    И вставляем вызов этого метода в шаблон вместо tickers (сделайте самостоятельно)

1. При добавлении нового тикера сбрасываем фильтр (тоже сделайте самостоятельно)

## Пагинация

С потолка взяли размер страницы в 6 тикеров.

1. Для получения части списка дописываем метод **filteredTickers**

    ```js
    const start = (page.value - 1) * 6
    const end = page.value * 6
    return tickers.value
        .filter(t => t.name.includes(filter.value.toUpperCase()))
        .slice(start, end)
    ```

1. Добавим логику кнопкам вперед и назад

    Условия видимости и обработчики клика можно взять из видео. А реализация **filteredTickers** меняется для поддержки **hasNextPage**

    ```js
    const start = (page.value - 1) * 6
    const end = page.value * 6
    const tempFilteredTickers = tickers.value.filter(t => t.name.includes(filter.value.toUpperCase()))
    hasNextPage.value = tempFilteredTickers.length > end
    return tempFilteredTickers.slice(start, end)
    ```

## Наблюдение (watch)

При изменении фильтра, если мы находимся на 2-й странице, то данных для отображения может не оказаться. Для решения этой проблемы решили сбрасывать пагинацию при изменении фильтра.

Как это сделать? Во **vue** для определения изменений в реактивных переменных есть [наблюдатели](https://ru.vuejs.org/guide/essentials/watchers.html). Наблюдатели, как и обработчики хуков жизненного цикла, пишем прямо в коде `script setup`

Синтаксис простой:

```js
watch(переменная, (newValue, oldValue) => {
    код, срабатывающий при изменении переменной
})
```

Параметры _newValue_ и _oldValue_ можно не указывать, если они не нужны

В итоге получается такой наблюдатель:

```js
watch(filter, () => {
  page.value = 1
})
```

## Сохранение фильтра и пагинации при перезагрузке страницы

### Запись в querystring

При изменении фильтра добавляем в путь параметр `filter`:

```js
watch(filter, () => {
  page.value = 1

  window.history.pushState(
    null,
    document.title,
    `${window.location.pathname}?filter=${filter.value} `
  )
})  
```

Наблюдатель для **page** (с сохранением истории) реализуйте самостоятельно

### Восстановление при перезагрузке

Теорию посмотрите в видео, я сразу привожу готовый код (напоминаю, что метода **created** у нас нет, пишем прямо в `script setup`)

```js
const windowData = Object.fromEntries(
  new URL(window.location).searchParams.entries()
)

page.value = windowData.page ?? 1
filter.value = windowData.filter ?? ''
```

---

## Задание

1. Пересмотреть видео "#16 Криптономикон-5: Работа со списком - Vue.js: практика" и доработать свой код. 

[Назад](./web_07.md) | [Дальше](./web_09.md)
