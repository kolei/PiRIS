# Получение списка материалов выбранного продукта

Возвращаемся к проекту на C#.

Мы остановились на списке материалов.

Реализуем получение списка материалов выбранного продукта с помощью HTTP-запроса к АПИ, которое мы реализовали в прошлой теме.

Напоминаю, GET-запрос на локальный компьютер:

```
GET http://localhost:8080/Material?product_id=1
Authorization: Basic esmirnov 111103
```

На C# нам надо решить две задачи:

* получить JSON-строку с помощью GET-запроса
* распарсить JSON-строку, получив массив материалов

## HTTP-запросы

Для HTTP-запросов будем использовать встроенный класс **HttpClient**

```cs
var client = new HttpClient();
```

В АПИ мы использовали "базовую" авторизацию. В C# я не нашёл встроенных библиотек для облегчения формирования заголовка для "базовой" авторизации (вероятно они есть в сборке для веб разработки, но мы должны пользоваться только тем, что есть в обычной)

Формируем base64-кодированную строку:

```cs
var basic = Convert.ToBase64String(
    ASCIIEncoding.ASCII.GetBytes("esmirnov:111103"));
```

И добавляем заголовок нашему http-клиенту:

```cs
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basic);
```

Теперь можно запрашивать данные. 

У **HttpClient** все методы асинхронные, нужно понимать как работают async/await. Я для облегчения вашей работы нарисовал синхронную реализацию:

```cs
// в параметрах URL
private string GetString(string url){
    var basic = Convert.ToBase64String(
        ASCIIEncoding.ASCII.GetBytes("esmirnov:111103"));
        
    var client = new HttpClient();

    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basic);

    // тут самое интересное - клиент возвращает не строку, а "задачу", которая по выполнении вернёт строку
    Task<string> task = client.GetStringAsync(url);

    // методом Wait мы превращаем нашу функцию в синхронную
    task.Wait();

    // и возвращаем результат ВЫПОЛНЕННОЙ задачи
    return task.Result;
}
```

## Разбор JSON

Теперь допишем интерфейс нашего поставщика данных:

```cs
interface IDataProvider
{
    ...
    IEnumerable<MaterialTC> GetMaterials(int ProductId);
}    
```

Здесь я класс назвал не **Material**, а **MaterialTC**, потому что АПИ возвращает не весь объект материал, а только название и количество (**T**itle**C**ount).

И реализуем его:

```cs
[DataContract]
internal class MaterialTC
{
    [DataMember]
    public string Title { get; set; }
    [DataMember]
    public int Count { get; set; }
}

// В ответе у нас не сразу массив материалов, а два вложенных объекта, поэтому надо их тоже описать

[DataContract]
internal class Notice
{
    [DataMember]
    public Material[] data { get; set; }
}

[DataContract]
internal class Answer
{
    [DataMember]
    public Notice notice { get; set; }
}

public IEnumerable<MaterialTC> GetMaterials(int ProductId) {
    var result = new List<MaterialTC>();

    var resp = GetString($"http://localhost:8080/Material?product_id={ProductId}");

    var Serializer = new DataContractJsonSerializer(typeof(Answer));

    using (var sr = new StreamReader(new MemoryStream(Encoding.UTF8.GetBytes(resp))))
    {
        var answer = (Answer)Serializer.ReadObject(sr.BaseStream);

        foreach (MaterialTC material in answer.notice.data)
        {
            result.Add(material);
        }
    }

    return result;
}
```