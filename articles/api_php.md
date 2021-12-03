# API. PHP-сервер. GET-запрос.

**API** (программный интерфейс приложения, интерфейс прикладного программирования) (англ. application programming interface, API) — описание способов (набор классов, процедур, функций, структур или констант), которыми одна компьютерная программа может взаимодействовать с другой программой.

**WEB-сервер** — сервер, принимающий HTTP-запросы от клиентов, обычно веб-браузеров, и выдающий им HTTP-ответы, как правило, вместе с HTML-страницей, изображением, файлом, медиа-потоком или другими данными.

**HTTP** (англ. HyperText Transfer Protocol — «протокол передачи гипертекста») — протокол прикладного уровня передачи данных, изначально — в виде гипертекстовых документов в формате HTML, в настоящее время используется для передачи произвольных данных.

Основой **HTTP** является технология «клиент-сервер», то есть предполагается существование:

* Потребителей (клиентов), которые инициируют соединение и посылают запрос;
* Поставщиков (серверов), которые ожидают соединения для получения запроса, производят необходимые действия и возвращают обратно сообщение с результатом.

## Структура HTTP-сообщения

Каждое HTTP-сообщение состоит из трёх частей, которые передаются в указанном порядке:

* Стартовая строка (англ. Starting line) — определяет тип сообщения;
* Заголовки (англ. Headers) — характеризуют тело сообщения, параметры передачи и прочие сведения;
* Тело сообщения (англ. Message Body) — непосредственно данные сообщения. Обязательно должно отделяться от заголовков пустой строкой.

### Стартовая строка

Стартовые строки различаются для запроса и ответа. Строка запроса выглядит так:

`Метод URI HTTP/Версия`

Здесь:

* Метод (англ. Method) — тип запроса, одно слово заглавными буквами. Cписок методов для версии 1.1 представлен ниже.
* URI определяет путь к запрашиваемому документу.
* Версия (англ. Version) — пара разделённых точкой цифр. Например: 1.0.

Чтобы запросить страницу данной статьи, клиент должен передать строку (задан всего один заголовок):

```
GET /wiki/HTTP HTTP/1.0
Host: ru.wikipedia.org
```

Стартовая строка ответа сервера имеет следующий формат: `HTTP/Версия КодСостояния Пояснение`, где:

* Версия — пара разделённых точкой цифр, как в запросе;
* Код состояния (англ. Status Code) — три цифры. По коду состояния определяется дальнейшее содержимое сообщения и поведение клиента;
* Пояснение (англ. Reason Phrase) — текстовое короткое пояснение к коду ответа для пользователя. Никак не влияет на сообщение и является необязательным.

Например, стартовая строка ответа сервера на предыдущий запрос может выглядеть так:

```
HTTP/1.0 200 OK
```

### Методы

Метод HTTP (англ. HTTP Method) — последовательность из любых символов, кроме управляющих и разделителей, указывающая на основную операцию над ресурсом. Обычно метод представляет собой короткое английское слово, записанное заглавными буквами. Обратите внимание, что название метода чувствительно к регистру.

Сервер может использовать любые методы, не существует обязательных методов для сервера или клиента. Если сервер не распознал указанный клиентом метод, то он должен вернуть статус 501 (Not Implemented). Если серверу метод известен, но он неприменим к конкретному ресурсу, то возвращается сообщение с кодом 405 (Method Not Allowed). В обоих случаях серверу следует включить в сообщение ответа заголовок Allow со списком поддерживаемых методов.

**GET**

Используется для запроса содержимого указанного ресурса.

Клиент может передавать параметры выполнения запроса в URI целевого ресурса после символа «?»:

```
GET /path/resource?param1=value1&param2=value2 HTTP/1.1
```

**POST**

Применяется для передачи пользовательских данных заданному ресурсу.

### Коды состояния

