# Маршрутизация

## Добавление маршрутизации

Чтобы связать контроллеры MVC и их действия с запросами применяется система маршрутизации. Чтобы задействовать систему маршрутизации для контроллеров MVC, можно использовать различные способы.

```cs
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
```

Параметр _name_ определяет название маршрута - оно произвольно и в данное случае имеет значение "default". А параметр _pattern_ определяет шаблон маршрута, с которым будут сопоставляться входящие маршруты.

Шаблон маршрута использует три параметра. Параметр "controller" будет сопоставляться по имени с одним из контроллеров приложения, а параметр "action" - с действием этого контроллера. Например, при запросе `http://localhost:3456/Home/Index` система выберет для обработки запроса контроллер __Home__ - имя контроллера без префикса Controller и его действие __Index__.

Данный тип маршрутизации еще называют __Convention-Based Routing__, то есть маршрутизация, основанная на условностях в определениях маршрутов.

### Добавление маршрутов

Для добавления маршрутов в MVC мы можем применять следующие методы:

- __MapControllerRoute()__ определяет произвольный маршрут и принимает следующие параметры:

    ```
    MapControllerRoute(
        string name, 
        string pattern, 
        [object defaults = null], 
        [object constraints = null], 
        [object dataTokens = null])
    ```

    Его параметры:

    - _name_: название машрута
    - _pattern_: шаблон машрута
    - _defaults_: значения параметров маршрутов по умолчанию
    - _constraints_: ограничения маршрута
    - _dataTokens_: определения токенов маршрута

    Первые два параметра являются обязательными, остальные необязательные.

- __MapDefaultControllerRoute()__ определяет стандартный маршрут, фактически эквивалентен вызову

    ```cs
    app.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}");
    ```
    Поскольку это довольно часто используемое определение маршрута, то для него и был введен отдельный метод.

- __MapAreaControllerRoute()__ определяет маршрут, который также учитывает область приложения. Имеет следующие параметры:

    ```
    MapAreaControllerRoute(
        string name, 
        string areaName, 
        string pattern, 
        [object defaults = null], 
        [object constraints = null], 
        [object dataTokens = null])
    ```

    Обязательный параметр _areaName_ позволяет определить область, с которой будет связан маршрут.

- __MapControllers()__ сопоставляет действия контроллера с запросами, используя маршрутизацию на основе атрибутов. Про атрибуты маршрутизации будет сказано в последующих статьях.

- __MapFallbackToController()__ определяет действие контроллера, которое будет обрабатывать запрос, если все остальые определенные маршруты не соответствуют запросу. Принимает имя контроллера и его метода:

    ```
    MapFallbackToController(string action, string controller)
    ```

Определение шаблонов маршрутов, использование ограничений, необязательных параметров и параметров по умолчанию в MVC будет происходить также, как и уже было рассмотрено на примере ASP.NET Core в целом. Единственное существенное отличие состоит в том, что MVC добавляет поддержку атрибутов маршрутизации, которые мы далее рассмотрим.

### Получение параметров маршрутов в контроллере

Мы можем получить в контроллере все параметры маршрута, используя объект __RouteData__:

```cs
public class HomeController : Controller
{
    public string Index()
    {
        var controller = RouteData.Values["controller"];
        var action = RouteData.Values["action"];
        return $"controller: {controller} | action: {action}";
    }
}
```

### Дополнительные параметры маршрута

Шаблон маршрута может содержать дополнительные параметры, которые можно получить через параметры метода. Например, определим следующие маршруты:

```cs
// устанавливаем сопоставление маршрутов с контроллерами
app.MapControllerRoute(name: "default", pattern: "{controller}/{action}/{id}");
app.MapControllerRoute(name: "name_age", pattern: "{controller}/{action}/{name}/{age}");
```

Здесь первый маршрут - "default" принимает третий параметр - _id_, который располагается в третьем сегменте строки запроса.

Второй маршрут - "name_age" принимает дополнительно два параметра - _name_ и _age_, который располагаются соответственно в третьем сегменте и четвертом сегментах строки запроса.

Для тестирования маршрутов определим следующий контроллер:

