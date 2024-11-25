[К содержанию](../readme.md#введение-в-web-разработку)

# Карусель

>Будет использоваться в приложении "Управление коллекцией фильмов"

На примере карусели разберёмся, как подключать дополнительные js-библиотеки

Будем использовать [библиотеку **Swiper**](https://swiperjs.com/element) (можете и сами что-то написать или найти похожее)

1. Установка библиотеки

    Для **Swiper** есть NPM-пакет, установим его командой:

    ```bash
    npm install swiper
    ```

1. В компоненте в котором вы будете использовать карусель необходимо зарегистрировать компонент карусели

    ```vue
    <script setup>
    import { register } from 'swiper/element/bundle'
    register()
    </script>
    ```

    >В доке ещё описан альтернативный вариант загрузки скрипта карусели из CDN. Если хотите использовать этот вариант, то скрипт нужно прописать в заголовок `index.html`
    >
    >Собственно первый вариант и делает динамическую загрузку js-скрипта, только не из CDN, а из локального пакета

1. [Использование компонента карусели](https://swiperjs.com/element#usage-with-vue)

    Можете попытаться разобраться сами, у компонента много разных настроек. Я ниже приведу вариант для карусели постеров (стили тут условные, вам под свою вёрстку надо будет поправить)

    ```vue
    <template>
        {{ activeFilmName }}
        <swiper-container
            :slides-per-view="1"
            :centered-slides="true"
            style="width:100%;height:50vh"
            @swiperslidechange="onSlideChange"
        >
            <swiper-slide
                v-for="(film, index) in films"
                :key="index"
            >
                <img 
                :src="`https://cinema.kolei.ru/up/images/${film.poster}`" 
                width="auto"
                height="100%"
                />
            </swiper-slide>
        </swiper-container>
    </template>

    <script setup>
    import { ref } from "vue"
    import { register } from 'swiper/element/bundle'

    register()

    const films = ref([])
    const activeFilmName = ref('')

    api.loadFilms().then(res => {
        films.value = res
        activeFilmName.value = films.value[0].name
    })

    function onSlideChange (event) {
        // console.log('slide changed', event.detail[0].activeIndex)
        activeFilmName.value = films.value[event.detail[0].activeIndex].name
    }
    </script>
    ```

    В примере я не показываю реализацию метода `api.loadFilms`, это вы должны будете реализовать самостоятельно в рамках практического занятия

При установке внешних компонентов в консоли могут появиться **предупреждения**:

```
Failed to resolve component: swiper-slide
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement. 
```

На работоспособность они не влияют, но засоряют консоль. Чтобы сказать **vue**, чтобы он не обращал внимания на такие компоненты нужно в настройках (`vite.config.js`) добавить исключения:

```js
export default defineConfig({
  plugins: [
    vue({ 
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['swiper-slide','swiper-container'].includes(tag),
        }
      }
    }),
    vueDevTools(),
  ],
```

[Назад](./web_17.md) | [Дальше](./web_19.md)
