# MVC. Контроллер: результат действий

## Результаты действий

При обращении к веб-приложению, как правило, пользователь ожидает получить некоторый ответ, например, в виде веб-страницы, которая наполнена данными. На стороне сервера метод контроллера, получая параметры и данные запроса, обрабатывает их и формирует ответ в виде результата действия. Результат действия - это тот объект, который возвращается методом после обработки запроса.

Результатом действия может быть практически что угодно. Например, в прошлых темах использовался объект __string__, например:

```cs
public string Index()
{
    return "Hello METANIT.COM";
}
```

Пользователь передает методу некоторые значения и в ответ на запрос видит в своем браузере строку ответа.

Результатом действия может быть какой-нибудь сложный объект:

```cs
public class HomeController : Controller
{
    public Message Index() => new Message("Hello METANIT.COM");
}
public record class Message(string Text);
```

Результатом может быть даже __void__, то есть по сути ничего:

```cs
public void GetVoid()
{
 
}
```

В данном случае метод _GetVoid_ представляет вполне реальное действие контроллера, к которому можно обращаться из адресной строки браузера, передавать параметры, и который может содержать сложную логику обработки запроса. Только после обращения к этому методу пользователь увидит в своем веб-браузере одну пустоту, так как метод ничего не возвращает.

Но в большинстве случаев мы будем иметь дело не с __void__ и даже не с типом __string__, а с объектами типа __IActionResult__, которые непосредственно предназначены для генерации результата действия. Интерфейс __IActionResult__ находится в пространстве имен Microsoft.AspNetCore.Mvc и определяет один метод:

```cs
public interface IActionResult
{
    Task ExecuteResultAsync(ActionContext context);
}
```

Метод `ExecuteResultAsync` принимает контекст действия и выполняет генерацию результата.

Этот интерфейс затем реализуется абстрактным базовым классом __ActionResult__:

```cs
public abstract class ActionResult : IActionResult
{
    public virtual Task ExecuteResultAsync(ActionContext context)
    {
            ExecuteResult(context);
            return Task.FromResult(true);
    }
 
    public virtual void ExecuteResult(ActionContext context)
    {
    }
}
```

__ActionResult__ добавляет синхронный метод, который выполняется в асинхронном. И если мы вдруг захотим создать свой класс результата действий, то как раз можем либо унаследовать его от ActionResult, либо реализовать интерфейс __IActionResult__.

Итак, создадим свой класс результата действий. Для этого вначале добавим в проект новый класс, который назовем __HtmlResult__

Определим в нем следующий код:

```cs
public class HtmlResult : IActionResult
{
    string htmlCode;

    // конструктор
    public HtmlResult(string html) => htmlCode = html;

    public async Task ExecuteResultAsync(ActionContext context)
    {
        string fullHtmlCode = @$"<!DOCTYPE html>
        <html>
            <head>
                <title>METANIT.COM</title>
                <meta charset=utf-8 />
            </head>
            <body>{htmlCode}</body>
        </html>";
        await context.HttpContext.Response.WriteAsync(fullHtmlCode);
    }
}
```

Данный класс будет реализовать интерфейс __IActionResult__. В конструкторе он принимает html-код, который затем будет выводиться на веб-страницу. Для вывода используется асинхронный метод context.HttpContext.Response.WriteAsync()

Теперь используем этот класс в контроллере:

```cs
public class HomeController : Controller
{
    public IActionResult Index()
    {
        return new HtmlResult("<h2>Hello METANIT.COM!</h2>");
    }
}
```

Здесь определен метод `Index()`, который возвращает объект __HtmlResult__. При обращении к этому объекту будет срабатывать его метод `ExecuteResultAsync()`, в котором будет происходить генерация html-страницы

Однако в большинстве случаев нам не придется создавать свои классы результатов, потому что фреймворк ASP.NET Core MVC итак предоставляет довольно большую палитру классов результатов для самых различных ситуаций:

- __ContentResult__: отправляет ответ в виде строки
- __EmptyResult__: отправляет пустой ответ в виде статусного кода 200

    ```cs
    public IActionResult GetVoid()
    {
        return new EmptyResult();
    }
    ```

    Аналогичен следующему методу:

    ```cs
    public void GetVoid()
    {
    }
    ```

- __NoContentResult__: во многом похож на __EmptyResult__, также отправляет пустой ответ, только в виде статусного кода 204

    ```cs
    public IActionResult GetVoid()
    {
        return new NoContentResult();
    }
    ```