```cs
public class HomeController : Controller
{
    public string Index(int id) => $"Index Page. Id: {id}";
    public string About(string name, int age) => $"About Page. Name: {name}  Age: {age}";
}
```

И в данном случае, если к приложению придет запрос типа `Home/Index/6`, система маршрутизации сможет сопоставить этот запрос с первым маршрутом - маршрутом "default", который также содержит из трех сегментов, и значение последнего сегмента - число `6` будет передано в метод _Index_ через параметр _id_

Если же к приложению придет запрос из четырех сегментов типа `Home/About/Tom/37`, то система маршрутизации сможет сопоставить этот запрос со вторым маршрутом - маршрутом "name_age". Тогда значение третьего сегмента будет передано в метод через параметр _name_, а значение четвертого сегмента - через параметр _age_:

### Статические сегменты

Шаблоны маршрутов могут иметь статические сегменты, которые не связывются с параметрами маршрутов. Например, определим следующий маршрут:

```cs
// устанавливаем сопоставление маршрутов с контроллерами
app.MapControllerRoute(
    name: "default", 
    pattern: "api/{controller}/{action}/{id}");
```

В данном случае шаблон маршрута начинается со статического сегмента `api/`. Таким образом, этому маршруту будут соответствовать все маршруты, которые состоят из четырех сегментов, где первый сегмент равен `/api`, например, запрос `https://localhost:7288/api/Home/Index/6`

### Необязательные параметры маршрутов

Параметры маршрута могут быть необязательными. Чтобы определить параметр как необязательный, после его названия указывается знак вопроса. Например, определим следующее приложение:

```cs
app.MapControllerRoute(
    name: "default", 
    pattern: "{controller}/{action}/{id?}");
```

В этом шаблоне маршрута третий сегмент представляет параметр _id_, который помечен как необязательный. А это значит, что мы можем в запросе игнорировать значение для этого сегмента. Например, данный шаблон будет соответствовать двух- и трехсегментным запросам, например, двум следующим url:

```
/home/index
/home/index/23
```

Для тестирования определим следующий контроллер:

```cs
public class HomeController : Controller
{
    public string Index(int? id)
    {
        if(id is not null) return $"Product Id: {id}";
            
        return "Product List";
    }
}
```

Здесь, если параметр _id_ определен, то метод _Index_ возвращает одну строку, если неопределен - то другую

Необязательные параметры следует помещать в конце шаблона маршрута, как в случае с параметром _id_ в примере выше. То есть, к примеру, шаблон "{controller}/{action}/{id?}/{name}" не будет работать корректно, если мы для параметра _id_ не передадим значение. А вот шаблон "{controller}/{action}/{name}/{id?}" будет работать нормально.

### Значения параметров по умолчанию

Параметрам маршрута также можно назначить значения по умолчанию на случай, если им не переданы значения:

```cs
// устанавливаем сопоставление маршрутов с контроллерами
app.MapControllerRoute(
    name: "default", 
    pattern: "{controller=Home}/{action=Index}/{id?}");
```

Здесь определен шаблон маршрута, который состоит из трех параметров. Параметр "controller" имеет значение по умолчанию "Home". Параметр "action" имеет значение по умолчанию "Index". Параметр "id" определен как необязательный. В итоге при различных запросах у нас получатся следующие значения:

Запрос | Параметры запроса
-------|------------------
https://localhost:7256/ | controller=Home<br/>action=Index
https://localhost:7256/Book | controller=Book<br/>action=Index
https://localhost:7256/Book/Show | controller=Book<br/>action=Show
https://localhost:7256/Book/Show/2 | controller=Book<br/>action=Show<br/>id=2

Для установки значений по умолчанию также можно применять параметр _defaults_ метода _MapControllerRoute()_. Этот параметр представляет объект, свойства которого соответствуют параметрам маршрута. Например, определим следующий маршрут:

```cs
app.MapControllerRoute(
    name: "default", 
    pattern: "{action}",
    defaults: new { controller = "Home", action = "Index"});
``` 

Здесь шаблон маршрута состоит из одного сегмента, который соответствует параметру "action", то есть представляет действие контроллера. А параметр _defaults_:

