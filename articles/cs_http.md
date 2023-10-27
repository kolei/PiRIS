Предыдущая лекция |  | Следующая лекция
:----------------:|:----------:|:----------------:
[Аутентификация и авторизация](./api_auth.md) | [Содержание](../readme.md#разработка-своего-api) | 

# HTTP запросы в C#. Получение списка материалов выбранного продукта. Авторизация.

* [HTTP-запросы (класс **HttpClient**)](#http-запросы)
    * [GET-запрос](#get-запрос)
    * [Разбор JSON ответа.](#разбор-json-ответа)
    * [DELETE (Удаление записей)](#delete-удаление-записей)
    * [POST запросы с JSON (Добавление записей в модель в терминологии REST API)](#post-запросы-с-json-добавление-записей-в-модель-в-терминологии-rest-api)
* [Авторизация](#авторизация)
    * [Реализация конечной точки в АПИ](#реализация-конечной-точки-в-апи)
    * [Авторизация в клиентском приложении](#авторизация-в-клиентском-приложении)

Возвращаемся к проекту на C#.

Мы остановились на списке материалов.

Реализуем получение списка материалов выбранного продукта с помощью HTTP-запроса.

>Напоминаю, в лекции про АПИ было задание реализовать конечную точку `GET /material/{productId:int}`:

На C# нам надо решить две задачи:

* получить JSON-строку с помощью GET-запроса
* распарсить JSON-строку, получив массив материалов

## HTTP-запросы

Для HTTP-запросов будем использовать встроенный класс **HttpClient**

```cs
var client = new HttpClient();
```

В АПИ мы использовали "базовую" авторизацию. В C# я не нашёл встроенных библиотек для облегчения формирования заголовка для "базовой" авторизации, но реализация не сложная - напишем сами.

Формируем base64-кодированную строку:

```cs
var basic = Convert.ToBase64String(
    ASCIIEncoding.ASCII.GetBytes("admin:password"));
```

И добавляем заголовок нашему http-клиенту:

```cs
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basic);
```

### GET-запрос.

Теперь можно запрашивать данные. 

У класса **HttpClient** все методы *асинхронные*, нужно понимать как работают `async/await`.

>[Асинхронность в C#](./cs_async_await.md)

Я для облегчения вашей работы нарисовал реализацию:

```cs
// в параметрах URL
private Task<string> GetBody(string url){
    var basic = Convert.ToBase64String(
        ASCIIEncoding.ASCII.GetBytes("esmirnov:111103"));
        
    var client = new HttpClient();

    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basic);

    return client.GetStringAsync(url);
}
```

Метод *GetStringAsync* возвращает объект `Task<string>`, т.е. задачу, которая выполняется в отдельном потоке и по завершении вернёт строку (тело ответа)

### Разбор JSON ответа.

Для работы с JSON нужно установить **NuGet** пакет `Newtonsoft.Json` и использовать метод десериализации объекта:

```cs
// в месте, где нам нужно распарсить ответ сервера
materialList = JsonConvert.DeserializeObject<Material[]>("тут ответ вашего АПИ");
```

В общем случае может быть десериализован любой валидный JSON, но мы явно в угловых скобках указываем, что ожидаем массив материалов.

Весь метод получения списка материалов помещается в 3 строки:

```cs
private async void GetMaterials()
{
    var resp = await GetBody(
        $"http://localhost:8080/material/{currentProduct.Id}");

    materialList = JsonConvert
        .DeserializeObject<Material[]>(resp);

    Invalidate("materialList");
}
```

Так как метод *GetBody* возвращает задачу (**Task**), то мы ставим перед ним ключевое слово **await**, то есть ждём завершения задачи, а сам метод помечаем как асинхронный (**async**), чтобы система знала, что этот метод асинхронный.

### DELETE (Удаление записей)

Для вызова http-метода `DELETE` используется метод *DeleteAsync*:

```cs
// тут, как в GetBody, создайте клиента и задайте заголовок

client.DeleteAsync(
    $"http://localhost:8080/material/{productId}/{materialId}");
```

При работе с таблицей **ProductMaterial** не забываем, что у нас составной первичный ключ и нужны идентификаторы и продукта и материала.

### POST запросы с JSON (Добавление записей в модель в терминологии REST API)

1. В проекте нарисуйте форму добавления материала в текущий продукт (в окне продукции)

1. Реализуйте отправку POST-запроса, который добавит новый материал в таблицу **ProductMaterial**

    ```cs
    // при добавлении материала 
    // у вас должен быть выбран материал 
    // и указано его количество

    // сначала запихиваем объект в JSON-строку. 
    var jsonString = JsonConvert.SerializeObject(
        new {
            MaterialId = Id выбранного материала,
            Count = количество
        });

    // создаём контент для http-запроса
    var json = new StringContent(
        jsonString, 
        Encoding.UTF8, 
        "application/json");

    // и вызываем POST-запрос
    var client = new HttpClient();

    // не забываем добавить авторизацию
    client.DefaultRequestHeaders.Authorization = 
        new AuthenticationHeaderValue("Basic", basic);

    var result = client.PostAsync(
        $"http://localhost:8080/material/{currentProduct.Id}", 
        json);
    ```

## Авторизация

Часто в встречается задача сделать авторизацию пользователя и скрыть часть информации для неавторизованного пользователя.

Скрытие сделать просто - сделайте привязку (binding) атрибута _IsVisible_ к какому-нибудь свойству (мы это уже делали для кнопки массовой смены цены продукции).

Показать форму с полями ввода для `логина/пароля` вы тоже уже можете.

Осталось разобраться как отправить запрос авторизации на сервер и обработать его на сервере...

Если отправлять обычным POST-запросом с телом запроса в JSON-формате, то вы это тоже уже умеете. Но для авторизации часто используется старый формат запроса: `application/x-www-form-urlencoded`.

Запрос с таким форматом выглядит примерно так:

```
POST /login
Content-Type: application/x-www-form-urlencoded

login=qwerty
&password=asdf
```

т.е. параметры запроса формируются как _querystring_, но передаются в теле запроса.

### Реализация конечной точки в АПИ

```cs
app.MapPost(
    "/login", 
    async (context) =>
    {
        /*
            параметры в таком формате автоматически не парсятся
            приходится их вручную доставать из тела запроса
        */
        var formData = await context.Request.ReadFormAsync();

        var login = formData["login"].ToString();
        var password = formData["password"].ToString();

        /*
            "Успешность" авторизации определяем кодом ответа
            у меня, как обычно, логин и пароль прибиты гвоздями
            но в реальном приложении надо читать из базы
        */
        if (login == "admin" && password == "password") 
        {
            /*
                Тут можно передать не только код, 
                но и информацию о пользователе
            */
            context.Response.StatusCode = 200;
        }
        else
            context.Response.StatusCode = 401;
    }).AllowAnonymous();
```

### Авторизация в клиентском приложении

>Кнопку "Авторизоваться" и окно авторизации сделайте сами

Для хранения информации об авторизации заведем класс **Globals** со статическими свойствами:

```cs
public class Globals
{
    public static string? token = null;

    public static bool isAuth() => token != null;

    public static void createToken(string login, string password)
    {
        token = Convert.ToBase64String(
            ASCIIEncoding.ASCII.GetBytes($"{login}:{password}"));
    }
}
```

У нас остаётся базовая авторизация и я сразу формирую токен в нужном формате. Если используется авторизация по токену (**Bearer**), то метод _createToken_ не нужен, просто сохранить токен: `Globals.token = "токен, полученный при авторизации"`.

И в окне авторизации реализуем отправку запроса:

```cs
private async void AuthButton_OnClick(object? sender, RoutedEventArgs e)
{
    /* 
        создаем словарь
        и записываем в него данные в виде пары ключ/значение
        для кадого передаваемого параметра
    */
    var param = new Dictionary<string, string>
    {
        { "login", LoginTextBox.Text },
        { "password", PasswordTextBox.Text }
    };
    var client = new HttpClient();

    /*
        В инициализатор запроса добавляется содержимое
    */
    var req = new HttpRequestMessage(
        HttpMethod.Post, 
        "http://localhost:8080/login")
    {
        Content = new FormUrlEncodedContent(param)
    };

    var response = await client.SendAsync(req);

    /*
        При успешной авторизации сохраняем токен
    */
    if (response.StatusCode == HttpStatusCode.OK)
    {
        Globals.createToken(
            LoginTextBox.Text, 
            PasswordTextBox.Text);

        /*
            тут закрываем окно авторизации,
            а в главном окне обновляем состояние 
            визуальных элементов доступных только
            авторизованному пользователю
        */
    }
    /*
        в else можно написать логику для неуспешной авторизации,
        например, показать окно
    */

}
```

>В коде используются свойства *LoginTextBox* и *PasswordTextBox* - это имена соответствующих визуальных элементов в окне авторизации.

Ну и во всех запросах, требующих авторизации, вставляем токен авторизации:

```cs
private Task<string> GetBody(string url)
{
    var client = new HttpClient();

    client.DefaultRequestHeaders.Authorization = 
        new AuthenticationHeaderValue(
            "Basic", 
            Globals.token   // берём готовый
        );

    return client.GetStringAsync(url);
}
```

---

**Задание:**

* реализовать авторизацию:
    - доработка АПИ
    - окно с вводом логина/пароля и авторизация
    - скрытие кнопок "создать продукт" и "сменить цену"
    - не открывать окно редактирование продукции, если пользователь не авторизован
* реализовать в окне редактирования продукции CRUD для списка материалов продукта, используя HTTP-запросы

Предыдущая лекция |  | Следующая лекция
:----------------:|:----------:|:----------------:
[Аутентификация и авторизация](./api_auth.md) | [Содержание](../readme.md#разработка-своего-api) | 