- __FileResult__: является базовым классом для всех объектов, которые пишут набор байтов в выходной поток. Предназначен для отправки файлов
- __FileContentResult__: класс, производный от FileResult, пишет в ответ массив байтов
- __VirtualFileResult__: также производный от FileResult класс, пишет в ответ файл, находящийся по заданному пути
- __PhysicalFileResult__: также производный от FileResult класс, пишет в ответ файл, находящийся по заданному пути. Только в отличие от предыдущего класса использует физический путь, а не виртуальный.
- __FileStreamResult__: класс, производный от FileResult, пишет бинарный поток в выходной ответ
- __ObjectResult__: возвращает произвольный объект, как правило, применяется в качестве базового класса для других классов результатов. Но можно применять и самостоятельно:

    ```cs
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return new ObjectResult(new Person("Tom", 37));
        }
    }
    record class Person(string Name, int Age);
    ```

- __StatusCodeResult__: результат действия, который возвращает клиенту определенный статусный код HTTP
- __UnauthorizedResult__: класс, производный от StatusCodeResult. Возвращает клиенту ответ в виде статусного кода HTTP `401`, указывая, что пользователь не прошел авторизацию и не имеет прав доступа к запрошенному ресурсу.
- __NotFoundResult__: производный от StatusCodeResult. Возвращает клиенту ответ в виде статусного кода HTTP `404`, указывая, что запрошенный ресурс не найден
- __NotFoundObjectResult__: производный от ObjectResult. Также возвращает клиенту ответ в виде статусного кода HTTP `404` с дополнительной информацией
- __BadRequestResult__: производный от StatusCodeResult. Возвращает статусный код `400`, тем самым указывая, что запрос некорректен
- __BadRequestObjectResult__: производный от ObjectResult. Возвращает статусный код `400` с некоторой дополнительной информацией
- __OkResult__: производный от StatusCodeResult. Возвращает статусный код `200`, который уведомляет об успешном выполнении запроса
- __OkObjectResult__: производный от ObjectResult. Возвращает статусный код `200` с некоторой дополнительной информацией
- __CreatedResult__: возвращает статусный код `201`, который уведомляет о создании нового ресурса. В качестве параметра принимает адрес нового ресурса
- __ChallengeResult__: используется для проверки аутентификации пользователя
- __JsonResult__: возвращает в качестве ответа объект или набор объектов в формате JSON
- __PartialViewResult__: производит рендеринг частичного представления в выходной поток
- __RedirectResult__: перенаправляет пользователя по другому адресу URL, возвращая статусный код 302 для временной переадресации или код 301 для постоянной переадресации зависимости от того, установлен ли флаг Permanent.
- __RedirectToRouteResult__: класс работает подобно RedirectResult, но перенаправляет пользователя по определенному адресу URL, указанному через параметры маршрута
- __RedirectToActionResult__: выполняет переадресацию на определенный метод контроллера
- __LocalRedirectResult__: перенаправляет пользователя по определенному адресу URL в рамках веб-приложения
- __ViewComponentResult__: возвращает в ответ сущность ViewComponent
- __ViewResult__: производит рендеринг представления и отправляет результаты рендеринга в виде html-страницы клиенту

Рассмотрим некоторые из этих классов.

## ContentResult и JsonResult

### ContentResult

ContentResult отправляет клиенту ответ в виде строки. Так, следующий пример:

```cs
public string Index()
{
    return "Hello METANIT.COM";
}
```

Можно переписать с использованием ContentResult:

```cs
public IActionResult Index()
{
    return Content("Hello METANIT.COM");
}
```

Для отправки ContentResult не надо использовать конструктор, так как в контроллере уже определен специальный метод Content(), который принимает отправляемую строку и создает объект ContentResult.

### JsonResult

Одним из наиболее популярных в наше время форматов хранения и передачи данных является формат JSON (JavaScript Object Notation). JSON не зависит от языка программирования, он более удобен и легче обрабатывается.

В JSON каждый отдельный объект заключается в фигурные скобки и представляет собой набор пар ключ-значение, разделенных запятыми, где ключом является название свойства объекта, а значением соответственно значение этого свойства. Например: {"name":"Tom"}. Здесь "name" является ключом, а "Tom" - значением.

Для отправки объекта в формате json в контроллере имеется метод Json(object obj), который в качестве параметра принимает отправляемый объект. Например:

```cs
public JsonResult GetName()
{
    return Json("Tom");
}
```

В данном случае на сторону клиента отправляется строка "Tom".

Допустим, у нас есть следующий класс Person:

```cs
record class Person(string Name, int Age);
```

