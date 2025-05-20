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
* [JWT-авторизация](#jwt-авторизация)

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

Накатываем миграцию командой `npx sequelize-cli db:migrate` и у нас в схеме бд появится таблица Cart:

![](./img/cart.png)

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

## JWT-авторизация

>JSON Web Token (JWT) — это JSON объект, который определен в открытом стандарте RFC 7519. Он считается одним из безопасных способов передачи информации между двумя участниками. Для его создания необходимо определить заголовок (header) с общей информацией по токену, полезные данные (payload), такие как id пользователя, его роль и т.д. и подписи (signature).

### Структура JWT

JWT состоит из трех частей: заголовок `header`, полезные данные `payload` и подпись `signature`. Давайте пройдемся по каждой из них.


#### Шаг 1. Создаем HEADER

Хедер JWT содержит информацию о том, как должна вычисляться JWT подпись. Хедер — это тоже JSON объект, который выглядит следующим образом:

```js
header = { "alg": "HS256", "typ": "JWT"}
```

Поле `typ` не говорит нам ничего нового, только то, что это _JSON Web Token_. Интереснее здесь будет поле `alg`, которое определяет алгоритм хеширования. Он будет использоваться при создании подписи. HS256 — не что иное, как HMAC-SHA256, для его вычисления нужен лишь один секретный ключ (более подробно об этом в шаге 3). Еще может использоваться другой алгоритм RS256 — в отличие от предыдущего, он является ассиметричным и создает два ключа: публичный и приватный. С помощью приватного ключа создается подпись, а с помощью публичного только лишь проверяется подлинность подписи, поэтому нам не нужно беспокоиться о его безопасности.


#### Шаг 2. Создаем PAYLOAD

`Payload` — это полезные данные, которые хранятся внутри **JWT**. Эти данные также называют JWT-claims (заявки). В примере, который рассматриваем мы, сервер аутентификации создает **JWT** с информацией об `id` пользователя — `userId`.

```js
payload = { "userId": "b08f86af-35da-48f2-8fab-cef3904660bd" }
```

Мы положили только одну заявку (claim) в `payload`. Вы можете положить столько заявок, сколько захотите. Существует список стандартных заявок для JWT payload — вот некоторые из них:

* iss (issuer) — определяет приложение, из которого отправляется токен.
* sub (subject) — определяет тему токена.
* exp (expiration time) — время жизни токена.

Эти поля могут быть полезными при создании **JWT**, но они не являются обязательными. Если хотите знать весь список доступных полей для **JWT**, можете заглянуть в **Wiki**. Но стоит помнить, что чем больше передается информации, тем больший получится в итоге сам **JWT**. Обычно с этим не бывает проблем, но все-таки это может негативно сказаться на производительности и вызвать задержки во взаимодействии с сервером.

#### Шаг 3. Создаем SIGNATURE

Подпись вычисляется с использованием следующего псевдо-кода:

```
const SECRET_KEY = 'cAtwa1kkEy'
const unsignedToken = base64urlEncode(header) + '.' + base64urlEncode(payload)
const signature = HMAC-SHA256(unsignedToken, SECRET_KEY)
```

Алгоритм _base64url_ кодирует `хедер` и `payload`, созданные на 1 и 2 шаге. Алгоритм соединяет закодированные строки через точку. Затем полученная строка хешируется алгоритмом, заданным в хедере на основе нашего секретного ключа.

```
// header eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9
// payload eyJ1c2VySWQiOiJiMDhmODZhZi0zNWRhLTQ4ZjItOGZhYi1jZWYzOTA0NjYwYmQifQ
// signature -xN_h82PHVTCMA9vdoHrcZxH-x5mb11y1537t3rGzcM
```

#### Шаг 4. Теперь объединим все три JWT компонента вместе

Теперь, когда у нас есть все три составляющих, мы можем создать наш **JWT**. Это довольно просто, мы соединяем все полученные элементы в строку через точку.

```js
const token = encodeBase64Url(header) + '.' + encodeBase64Url(payload) + '.' + encodeBase64Url(signature)
// JWT Token
// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJiMDhmODZhZi0zNWRhLTQ4ZjItOGZhYi1jZWYzOTA0NjYwYmQifQ.-xN_h82PHVTCMA9vdoHrcZxH-x5mb11y1537t3rGzcM
```

Вы можете попробовать создать свой собственный JWT на сайте jwt.io.

Вернемся к нашему примеру. Теперь сервер аутентификации может слать пользователю JWT.

### Как JWT защищает наши данные?

Очень важно понимать, что использование **JWT** НЕ скрывает и не маскирует данные. Причина, почему **JWT** используются — это проверка, что отправленные данные были действительно отправлены авторизованным источником. Как было продемонстрировано выше, данные внутри **JWT** закодированы и подписаны, обратите внимание, это не одно и тоже, что зашифрованы. Цель кодирования данных — преобразование структуры. Подписанные данные позволяют получателю данных проверить аутентификацию источника данных. Таким образом закодирование и подпись данных не защищает их. С другой стороны, главная цель шифрования — это защита данных от неавторизованного доступа.

### Простыми словами

1. При авторизации по логину/паролю сервер убеждается, что такой пользователь есть, формирует **JWT**-токен, содержащий полезную информацию и подпись, и возвращает этот токен клиенту (сайт, приложение)

1. Клиент при последующих запрсах добавляет **JWT**-токен в заголовок запроса:

    ```
    Authorization: Bearer <JWT-токен>
    ```

1. Сервер, получая **JWT**-токен уже не лезет в таблицу пользователей, а просто проверяет подпись токена, убеждаясь что она не подделана (ключ подписи есть только у севрера). А затем может использовать полезную информацию из токена в запросах к БД. Таким образом мы экономим на каждом входящем запросе одно обращение к БД (а работа с БД самое медленное действие, вычисление подписи намного дешевле)

### Подключаем JWT-авторизацию к нашему проекту

#### Устанавливаем необходимые пакеты:

```
npm i jsonwebtoken md5
```

* **jsonwebtoken** - нужен для формирования и проверки токена
* **md5** - для хеширования пароля

#### Подключаем зависимости

```js
const md5 = require('md5')
const jwt = require('jsonwebtoken')
```

#### Задаём подпись

Этот параметр тоже нельзя светить, поэтому считываем из переменных окружения (добавьте в `jaunch.json`)

```js
const JWT_SECRET = process.env.JWT_SECRET
```

#### Реализуем метод авторизации

```js
/**
 * В теле запроса должен быть объект с логином и паролем:
 * {
 *  "login": "ваш логин",
 *  "password": "пароль"
 * }
 */
app.post('/api/user/login', async (req, res) => {
  try {
    // const user = await sequelize.query(`
    //   SELECT *
    //   FROM User
    //   WHERE login=:login
    // `, {
    //   // параметр plain нужен, чтобы запрос вернул не массив записей, а конкретную запись
    //   // если записи с таким логином нет, то вернет null
    //   plain: true,
    //   logging: false,
    //   type: QueryTypes.SELECT,
    //   replacements: {
    //     login: req.body.login
    //   }
    // })

    // у меня нет таблицы User, поэтому я сделал заглушку
    // вам нужно брать данные для авторизации из БД
    const user = {
      password: md5('123456'),
      id: 1,
      roleId: 1
    }

    if (user) {
      // хешируем пароль
      const passwordMD5 = md5(req.body.password)

      if (user.password == passwordMD5) {

        // формируем токен
        const jwtToken = jwt.sign({
            id: user.id, 
            firstName: user.firstName,
            roleId: user.roleId 
          }, 
          JWT_SECRET
        )

        res.json(jwtToken)
      } else {
        res.status(401).send('не верный пароль')
      }
    } else {
      res.status(404).send('пользователь не найден')
    }
  } catch (error) {
    console.warn('ошибка при авторизации:', error.message)
    res.status(500).send(error.message)
  } finally {
    res.end()
  }
})
```

#### Реализуем аутентификацию пользователя в запросе корзины, используя middleware

**Middleware** функция принимает на входе параметры `req`, `res`, `next`, где `req`, `res` соответственно запрос и ответ, а `next` нужно вызвать, если всё нормально и можно вызывать следующую middleware функцию (их может быть несколько)

```js
/**
 * Middleware авторизации
 */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')

    if (token[0].toLowerCase() != 'bearer')
      return res.status(400).send('не поддерживаемый тип авторизации')

    jwt.verify(token[1], JWT_SECRET, (err, data) => {
      // если в результате есть ошибка (err)
      // то возвращаем статус forbidden
      if (err) return res.status(403).send(err)

      // иначе сохраняем полезные данные в объект user запроса
      req.user = data
      next()
    })
  } else {
    res.status(401).send('нет заголовка авторизации')
  }
}
```

Теперь добавляем эту функцию в запрос получения корзины (обратите внимание, у меня в бд нет пользователей, поэтому я закомментировал часть кода, в вашем проекте нужно раскомментировать):

```js
/**
 * Вторым параметром запроса можно добавить массив middleware
 */
app.get('/api/cart', [authenticateJWT], async (req, res) => {
  try {
    res.json(await sequelize.query(`
      SELECT *
      FROM Cart
      -- в моей БД нет пользователей
      -- WHERE userId=:userId
    `, {
      logging: false,
      type: QueryTypes.SELECT
      // replacements: {
      //   userId: req.user.id
      //               ^^^^ обратите внимание, тут используется объект user, заполненный в middleware аутентификации
      // }
    }))
  } catch (error) {
    console.error(error)
  } finally {
    res.end()
  }
})
```

## Задание

Реализовать АПИ для своего курсового проекта по образцу. В следующем году постараюсь написать лекции по DevOps (завернём АПИ, базу и приложение в контейнеры).