Код состояния является частью первой строки ответа сервера. Он представляет собой целое число из трёх цифр. Первая цифра указывает на класс состояния. За кодом ответа обычно следует отделённая пробелом поясняющая фраза на английском языке, которая разъясняет человеку причину именно такого ответа. Примеры:

```
201 Webpage Created
403 Access allowed only for registered users
507 Insufficient Storage
```

### Заголовки

Заголовки HTTP (англ. HTTP Headers) — это строки в HTTP-сообщении, содержащие разделённую двоеточием пару параметр-значение. Заголовки должны отделяться от тела сообщения хотя бы одной пустой строкой.

Примеры заголовков:

```
Server: Apache/2.2.11 (Win32) PHP/5.3.0
Last-Modified: Sat, 16 Jan 2010 21:16:42 GMT
Content-Type: text/plain; charset=windows-1251
Content-Language: ru
```

### Тело сообщения

Тело HTTP-сообщения (message-body), если оно присутствует, используется для передачи тела объекта, связанного с запросом или ответом.

## Языки для разработки WEB-серверов

В принципе WEB-сервер можно написать на любом языке. Но удобнее разрабатывать сервер на тех языках, где есть нативная (на уровне языка) или внешняя (с помощью подключаемых модулей) поддержка HTTP-протокола.

К таким относятся (список не полный, тут только то с чем я сам работал или "на слуху"):

* **PHP** - скриптовый язык общего назначения, интенсивно применяемый для разработки веб-приложений. В настоящее время поддерживается подавляющим большинством хостинг-провайдеров и является одним из лидеров среди языков, применяющихся для создания динамических веб-сайтов. В своем составе имеет библиотеки для работы с базами данных, поэтому его мы в дальнейшем и будем изучать.
* **Java** -  строго типизированный объектно-ориентированный язык программирования общего назначения.
* **Node или Node.js** - программная платформа, основанная на движке V8 (транслирующем JavaScript в машинный код), превращающая JavaScript из узкоспециализированного языка в язык общего назначения. Node.js добавляет возможность JavaScript взаимодействовать с устройствами ввода-вывода через свой API, написанный на C++, подключать другие внешние библиотеки, написанные на разных языках, обеспечивая вызовы к ним из JavaScript-кода. Node.js применяется преимущественно на сервере, выполняя роль веб-сервера.
* **Python** - (в русском языке встречаются названия пито́н или па́йтон) — высокоуровневый язык программирования общего назначения с динамической строгой типизацией.

## Синтаксис PHP

Пробежимся по верхушкам:

**Переменные** - зяык динамически типизируемый, поэтому типы при объявлении переменных можно не использовать. Переменной одного типа в любой момент может быть присвоено значение другого типа. Ключевых слов для объявления переменных тоже нет - переменная создается в момент присваивания ей значения (но если попытаться считать переменную до её объявления, то получим исключение). Первым символом в названии переменной должен быть знак "$"

```php
$myVariable = 0;
$myVariable = "а может не 0";
```

**Массивы** - пустой массив можно создать либо функцией *array*, либо просто присвоив пустой массив

```php
$myArray = array();
$myArray = [];
```

Массивы бывают обычные и ассоциативные (пара ключ - значение)

```php
$simpleArray = [1, 2, 3];
$associativeArray = [
    'one' => 'value',
    'two' => 'value'
];
```

**Литералы** - строки могут быть как в одинарных, так и в двойных кавычках. Двойные кавычки отличаются тем, что в них можно использовать управляющие символы и переменные

```php
$string = 'это строка';
$anotherString = "это тоже строка, но она поддерживает перенос\n и может включать переменные $string";
```

**Функции** - функции объявляются ключевым словом *function*, тело функции заключается в фигурные скобки - обычный Си-подобный синтаксис

```php
function someFunction($firstParam, $secondParam)
{
    return $firstParam.$secondParam;
}
$concat = someFunction('раз', 'два');
```

Обратите внимание, для склеивания строк используется символ точки, знак "+" используется только с числовыми переменными.