И тогда для отправки клиенту объекта Person мы можем написать следующий метод:

```cs
public IActionResult Index()
{
    Person tom = new Person("Tom", 37);
    return Json(tom);
}
```

При обращении к методу веб-браузер выведет полное описание объекта в формате json

Дополнительная версия метода Json() в качестве второго параметра принимает объект, который задает настройки сериализации в формат json. В качестве такого объекта выступает объект типа JsonSerializerOptions:

```cs
public class HomeController : Controller
{
    public IActionResult Index()
    {
        var tom = new Person("Tom", 37);
        var jsonOptions = new System.Text.Json.JsonSerializerOptions 
        { 
            PropertyNameCaseInsensitive = true, // не учитываем регистр
            WriteIndented = true                // отступы для красоты
        };
        return Json(tom, jsonOptions);
    }
}
record class Person(string Name, int Age);
```

В данном случае объект JsonSerializerOptions задает с помощью свойств параметры сериализации в json. В частности, значение свойства `PropertyNameCaseInsensitive = true` говорит, что регистр названий свойств не учитывается. А свойство `WriteIndented = true` задает установку отступов перед свойствами для более человекопонятного вывода

## Отправка статусных кодов

Нередко возникает необходимость отправить в ответ на запрос какой-либо статусный код. Например, если пользователь пытается получить доступ к ресурсу, который недоступен, или для которого у пользователя нету прав. Либо если просто нужно уведомить браузер пользователя с помощью статусного кода об успешном выполнении операции, как иногда применяется в ajax-запросах. Для этого в ASP.NET Core MVC определена богатая палитра классов, которые можно использовать для отправки статусного кода.

### StatusCodeResult

StatusCodeResult позволяет отправить любой статусный код клиенту:

```cs
public IActionResult Index()
{
    return StatusCode(401);
}
```

Для создания этого результата используется метод StatusCode(), в который передается отправляемый код статуса.

Подобным образом мы можем послать браузеру любой другой статусный код. Но для отдельных кодов статуса предназначены свои отдельные классы.

### HttpNotFoundResult и HttpNotFoundObjectResult

NotFoundResult и NotFoundObjectResult посылает код `404`, уведомляя браузер о том, что ресурс не найден. Второй класс в дополнении к статусному коду позволяет отправить доплнительную информацию, которая потом отобразится в браузере.

Объекты обоих классов создаются методом NotFound. Для первого класса - это метод без параметров, для второго класса - метод, который в качестве параметра принимает отправляемую информацию. Например, используем NotFoundObjectResult:

```cs
public IActionResult Index()
{
    return NotFound("Resource not found");
}
```

### UnauthorizedResult и UnauthorizedObjectResult

UnauthorizedResult посылает код `401`, уведомляя пользователя, что он не автризован для доступа к ресурсу:

```cs
public IActionResult Index(int age)
{
    if (age < 18) return Unauthorized();
    return Content("Access is available");
}
```

Для создания ответа используется метод Unauthorized().

UnauthorizedObjectResult также посылает код `401`, только позволяет добавить в ответ некоторый объект с информацией об ошибке:

```cs
public class HomeController : Controller
{
    public IActionResult Index(int age)
    {
        if (age < 18) return Unauthorized(new Error("Access is denied"));
        return Content("Access is available");
    }
}
record class Error(string Message);
```

### BadResult и BadObjectResult

BadResult и BadObjectResult посылают код `400`, что говорит о том, что запрос некорректный. Второй класс в дополнении к статусному коду позволяет отправить доплнительную информацию, которая потом отобразится в браузере.

Эти классы можно применять, например, если в запросе нет каких-то параметров или данные представляют совсем не те типы, которые мы ожидаем получить, и т.д.

Объекты обоих классов создаются методом BadRequest. Для первого класса - это метод без параметров, для второго класса - метод, который в качестве параметра принимает отправляемую информацию:

```cs
public IActionResult Index(string? name)
{
    if (string.IsNullOrEmpty(name)) return BadRequest("Name undefined");
    return Content($"Name: {name}");
}
```

### OkResult и OkObjectResult

OkResult и OkObjectResult посылают код `200`, уведомляя об успешном выполнении запроса. Второй класс в дополнении к статусному коду позволяет отправить дополнительную информацию, которая потом отправляется клиенту в формате json.

Объекты обоих классов создаются методом Ok(). Для первого класса - это метод без параметров, для второго класса - метод, который в качестве параметра принимает отправляемую информацию:

```cs
public IActionResult Index()
{
    return Ok("Don't worry. Be happy");
}
```
