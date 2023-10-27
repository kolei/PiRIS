Предыдущая лекция |  | Следующая лекция
:----------------:|:----------:|:----------------:
[Аутентификация и авторизация](./api_auth.md) | [Содержание](../readme.md#разработка-своего-api) | 

# HTTP запросы в C#. Получение списка материалов выбранного продукта

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

В АПИ мы использовали "базовую" авторизацию. В C# я не нашёл встроенных библиотек для облегчения формирования заголовка для "базовой" авторизации, но реализация не сложная - нпишем сами.

Формируем base64-кодированную строку:

```cs
var basic = Convert.ToBase64String(
    ASCIIEncoding.ASCII.GetBytes("admin:password"));
```

И добавляем заголовок нашему http-клиенту:

```cs
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basic);
```

## GET-запрос.

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

## GET-запрос. Разбор JSON ответа.

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

## Удаление записей

Для вызова http-метода `DELETE` используется метод *DeleteAsync*:

```cs
// тут, как в GetBody, создайте клиента и задайте заголовок

client.DeleteAsync(
    $"http://localhost:8080/material/{productId}/{materialId}");
```

При работе с таблицей **ProductMaterial** не забываем, что у нас составной первичный ключ и нужны идентификаторы и продукта и материала.

## POST запросы с JSON (Добавление записей в модель в терминологии REST API)

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