**Классы**

```php
class ApiServer extends ParentClass
{
    // свойство класса
    private $var;

    // конструктор класса
    public function __construct(){
        // ЛОКАЛЬНАЯ переменная
        $var = 0;

        $this->var = 1;
    }
}
```

Обратите внимание, обращение к свойствам и методам класса производится через ключевое слово `$this`

## Разработка API-сервера на PHP

API будем писать похожее на то, что использовалось для проекта "база" (то апи написано на **Node.js**, в конце я приведу исходный код). Отличия обусловлены тем, что сервер на PHP является **stateless** (не хранящим состояние). Поэтому без использования дополнительных механизмов (**Redis**, **Mongo**) нам негде хранить токен и будем использовать "базовую" авторизацию.

Таким образом, запросы *login* и *logout* нам не понадобятся, сразу реализуем методы получения данных (примеры запросов в формате плагина **REST Client** редактора VSCode).

```
### Запрос списка продукции
GET {{url}}/Product
Authorization: Basic ZXNtaXJub3Y6MTExMTAz
```

Обратите внимание, вместо токена используется заголовок *Authorization*. В этом заголовке первое слово обозначает алгоритм авторизации (они бывают разные), а второе это закодированная **base64** строка `логин:пароль` (позже, когда мы вернёмся к C#, я покажу как сформировать эту строку программно, а пока можете её получить используя онлайн кодировщики base64). 

## WEB-сервер

Точкой входа сервера по-умолчанию являются файлы `index.html` или `index.php`.

Создайте файл `index.php`:

```php
<?php

    // тут можно писать код

?>
```

Описываем класс сервера и создаём его (при этом вызовется конструктор)

```php
class ApiServer
{
    public function __construct(){
        print_r($_SERVER);
    }
}
new ApiServer();
```

Функция *print_r* выводит в консоль содержимое переменной

Переменная *$_SERVER* внутренняя глобальная переменная языка **PHP**, она содержит параметры запроса и возвращает примерно такое:

```
Array
(
    [DOCUMENT_ROOT] => /home/kei/[ЙОТК]/API_PHP
    [REMOTE_ADDR] => 127.0.0.1
    [REMOTE_PORT] => 39956
    [SERVER_SOFTWARE] => PHP 7.4.3 Development Server
    [SERVER_PROTOCOL] => HTTP/1.1
    [SERVER_NAME] => localhost
    [SERVER_PORT] => 8000
    [REQUEST_URI] => /Product
    [REQUEST_METHOD] => GET
    [SCRIPT_NAME] => /index.php
    [SCRIPT_FILENAME] => /home/kei/[ЙОТК]/API_PHP/index.php
    [PATH_INFO] => /Product
    [PHP_SELF] => /index.php/Product
    [HTTP_USER_AGENT] => vscode-restclient
    [HTTP_AUTHORIZATION] => Basic ZXNtaXJub3Y6MTExMTAz
    [HTTP_ACCEPT_ENCODING] => gzip, deflate
    [HTTP_HOST] => localhost:8000
    [HTTP_CONNECTION] => close
    [PHP_AUTH_USER] => esmirnov
    [PHP_AUTH_PW] => 111103
    [REQUEST_TIME_FLOAT] => 1638434071.8106
    [REQUEST_TIME] => 1638434071
)
```

Нам, для начала, интересны параметры:

* REQUEST_METHOD - метод запроса (GET, POST и т.д.)
* PATH_INFO - путь запроса (что именно мы хотим получить, в нашем случае `/Product`). Есть ещё параметр REQUEST_URI, но в нём хранится путь вместе с параметрами запроса (например, `/Product?id=1`)
* PHP_AUTH_USER - логин пользователя (если использовалась базовая авторизация)
* PHP_AUTH_PW - пароль пользователя (если использовалась базовая авторизация)

Разберем на примере простой скрипт:

```php
class ApiServer
{
    // шаблон ответа
    private $response = ['notice'=>[]];

    private $db = null;

    public function __construct(){
        // результат в формате JSON
        header('Content-Type: application/json; utf-8');

        try {
            
            switch($_SERVER['REQUEST_METHOD'])
            {
                case 'GET': 
                    $this->processGet($_SERVER['PATH_INFO']);
                    break;
                // case 'POST':
                //     $this->processPost($_SERVER['PATH_INFO']);
                //     break;
            }
        } catch (\Throwable $th) {
            $this->response['notice']['answer'] = $th->getMessage();
        }

        // выводим в stdout JSON-строку
        echo json_encode($this->response, JSON_UNESCAPED_UNICODE);
    }

    private function processGet($path)
    {
        switch($path)
        {
            case '/Product':
                $this->auth();
                
                // получаем данные
                $this->response['notice']['data'] = $this->db
                    ->query("SELECT * FROM Product")
                    ->fetchAll(PDO::FETCH_ASSOC);
                break;
            default:
                header("HTTP/1.1 404 Not Found");
        }
    }

    private function auth()
    {
        if(!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW']))
            throw new Exception('Не задан логин/пароль');

        // пытаемся подключиться к MySQL серверу
        $this->db = new PDO(
            "mysql:host=kolei.ru;port=3306;dbname={$_SERVER['PHP_AUTH_USER']};charset=UTF8", 
            $_SERVER['PHP_AUTH_USER'], 
            $_SERVER['PHP_AUTH_PW']);
    }
}
```

Запустить локальный сервер для отладки можно из командной строки в каталоге проекта

```
php -S localhost:8000
```

### Паракметры GET-запроса

Параметры GET-запроса передаются прямо в URL. Отделяются от пути знаком вопроса. Между собой разделяются знаком &. Представляют собой пары `ключ=значение`. Например, так может выглядеть запрос материала по нужному продукту:

```
GET {{url}}/Material?product_id=1
```

PHP автоматически разбирает URL и параметры GET-запроса нам доступны через глобальную переменную $_GET:

```php
$productId = $_GET['product_id'];
```

## Моя реализация на Node.js

```js
// директива интерпретатору "строгий режим"
'use strict'

const { json } = require('express')
// импортируем библиотеки
const   express = require('express')
const   mysql   = require('mysql')

var users = []
var chat = []

//добавляю к консольному выводу дату и время
function console_log(fmt, ...aparams){
    fmt = (new Date()).toJSON().substr(0, 19)+' '+fmt
    console.log(fmt, ...aparams)
}

// создание экземпляра http-сервера
var app = express()

// метод .use задает команды, которые будут выполнены до разбора GET/POST команд

// декодирует параметры запроса
app.use( express.urlencoded() )
app.use( express.json() )

app.use('/img', express.static(__dirname +'/products') );

// логгирую все входящие запросы
app.use((req, res, next)=>{
    console_log('[express] %s request from %s, body: %s', req.path, req.ip, JSON.stringify(req.body))
    next()
})

app.get('/about', (req,res)=>{
    let ans = {notice: {answer: 'echo about'}}
    console_log( JSON.stringify(ans) )
    res.json( ans )
    res.end()
})

function mysqlConnect(config){
    return new Promise((resolve, reject)=>{
        const connection = mysql.createConnection(config)
        connection.connect((err)=>{
            if(err) reject(err)
            resolve(connection)
        })
    })
}

function getUserByLogin(login){
    for (let user of users) {
        if (user.login==login)
            return user
    }
    return null
}

function getUserByToken(token){
    for (let user of users) {
        if (user.token==token)
            return user
    }
    return null
}

function removeUser(login){
    for(let id in users){
        if(users[id].login==login) {
            users.splice(id, 1)
            break
        }
    }
}

function getToken(){
    return Math.ceil( Math.random()*9999999 )+1;
}

app.get('/chat', (req,res)=>{
    try {
        if(req.headers.token==undefined) 
            throw new Error("В заголовке запроса нет токена")
        let user = getUserByToken(req.headers.token)
        if(user == null)
            throw new Error("Пользователь не авторизован")

        res.json({notice:{messages: chat}});
    } catch (error) {
        // при ошибке возвращаем текст ошибки
        res.json({notice:{answer: error.message}});
    }

    // метод .end закрывает соединение
    res.end()
})

app.post('/chat', (req,res)=>{
    try {
        if(req.headers.token==undefined) 
            throw new Error("В заголовке запроса нет токена")

        if(req.body.message==undefined) 
            throw new Error("В параметрах нет атрибута message")

        let user = getUserByToken(req.headers.token)
        if(user == null)
            throw new Error("Пользователь не авторизован")

        chat.push({
            user: user.login,
            message: req.body.message
        })

        res.json({notice: {answer: "OK"}});
    } catch (error) {
        // при ошибке возвращаем текст ошибки
        res.json({notice:{answer: error.message}});
    }

    // метод .end закрывает соединение
    res.end()
})

// POST запрос "логин"
app.post('/login', async (req,res)=>{
    try {
        // проверяем параметры запроса
        if(req.body.username==undefined) 
            throw new Error("В параметрах нет атрибута username")
        if(req.body.password==undefined) 
            throw new Error("В параметрах нет атрибута password")

        let user = getUserByLogin(req.body.username)
        if(user != null)
            throw new Error("Пользователь уже авторизован, используйте токен или перелогиньтесь")

        // если такого пользователя в базе нет, то выкинет исключение    
        let connection = await mysqlConnect({
            host: 'kolei.ru',
            user: req.body.username,
            password: req.body.password,
            database: req.body.username
        })

        let token = getToken()

        users.push({
            login: req.body.username,
            password: req.body.password,
            token
        })

        connection.destroy()

        // если все нормально - возвращаем токен
        res.json({notice: {token}});
        
    } catch (error) {
        // при ошибке возвращаем текст ошибки
        res.json({notice:{answer: error.message}});
    }

    // метод .end закрывает соединение
    res.end()
})

// POST запрос "выход"
app.post('/logout', (req,res)=>{
    try {
        // проверяем параметры запроса
        if(req.body.username==undefined) 
            throw new Error("В параметрах нет атрибута username")

        removeUser(req.body.username)
        res.json({notice:{answer: 'OK'}});
    } catch (error) {
        // при ошибке возвращаем текст ошибки
        res.json({notice:{answer: error.message}});
    }
    
    res.end()
})

function query(connection, sql){
    return new Promise((resolve, reject)=>{
        connection.query(sql, function(error, result, fields){
            if(error) reject(error)
            resolve(result)
        })
    })
}

// все остальные геты считаются запросами к базе
app.get('/*', async (req, res)=>{
    try {
        if(req.path.startsWith('/img/')){
            res.status(404).send(new Error('файл не найден'))
        } else {
            if(req.headers.token==undefined) 
                throw new Error("В заголовке запроса нет токена")

            let userInfo = getUserByToken(req.headers.token)
            if(userInfo==null)
                throw new Error("Не найден пользователь с указанным токеном")

            let connection = await mysqlConnect({
                host: 'kolei.ru',
                user: userInfo.login,
                password: userInfo.password,
                database: userInfo.login
            })
        
            try{
                let data = await query(connection, `SELECT * FROM ${req.path.substr(1)}`)
                res.json({notice:{data}})
            } finally {
                connection.destroy()
            }
        }
    } catch (error) {
        // при ошибке возвращаем текст ошибки
        res.json({notice:{answer: error.message}});
    }

    // метод .end закрывает соединение
    res.end()
})

// запуск сервера на порту 8080
app.listen(3013, '0.0.0.0', ()=>{
    console_log('HTTP сервер успешно запущен на порту 3013')
}).on('error', (err)=>{
    console_log('ошибка запуска HTTP сервера: %s', err)
})
```