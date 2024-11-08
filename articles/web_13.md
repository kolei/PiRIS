[К содержанию](../readme.md#введение-в-web-разработку)

# Vue.js:

## #23 nextTick

>8 минут

* [YouTube](https://www.youtube.com/watch?v=zluGw3aJAMs&list=PLvTBThJr861yMBhpKafII3HZLAYujuNWw&index=24)
* [RuTube](https://rutube.ru/video/d1f23398c50206075d021fcd94e70c7e/)

На прошлом занятии мы заметили баг, что, если размер окна не менялся после запуска приложения, то при выборе валюты график не рисуется (в видео рисуется одна полоска, т.к. там значение по-умолчанию `1`, а в нашем методе расчёта количества полосок `0`)

Что делать?

В **onMounted** что-то считать смысла нет, т.к. график спрятан за `v-if`, т.е. его **физически** нет в **DOM**

Значит пересчет нужно добавить в метод **select**. 

```js
function select (ticker) {
  sel.value = ticker
  calculateMaxGraphElements()    
}
```

Но ничего не происходит. Почему???

Что происходит во **vue**?

Если запустить код в отладчике, то видно, что при установке `sel.value` визуально ничего не меняется. **vue** сначала выполняет код, и только потом перерисовывает **DOM** (если есть изменения в реактивных данных). Т.е. на момент вызова _calculateMaxGraphElements_ **DOM** ещё не изменился.

Нам надо дождаться перерисовки **DOM**

Во **vue** есть функция [nextTick](https://ru.vuejs.org/api/general.html#nexttick), которая вызывается после обновления **DOM**

В итоге наш метод **select** будет выглядеть так:

```js
function select (ticker) {
  sel.value = ticker
  nextTick(() => {
    calculateMaxGraphElements()    
  })
}
```

Т.е. метод _calculateMaxGraphElements_ будет вызван **асинхронно** после отрисовки **DOM**

Если вам не нравится вариант с callback, то можно использовать асинхронный вариант:

```js
async function select (ticker) {
  sel.value = ticker
  await nextTick()
  calculateMaxGraphElements()    
}
```

В этом варианте метод _calculateMaxGraphElements_ также будет вызван после отрисовки **DOM**, т.к. **nextTick** возвращает промис, который дождется этой самой отрисовки.

---

**Задание**

1. Посмотреть сринкаст и реализовать nextTick

[Назад](./web_12.md) | [Дальше](./web_14.md)