```
defaults: new { controller = "Home", action = "Index"}
```

Устанавливает, что в качестве контроллера по умолчанию будет использоваться контроллер Home, а в качестве действия - метод Index.

Например, пусть у нас будет следующий HomeController:

```cs
public class HomeController : Controller
{
    public string Index() => "Index Page";
    public string About() => "About Page";
}
```

В этом случае запрос типа `https://localhost:7288/` будет обрабатываться методом _Index_ контроллера __Home__, а запрос `https://localhost:7288/About` - методом _About_.

При использовании значений по умолчанию мы можем вовсе не использовать в шаблоне параметры маршрута. Например:

```cs
app.MapControllerRoute(
    name: "info", 
    pattern: "contact/info",
    defaults: new { controller = "Home", action = "About"});
```

В данном случае запрос `https://localhost:7288/contact/info` будет обрабатываться методом _About_ контроллера __Home__.

### Ограничения маршрутов

Для параметров маршрута в MVC, также как и в общем в ASP.NET Core, можно устанавливать ограничения. Подробно ограничения были расписаны в лекции [API. REST API. Создание сервера ASP.NET Core.](./api_asp_net_core.md#ограничения-маршрута) Ограничения маршрутов в ASP.NET. В MVC применяется те же ограничения, что и в общем в ASP.NET Core, поэтому в данной статье я не буду их подробно описывать.

Ограничения можно установить непосредственно в шаблоне маршрута:

```cs
app.MapControllerRoute(
    name: "default", 
    pattern: "{controller=Home}/{action=Index}/{id:int?}");
```

В данном случае указывается, что параметр _id_ может иметь либо значение типа __int__, либо значение `null`

Второй способ установки ограничений представляет параметр _constraints_ метода _MapControllerRoute_:

```cs
app.MapControllerRoute(
    name: "default", 
    pattern: "{controller=Home}/{action=Index}/{id?}",
    constraints: new {id= new IntRouteConstraint()});  // ограничения маршрутов
```

Параметр _constraints_ принимает объект, в котором свойства соответствуют по названиям параметрам маршрутов, а значения свойств - ограничения, применяемые к одноименным параметрам маршрутов. Так, в данном случае к параметру _id_ применяется ограничение __IntRouteConstraint__, которое указывает, что _id_ должно представлять значение типа __int__.

## Атрибуты маршрутизации

Кроме маршрутизации на основе условностей или __Convention-Based Routing__, которая рассматривалась в прошлых темах, фреймворк MVC позволяет использовать в приложении маршрутизацию на основе атрибутов. Такой тип маршрутизации еще называется __Attribute-Based Routing__. Атрибуты предоставляют более гибкий способ определения маршрутов.

Для определения маршрута непосредственно в контроллере, необходимо использовать атрибут `[Route]`:

```cs
public class HomeController : Controller
{
    [Route("Home/Index")]
    public IActionResult Index()
    {
        return Content("ASP.NET Core на metanit.com");
    }

    [Route("About")]
    public IActionResult About()
    {
        return Content("About site");
    }
}
```

В данном случае метод _Index_ будет обрабатывать запросы по адресу "Home/Index", а метод _About_ по адресу "About".

Если в проекте планируется использовать только маршрутизацию на основе атрибутов, то в файле ``Program.cs`` мы можем не определять никаких маршрутов. В этом случае для подключения в приложении возможностей маршрутизации достаточно применить метод _MapControllers_ без определения конкретных маршрутов:

```cs
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllersWithViews();
 
var app = builder.Build();
 
app.MapControllers(); 
^^^^^^^^^^^^^^^^^^^^^

app.Run();
```

Но также мы можем комбинировать способы маршрутизации. При чем здесь надо учитывать, что маршрутизация на основе атрибутов имеет больший приоритет. Например, определим следующее действие контроллера:

```cs
public class HomeController : Controller
{
    [Route("homepage")]
    public string Index() => "ASP.NET Core MVC on METANIT.COM";
}
```

В качестве параметра атрибут `Route` принимает шаблон URL, с которым будет сопоставляться запрошенный адрес. И даже если у нас определен стандартный маршрут в файле `Program.cs`:

```cs
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
``` 

Запрос типа `http://localhost:xxxx/home/index` работать не будет, так как мы явно указали с помощью атрибута, что метод _Index_ контроллера __Home__ будет обрабатывать только запросы `http://localhost:xxxx/homepage`

Определение маршрутов с помощью атрибутов подчиняется тем же правилам, что определение маршрутов с помощью метода _MapControllerRoute()_. Например, используем параметры и ограничения:

```cs
[Route("{name:minlength(3)}/{age:int}")]
public string Person(string name, int age)
{
    return $"name={name} | age={age}";
}
```

И к такому методу мы сможем обратиться с запросом типа `http://localhost:xxxx/tom/37`.

Или другой пример - применение необязательного параметра:

```cs
public class HomeController : Controller
{
    [Route("Home/Index/{id?}")]
    public string Test(int? id)
    {
        if(id is not null)
            return $"Параметр id={id}";
        else
            return $"Параметр id неопределен";
    }
}
```

И к такому методу мы сможем обратиться с запросом типа `http://localhost:xxxx/home/index` или добавить параметр `http://localhost:xxxx/home/index/5`.

### Использование префиксов

Допустим, у нас есть несколько методов, для которых определен свой маршрут, и мы хотим, чтобы эти маршруты начинались с одного определенного префикса. Например:

```cs
public class HomeController : Controller
{
    [Route("main/index/{name}")]
    public string Index(string name) => name;
 
    [Route("main/{id:int}/{name:maxlength(10)}")]
    public string Test(int id, string name) => $" id={id} | name={name}";
}
```

Вместо того, чтобы добавлять префикс "main" к каждому маршруту, мы могли бы определить его глобально для всего контроллера:

```cs
[Route("main")]
public class HomeController : Controller
{
    [Route("index/{name}")]
    public string Index(string name) => name;
 
    [Route("{id:int}/{name:maxlength(10)}")]
    public string Test(int id, string name) => $" id={id} | name={name}";
}
```

### Параметры controller и action

От всех параметров шаблона маршрутов в атрибутах отличаются два параметра _controller_ и _action_, которые ссылаются соответственно на контроллер и его действие и которые также можно получить в методе контроллера:

```cs
public class HomeController : Controller
{
    [Route("{controller}/{action}")]
    public string Index()
    {
        var controller = RouteData.Values["controller"];
        var action = RouteData.Values["action"];
        return $"controller: {controller} | action: {action}";
    }
}
```

```cs
public class HomeController : Controller
{
    [Route("{controller}/{action}")]
    public string Index(string controller, string action)
    {
        return $"controller: {controller} | action: {action}";
    }
}
```

### Множественные маршруты

С помощью атрибутов можно задать несколько маршрутов для одного метода. Например:

```cs
[Route("{controller}")]
public class HomeController : Controller
{
   [Route("")]     // сопоставляется с Home
   [Route("Index")] // сопоставляется с Home/Index
    public string Index() => "Index Page";
}
```

Также для контроллера можно задать сразу несколько маршрутов:

```cs
[Route("Store")]
[Route("{controller}")]
public class HomeController : Controller
{
   [Route("Main")]     // сопоставляется с Home/Main, либо с Store/Main
   [Route("Index")] // сопоставляется с Home/Index, либо с Store/Index
   public string Index() => "Index Page";
}
```

### Значения параметров по умолчанию

Также параметры в атрибутах могут иметь значения по умолчанию:

```cs
public class HomeController : Controller
{
    [Route("{controller=Home}/{action=Index}")]
    public string Index(string controller, string action)
    {
        return $"controller: {controller} | action: {action}";
    }
}
```

В данном случае методом _Index_ будут сопоставляться такие запросы как `http://localhost:xxxx/home/index`, `http://localhost:xxxx/home/` и `http://localhost:xxxx/`

Подобным образом можно задавать значения по умолчанию для других параметров, например:

```cs
public class HomeController : Controller
{
    [Route("{name=Tom}")]
    public string Index(string name) => $"Name: {name}";
}
```

В данном случае если параметру _name_ не передано значение, то он по умолчанию принимает в качестве значения строку "Tom"

