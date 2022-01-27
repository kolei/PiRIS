# HTTP запросы в C#. Получение списка материалов выбранного продукта

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

В АПИ мы использовали "базовую" авторизацию. В C# я не нашёл встроенных библиотек для облегчения формирования заголовка для "базовой" авторизации

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

    return client.GetStringAsync(url).Result;
}
```

## Разбор JSON

Сначала допишем интерфейс нашего поставщика данных:

```cs
interface IDataProvider
{
    ...
    IEnumerable<MaterialTC> GetMaterials(int ProductId);
}    
```

Здесь я класс назвал не **Material**, а **MaterialTC**, потому что АПИ возвращает не весь объект Material, а только название и количество (**T**itle**C**ount).

### Классический вариант

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

### Вариант с регулярками

>Этот вариант не рекомендую, т.к. JSON-строка может быть в юникодной кодировке

Стандартный вариант слишком монстрообразный, на мой взгляд. Можно тоже самое реализовать через регулярки:

Класса нам достаточно одного:

```cs
internal class MaterialTC
{
    public string Title { get; set; }
    public int Count { get; set; }
}
```

Реализация метода **GetMaterials**:

```cs
public IEnumerable<MaterialTC> GetMaterials(int ProductId) {
    var result = new List<MaterialTC>();

    var resp = GetString($"http://localhost:8080/Material?product_id={ProductId}");

    Regex regex = new Regex(@"\{""Title"":""(.*?)"",""Count"":(.*?)\}", RegexOptions.Singleline);
    MatchCollection matches = regex.Matches(resp);
    if (matches.Count > 0)
    {
        foreach (Match match in matches)
            res.Add(new MaterialTC { 
                Title = match.Groups[1].ToString(), 
                Count=Convert.ToInt32(match.Groups[2].ToString()) 
            });
    }
    return result;
}
```

Надо, конечно, ещё проверить валидность ответа (notice->data|notice->answer), но с регулярками это тоже проще - вообще не нужно рисовать новый класс.

### Вариант с JavaScriptSerializer

Оказывается на **WorldSkills** можно использовать не только "голый" **.NET Framework**, но и библиотеки из других компонентов **Visual Studio**.

В пространстве имён **System.Web.Script.Serialization** есть класс **JavaScriptSerializer**, который выглядит попроще чем классическая реализация:

>В пакет разработки C# не входит библиотека **System.Web.Extensions** (в которой и находится **System.Web.Script.Serialization**). Нужно в "Обозревателе решений" добавить в "Ссылки" библиотеку *Сборки -> Платформа -> System.Web.Extensions*

```cs
// целевые классы нам по прежнему нужны, но уже без всяких аннотаций
internal class MaterialTC
{
    public string Title { get; set; }
    public int Count { get; set; }
}

internal class Notice
{
    public Material[] data;
}

internal class Answer
{
    public Notice notice;
}


// в месте, где нам нужно распарсить JSON создаем сериализатор и разбираем строку
var serializer = new JavaScriptSerializer();
var answer = serializer.Deserialize<Answer>("тут ваша JSON-строка");

// и ВСЁ
```

## Удаление записей

Для удаления данных в REST API используется http-метод DELETE. (Но никто не запрещает использовать и другие методы)

Запрос в REST клиенте выглядит примерно так, идентификатор удаляемой записи передаём параметрами:

```
DELETE {{url}}/Product?id=131
                      ^^^^^^^  
Authorization: Basic esmirnov 111103
```

1. Сначала надо доработать наш PHP-класс:

    В конструкторе добавляем обработку метода DELETE:

    ```php
    switch($_SERVER['REQUEST_METHOD'])
    {
        case 'DELETE':
            $this->processDelete($_SERVER['PATH_INFO']);
            break;
        ...
    ```

    При реализации метода идентификатор удаляемой записи достаём из глобальной переменной **$_GET**

    ```php
    private function processDelete($path)
    {
        switch($path)
        {
            case '/Product':
                $this->auth();

                // print_r($_GET);
                $id = $_GET['id'] ?: 0;

                // методы, которые не подразумевают ответа, выполняются командой execute
                if($id)
                    $this->db->query("DELETE FROM Product WHERE id=$id")
                        ->execute();
                $this->response['status'] = 0;
                break;
            default:
                header("HTTP/1.1 404 Not Found");
        }
    }
    ```

2. Теперь в C# осталось реализовать метод удаления выбранной записи

    Строку запроса, надеюсь, сформируете сами.

    Для вызова http-метода DELETE используется метод DeleteAsync:

    ```cs
    var basic = Convert.ToBase64String(
                ASCIIEncoding.ASCII.GetBytes("esmirnov:111103"));
    var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basic);
    client.DeleteAsync($"http://localhost:8080/Product?id={id}").Result;
    ```

## POST запросы с JSON (Добавление записей в модель в терминологии REST API)

1. В проекте C# нарисуйте форму добавления продажи (в окне продукции)

2. В **DataProvider** добавьте метод *AddProductSale*, который на входе получает экземпляр класса **ProductSale** и реализуйте отправку POST-запроса в локальный PHP-сервер, который добавит эту продажу в соответствующую таблицу

    ```cs
    // сначала запихиваем объект в JSON-строку. 
    var jsonString = serializer.Serialize(NewProductSale);

    // создаём контент для запроса
    var json = new StringContent(jsonString, Encoding.UTF8, "application/json");

    // и вызываем POST-запрос
    var client = new HttpClient();
    // не забываем добавить авторизацию
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basic);
    var result = client.PostAsync("http://localhost:8080/ProductSale", json).Result;

    // Console.WriteLine(result.Content.ReadAsStringAsync().Result);
    ```

3. Обработка POST-запроса с типом *application/json*

    В PHP есть глобальная переменная **$_POST** в которую автоматически парсятся данные POST запроса, но только если тип запроса *application/x-www-form-urlencoded*.

    Тип JSON появился сравнительно недавно, поэтому PHP автоматически его не парсит. Приходится писать разбор вручную

    ```php
    private function processPost($path)
    {
        // входной поток данных (содержимое запроса, content) считывается в строку
        $rawData = file_get_contents('php://input');
        // и преобразуется в объект 
        $json = json_decode($rawData);
        switch($path)
        {
            case '/ProductSale':
                $this->auth();

                // тут пишем запрос вставки данных в таблицу 
                // к полям объекта JSON можно обращаться так: $json->Title, ...

                $query = $this->db->prepare("INSERT INTO ProductSale (SomeName) VALUES (:SomeName)");
                $query->execute([':SomeName'=>$json->Title]);

                $this->response['status'] = 0;

                break;

            default:
                header("HTTP/1.1 404 Not Found");
        }
    }
    ```

    При формировании SQL-запроса нужно экранировать значения, PDO может это сделать за нас. Для этого сначала нужно "подготовить" запрос, выполнив метод **prepare**, в котором вместо реальных значений пишутся алиасы (символьное имя с каким-либо префиксом). А затем, при выполнении подготовленного запроса передаётся ассоциативный массив "алиас"=>"значение".