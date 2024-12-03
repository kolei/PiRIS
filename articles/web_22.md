[К содержанию](../readme.md#введение-в-web-разработку)

# Кеширование данных (в приложении)

Достаточно часто в приложении на разных страницах приходится загружать одни и те же данные. Чтобы избежать этого можно совместить стор (**pinia**) и загрузку данных (**api**)

Допустим у нас есть список фильмов в хранилище:

```js
export const useApiStore = defineStore('api', () => {
    // список фильмов
    const movies = ref([])

    return { movies }
})
```

Реализуем метод получения фильмов с кешированием (в этом же сторе)

```js
...

async function loadMovies () {
    if (movies.value.length == 0) {
        // если список пустой (ещё не загружали)
        return await fetch(  
            'https://cinema.kolei.ru/movies?filter=new'
        )
        .then(r => r.json())
        .then(res => {
            // записываем результат в стор
            films.value = res
            return res
        })
    } else {
        // список уже есть, возвращаем его, заворачивая в промис 
        // (наша функция возвращает промис, поэтому нужно эмулировать правильный ответ)
        return Promise.resolve(films.value)
    }
}

return { movies, loadMovies }
```

[Назад](./web_21.md)
