[К содержанию](../readme.md#введение-в-web-разработку)

# Swipe to delete: vue-swipe-actions

>Реферат Алаева Д. Публикуется "как есть". 
>
>Вообще в веб разработке свайпы используются редко, но если мы делаем **PWA** или **Capacitor** приложение для мобильных устройств, то может понадобиться

![](https://i.imgur.com/doIx6fV.gif)

## Установка

```bash
npm install vue-swipe-actions
```

```js
import { SwipeList } from 'vue-swipe-actions'
```

## Импорт стилей

```js
import 'vue-swipe-actions/dist/vue-swipe-actions.css'
```

## Создание списка, который будет выводиться

```js
const page = ref(0);
const mockSwipeList = ref([
  [
    {
      id: "a",
      title: "Название фильма 1",
      description: "Описание фильма 1",
    },
    {
      id: "b",
      title: "Название фильма 2",
      description: "Описание фильма 2",
    },
  ],
])
```

### Функция удаления предмета

Метод удаления будет принимать item и удалять его находя в SwipeList

```js
function remove (item) {
  const itemIndex = mockSwipeList.value.findIndex(i => i.id === item.id)
  if (itemIndex !== -1) {
    mockSwipeList.value.splice(itemIndex, 1)
  }
}
```

### Функция добавления предмета( если надо )

```js
const name = ref('')
const description = ref('')

function add() {
  const newItem = {
    title: name.value,
    description: description.value,
  }

  mockSwipeList.value.push(newItem);
  name.value = ''
  description.value = ''
}
```

### Шаблон

Вставляем компонент `swipe-list`

- `:items="mockSwipeList"` связывает выводимый список

```html
<div id="app">
    <swipe-list
        class="card"
        :items="mockSwipeList" >

    </swipe-list>
</div>
```

### Отображение списка (в самом swipe-list)

- `v-slot="{ item, index }"` передача данных через v-slot

```html
<template v-slot="{ item, index }">
    <div class="card-content">
        <!-- расположение контента -->
        <h2>{{ item.title }}</h2>
        <p>
            <b>id:</b>
            {{ item.id }}
            <b>description:</b>
            {{ item.description }}
        </p>
        <b>index:</b>
        <span>{{ index }}</span>
    </div>
</template>
```

### Отображение кнопки удаления слева

```html
<template v-slot:left="{ item }">
    <div class="swipeout-action red" @click="remove(item)">
        <!-- картинка мусорки -->
        <i class="fa fa-trash"></i>
    </div>
</template>
```

>Нигде не упоминается: класс `fa` означает, что в проекте должен использоваться набор иконок **FontAvesome** (возможно он зашит в стили пакета)

### Отображение кнопки лайка справа (если надо)

```html
<template v-slot:right="{ item }">
    <div class="swipeout-action blue">
        <!-- картинка сердца -->
        <i class="fa fa-heart"></i>
    </div>
</template>
```

[Назад](./web_20.md) | [Дальше](./web_22.md)
