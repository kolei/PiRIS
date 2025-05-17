# Постановка задачи. Создание сервера express.js. Подключение и настройка sequelize.

Напишем полноценное АПИ для проекта "ресторан" используя **express.js**.

1. Создадим проект и разберемся в его структуре.
1. Подключение к БД (познакомимся с ORM **Sequelize**, научимся делать миграции)
1. Разработаем конечные точки для получения меню и формирования корзины

**Содержание:**

* [Создание проекта](#создание-проекта)
* [Подключение к БД](#подключение-к-бд)
* [Использование sequelize для получения данных из БД](#использование-sequelize-для-получения-данных-из-бд)
* [Создание скрипта для наполнения БД начальными данными](#создание-скрипта-для-наполнения-бд-начальными-данными)
* [Добавление сущностей БД, реализация REST.](#добавление-сущностей-бд-реализация-rest)

## Создание проекта

Для больших проектов лучше использовать [генератор](https://expressjs.com/ru/starter/generator.html), но там много лишнего. Создадим [простой проект](https://expressjs.com/ru/starter/hello-world.html):

1. Создайте каталог для проекта и перейдите в него (в моём случае это каталог `api`)
1. Запустите команду `npm init` для создания проекта

    На все вопросы отвечаем по-умолчанию, кроме **entry point** (точка входа), тут пишем `app.js` (можно оставить и по-умолчанию, это ни на что не влияет)

    ```
    package name: (api)
    version: (1.0.0)
    description:
    entry point: (index.js) app.js
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    test command:
    git repository:
    keywords:
    author:
    license: (ISC)
    type: (commonjs)
    ```

1. Добавьте в зависимости проекта `express.js` командой `npm i express`

1. Создайте файл `.gitignore`

    ```.gitignore
    node_modules
    ```

1. Создайте файл `app.js`

    Ниже пример "hello world" проекта с официального сайта **express.js**

    ```js
    const express = require('express')
    const app = express()
    const port = 3000

    app.get('/', (req, res) => {
        res.send('Hello World!')
    })

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
    ```

    Что здесь происходит?

    * `const express = require('express')` - импортируем модуль
    * `const app = express()` - создаём экземпляр приложения
    * `const port = 3000` - определяем порт, на котором приложение будет слушать запросы.
    
        Прибивать гвоздями не совсем хорошо, но в перспективе мы завернём апи в контейнер. Сейчас главное чтобы порт никем не использовался.

    * `app.get('/', (req, res) => {})` - **endpoint** (конечная точка), которая будет обрабатывать входящий запрос. В данном случае метод `GET` по пути `/`.

        В параметрах лямбда функции приходят объекты `req` (_request_ - запрос, из этого объекта мы можем извлечь параметры и тело запроса) и `res` (_response_ - ответ, сюда мы должны вернуть результат запроса)
 
    * `app.listen(port, () => {})` - запуск сервера на указанном порту

Запустить проект можно командой `node app.js`.

В браузере должна открываться страница http://localhost:3000, возвращающая `Hello World!`

## Подключение к БД

Для подключения к БД можно использовать пакет `mysql`, но для более-менее сложных проектов, подразумевающих дальнейшее развитие лучше использовать библиотеки, поддерживающие миграции (инициализация и изменение структуры базы данных). Для **JavaScript** наиболее популярна ORM библиотека [sequelize](https://sequelize.org/). На [хабре](https://habr.com/ru/articles/565062/) есть цикл статей, посвящённый этой библиотеке.

Всеми возможностями мы пользоваться не будем, нам достаточно миграций.

### Установим зависимости

>Выполняем в каталоге с проектом

```
npm i mysql2 sequelize sequelize-cli
```

* Пакет `mysql2` нужен для работы с БД MySQL (явно мы его не используем, но он нужен для **sequelize**) 
* Пакет `sequelize` нужен для использования в нашем коде 
* Приложение `sequelize-cli` нужно для создания и управление миграциями

### Инициализация и настройка sequelize (только перед первым запуском)

#### Инициализация:

```
npx sequelize-cli init
```

Будут созданы следующие директории:

* `config` — файл с настройками подключения к БД
* `models` — модели для проекта
* `migrations` — файлы с миграциями
* `seeders` — файлы для заполнения БД начальными (фиктивными) данными

#### Настройка

Далее нам нужно сообщить CLI, как подключиться к БД. Для этого откроем файл [`config/config.json`](./config/config.json). Он выглядит примерно так:

```json
{
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

То есть для разных сценариев мы можем использовать разные БД:

* **development** - режим разработки
* **test** - тестирование
* **production** - "боевая" БД

Хранить логин/пароль к БД в открытом доступе нельзя, поэтому перепишите [`config/config.json`](./config/config.json) таким образом:

```json
{
  "development": {
    "use_env_variable": "DATABASE_URL",
    "dialect": "mysql"
  },
  "test": {
    "use_env_variable": "DATABASE_URL",
    "dialect": "mysql"
  },
  "production": {
    "use_env_variable": "DATABASE_URL",
    "dialect": "mysql"
  }
}
```

**Sequelize** поддерживает загрузку строки подключения из переменных окружения. Нам нужно создать переменную окружения в таком формате:

```
DATABASE_URL=mysql://[user]:[pass]@[sqldomain]/[db name]
```

В **VSCode** можно задать переменные в настройках:

![](./img/launch_json.png)

![](./img/debugger.png)

И в разделе "configurations" добавьте объект "env":

![](./img/env.png)

### Создание базы данных

```
npx sequelize-cli db:create [--url=<строка подключения>]
```

`--url <строка подключения к БД>` можно не указывать, если:

* оставили стандартный вариант инициализации БД или в переменных окружения есть `DATABASE_URL` (учитывайте, что на командную строку не распространяются настойки VSCode)
* в корне проекта создан файл `.sequelizerc`, в котором задана переменная `url`:

    ```js
    module.exports = {
      'url': 'mysql://ekolesnikov:<тут пароль>@kolei.ru/restaurant'
    }
    ```

    Такой вариант предпочтительнее, чтобы не писать `url` при каждой миграции. Только не забудьте и этот файл прописать в `.gitignore`

Если всё настроили правильно, то при запуске выдаст примерно такое:

```
> npx sequelize-cli db:create

Sequelize CLI [Node: 23.9.0, CLI: 6.6.3, ORM: 6.37.7]

Parsed url mysql://ekolesnikov:*****@kolei.ru/restaurant
Database restaurant created.
```

### Создадим миграцию для начальной инициализации базы данных

```
npx sequelize-cli migration:generate --name first
```

В каталоге `migrations` будет создан файл `YYYYMMDDhhmmss-first.js`:

```js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
```

В методе `up` мы должны прописать команды для создания таблиц и связей, а в методе `down` для удаления. В первой минграции мы создадим таблицу `MenuItem` для хранения блюд (тут вроде все более менее понятно, подробно расписывать не буду - если что-то не понятно, то можно загуглить):

```js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('MenuItem', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        comment: 'название блюда'
      },
      image: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        comment: 'название файла с изображением блюда'
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        comment: 'описание блюда'
      },
      price: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('MenuItem')
  }
}
```

И "накатим" её командой:

```
npx sequelize-cli db:migrate [--url <строка подключения к БД>]
```

Логи консоли:

```
> npx sequelize-cli db:migrate

Sequelize CLI [Node: 23.9.0, CLI: 6.6.3, ORM: 6.37.7]

Parsed url mysql://ekolesnikov:*****@kolei.ru/restaurant
== 20250514112031-first: migrating =======
== 20250514112031-first: migrated (0.240s)
```

Если вдруг что-то забыли, то можно "откатить" последнюю миграцию командой:

```
npx sequelize-cli db:migrate:undo
```

## Использование sequelize для получения данных из БД

Возвращаемся к нашему `app.js`

Добавляем в начале файла импорт библиотеки

```js
const { sequelize } = require('./models')
const { QueryTypes } = require('sequelize')
```

И поменяем _endpoint_ (я добавил префикс `/api`, он нам понадобится при настройке **nginx**, когда будем заворачивать апи в контейнер):

```js
app.get('/api/menu-item', async (req, res) => {
  try {
    res.json(await sequelize.query(`
      SELECT *
      FROM MenuItem
    `, {
      logging: false,
      type: QueryTypes.SELECT
    }))
  } catch (error) {
    console.error(error)
  } finally {
    res.end()
  }
})
```

1. Запросы к БД асинхронные, поэтому заворачиваем код в async/await
1. Список блюд, возвращаемый запросом `sequelize.query` заворачиваем в `res.json()`, это добавит в заголовок ответа `Content-Type: application/json`.

Пока у нас таблица блюд пустая, поэтому в ответе тоже будет пустой массив

## Создание скрипта для наполнения БД начальными данными

**Sequelize** позволяет добавить записи в таблицы (можно использовать для первоначальной инициализации словарей или при тестировании)

```
npx sequelize-cli seed:generate --name menu-items
```

В каталоге `seeders` будет создан файл аналогичный файлам миграции (собственно и отличий между ними нет, просто логически выделены отдельно)

С помощью метода `bulkInsert` формируем список блюд для добавления:

```js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('MenuItem', [   
      {id: 1, title: 'Салат', image: 'Салат.jpg', price: 100},
      {id: 2, title: 'Суп', image: 'Суп.jpg', price: 100},
      {id: 3, title: 'Компот', image: 'Компот.jpg', price: 100}
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'MenuItem', 
      null /* тут можно прописать условие WHERE */
    )
  }
}
```

И запускаем добавление данных командой

```
npx sequelize-cli db:seed:all [--url=...]
```

Можно откатить отдельный импорт, но накатить можно только всё разом. Поэтому для заполнения словарей лучше использовать _bulkInsert_ в обычной миграции, а seeders использовать для тестов.

## Добавление сущностей БД, реализация REST.

Добавим в БД таблицу _Cart_ (корзина) и связи между _Cart_ и _MenuItem_

```
npx sequelize-cli migration:generate --name cart
```

И пропишем в созданном файле команды для создания таблицы с внешним ключем и команды для удаления:

>В реальном проекте ещё нужно добавить таблицу пользователей и привязать корзину к пользователю

```js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Cart', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      menuItemId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        comment: 'для внешнего ключа'
      },
      quantity: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        comment: 'количество'
      }
    })

    /**
     * Внешний ключ корзина_блюдо
     */
    await queryInterface.addConstraint('Cart', {
      fields: ['menuItemId'],
      type: 'foreign key',
      name: 'FK_cart_menu-item',
      references: {
          table: 'MenuItem',
          field: 'id'
      },
      onDelete: 'no action',
      onUpdate: 'no action'
    })

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Cart', 'FK_cart_menu-item')
    await queryInterface.dropTable('Cart')
  }
}
```

### CRUD для корзины

Для того, чтобы тело запроса автоматически преобразовывалось в объект _body_ нужно после создания экземпляра приложения подключить _middleware_ `express.json()` (_middleware_ это функции, которые выполняются до обработки _endpoints_, используются для служебных целей, как в нашем случае, и в целях авторизации. Позже добавим jwt-авторизацию и напишем для неё _middleware_):

```js
...
const app = express()
app.use(express.json())
...
```

#### Create. Для добавления записей в таблицу используется метод POST

```js
app.post('/api/cart', async function(req, res) {
  try {
    await sequelize.query(`
      INSERT INTO Cart (menuItemId, quantity)
      -- значения :menuItemId и :quantity задаются в replacements
      VALUES (:menuItemId, :quantity)
    `,{
      logging: false,
      type: QueryTypes.INSERT,
      // объект replacements должен содержать значения для замены
      replacements: {
        menuItemId: req.body.menuItemId,
        quantity: req.body.quantity
      }
    })
    // ничего не возвращаем, но код ответа меняем на 201 (Created)
    // можно и не менять, по-умолчанию возвращает 200 (OK)
    res.status(201)
  } catch (error) {
    console.warn('ошибка при добавлении блюда в корзину:', error.message)
    // при ошибке возвращаем код ошибки 500 и текст ошибки
    res.status(500).send(error.message)
  } finally {
    res.end()
  }
})
```

#### Read. Чтение

Используется метод get. Пример приводить не буду, он аналогичен запросу списка блюд

#### Update. Редактирование корзины

Для редактирования в REST используются методы PUT или PATCH. PUT - полная перезапись (замещение объекта), PATCH - частичная перезапись (изменение части объекта)

Мы будем только менять количество, поэтому используем PATCH

```js
// в пути можно описать параметр (поставив знак ":")
app.patch('/api/cart/:id', async (req, res) => {
  try {
    await sequelize.query(`
      UPDATE Cart 
      SET quantity=:quantity
      WHERE id=:id
    `,{
      logging: false,
      replacements: {
        // используем параметр из пути
        id: req.params.id,
        quantity: req.body.quantity
      }
    })
  } catch (error) {
    console.warn('ошибка при редактировании корзины:', error.message)
    res.status(500).send(error.message)
  } finally {
    res.end()
  }
})
```

#### Delete. Удаление блюда из корзины

Тут ничего нового

```js
app.delete('/api/cart/:id', async (req, res) => {
  try {
    await sequelize.query(`
      DELETE 
      FROM Cart
      WHERE id=:id
    `,{
      logging: false,
      replacements: {
        id: req.params.id
      }
    })
  } catch (error) {
    console.warn('ошибка при удалении блюда из корзины:', error.message)
    res.status(500).send(error.message)
  } finally {
    res.end()
  }
}) 
```

---

## Задание

Реализовать АПИ для своего курсового проекта по образцу. В следующем году постараюсь написать лекции по DevOps (завернём АПИ, базу и приложение в контейнеры).
