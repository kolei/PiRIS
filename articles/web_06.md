[К содержанию](../readme.md#введение-в-web-разработку)

# Vue.js

## #12 Реализация реактивности (нюансы)

>17 минут

* [YouTube](https://www.youtube.com/watch?v=tt6VERYoBwE)
* [RuTube](https://rutube.ru/video/01f5dfb906d549d0b70d823c6f65c08e/)

## #13 Компоненты

>Live: 1 час

* [YouTube](https://www.youtube.com/watch?v=Mu3S9LBvuf8)
* [RuTube](https://rutube.ru/video/3d2d34498a53b4de7ce938add681c80c/?t=230&r=plwd)

## #14 Криптономикон-3: vue-cli и tailwind

>17 минут

* [YouTube](https://www.youtube.com/watch?v=p5y4lPbYee4)
* [RuTube](https://rutube.ru/video/5ea99b949996ae7e38fb927a76be3f0d/)


**Расшифровка**

>На момент написания этого текста в проекте вместо **webpack** используется **vite**, но смысл в принципе тот же - собрать из исходных файлов итоговые html, css и js, понятные любому более менее современному браузеру

1. Устанавливаем плагин **tailwind**

    >У меня на linux пакет `@vue/cli` подтянулся автоматически, но на винде может выдасть ошибку (может дело и не в винде, а в старом npm...). В таком случае нужно принудительно установить `@vue/cli`
    >
    >```
    >npm install @vue/cli
    >```

    ```
    npx @vue/cli add tailwind
    ```

1. Устанавливаем **@tailwindcss/forms**

    ```
    npm install @tailwindcss/forms
    ```

1. Дописываем плагин в `tailwind.config.js`

    ```js
    plugins: [require('@tailwindcss/forms')],
    ```

1. Удаляем файл `app.css` и импорт этого файла из `main.js`

В видео на этом этапе всё заработало, но у меня появилась ошибка сборки проекта: 

```
[Failed to load PostCSS config: Failed to load PostCSS config (searchPath: /home/kei/temp/Криптономикон1): [ReferenceError] module is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file extension and '/home/kei/temp/Криптономикон1/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
```

В принципе тут более менее понятно написано, что нужно поменять расширение файла `postcss.config.js` на `postcss.config.cjs`

[Назад](./web_05.md) | [Дальше](./web_07.md)
