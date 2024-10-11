Предыдущая лекция |  | Следующая лекция
:----------------:|:----------:|:----------------:
[Аутентификация и авторизация](./api_auth.md) | [Содержание](../readme.md#разработка-своего-api) | 

# HTTP запросы в C#.

* [HTTP-запросы (класс **HttpClient**)](#http-запросы)
    * [GET-запрос](#get-запрос)
    * [Разбор JSON ответа.](#разбор-json-ответа)
    * [POST запросы с JSON (Добавление записей в модель в терминологии REST API)](#post-запросы-с-json-добавление-записей-в-модель-в-терминологии-rest-api)

Возвращаемся к основному проекту (список продукции).

Реализуем получение данных не через базу, а через АПИ с помощью HTTP-запросов.

На C# нам надо решить две задачи:

* получить JSON-строку с помощью HTTP-запроса
* распарсить JSON-строку

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

Но можно не заморачиваться и использовать свойство _Result_, которое вернет **синхронный** результат.

Напишем класс **ApiDataPrivider**:

>Можно как обычно реализовать его "с нуля", реализуя интерфейс **IDataProvider** (в этом случае придется сразу писать все методы), но можно реализовать механизм наследования: сделать потомка класса **DBDataProvider**, постепенно переопределяя методы.

Ниже показана реализация одного метода класса, остальные перепишите сами. И не забудьте в конструкторе главного окна поменять инициализацию _dataProvider_: `Global.dataProvider = new ApiDataProvider();`

>В базовом классе (**DBDataProvider**) нужно добавить методам модификатор **virtual**

```cs
public class ApiDataProvider: DBDataProvider
{
    private static string baseUrl = "http://localhost:5000";
    public override IEnumerable<Product> getProduct(int pageNum)
    {
        var client = new HttpClient();

        var body = client.GetStringAsync(
            $"{baseUrl}/product?pageNum={pageNum}"
        ).Result;

        return JsonConvert.DeserializeObject<Product[]>(body);
    }
}
```

Если вы используете авторизацию, то при запросе данных добавляйте заголовок:

```cs
var basic = Convert.ToBase64String(
    ASCIIEncoding.ASCII.GetBytes("esmirnov:123456"));
    
var client = new HttpClient();

client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basic);
```

Метод *GetStringAsync* возвращает объект `Task<string>`, т.е. **задачу**, которая выполняется в отдельном потоке и по завершении вернёт строку (тело ответа). Чтобы не возиться с асинхронностью, можно запросить свойство _Result_.

### Разбор JSON ответа.

Для работы с JSON нужно установить **NuGet** пакет `Newtonsoft.Json` и использовать метод десериализации объекта:

```cs
return JsonConvert.DeserializeObject<Product[]>(body);
```

В общем случае может быть десериализован любой валидный JSON, но мы явно в угловых скобках указываем, что ожидаем массив продуктов.

### POST запросы с JSON (Добавление записей в модель в терминологии REST API)

```cs
// сначала запихиваем объект в JSON-строку. 
var jsonString = JsonConvert.SerializeObject(product)

// создаём контент для http-запроса
var json = new StringContent(
    jsonString, 
    Encoding.UTF8, 
    "application/json"
);

// и вызываем POST-запрос
var client = new HttpClient();

// не забываем добавить авторизацию
client.DefaultRequestHeaders.Authorization = 
    new AuthenticationHeaderValue("Basic", basic);

var result = client.PostAsync(
    $"{baseUrl}/product", 
    json).Result;
```

---

**Задание:**

Полностью реализовать класс **ApiDataProvider**

Предыдущая лекция |  | Следующая лекция
:----------------:|:----------:|:----------------:
[Аутентификация и авторизация](./api_auth.md) | [Содержание](../readme.md#разработка-своего-api) | 
