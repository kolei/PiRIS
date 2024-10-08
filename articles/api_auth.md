Предыдущая лекция |  | Следующая лекция
:----------------:|:----------:|:----------------:
[API. REST API. Создание сервера ASP.NET Core. Swagger.](./api_asp_net_core.md) | [Содержание](../readme.md#разработка-своего-api) | [HTTP запросы в C#. Получение списка материалов выбранного продукта](./cs_http.md)

# Аутентификация и авторизация

* [Введение в аутентификацию и авторизацию](#введение-в-аутентификацию-и-авторизацию)
    - [Аутентификация](#аутентификация)
    - [Авторизация](#авторизация)

* [Реализация "Basic" авторизации](#реализация-basic-авторизации)

## Введение в аутентификацию и авторизацию

>Теория взята [отсюда](https://metanit.com/sharp/aspnet6/13.1.php)

Важное место в приложении занимает *аутентификация* и *авторизация*. **Аутентификация** представляет процесс определения пользователя. **Авторизация** представляет процесс определения, имеет ли пользователь право доступа к некоторому ресурсу. То есть, если _аутентификация_ отвечает на вопрос "Кем является пользователь?", то _авторизация_ отвечает на вопрос "Какие права пользователь имеет в системе?" **ASP.NET Core** имеет встроенную поддержку аутентификации и авторизации.

### Аутентификация

Для выполнения аутентификации в конвейере обработки запроса отвечает специальный компонент **middleware** - **AuthenticationMiddleware**. Для встраивания этого **middleware** в конвейер применяется метод расширения **UseAuthentication()**

Следует отметить, что метод **UseAuthentication()** должен встраиваться в конвейер до любых компонентов **middleware**, которые используют аутентификацию пользователей (но после **Swagger**).

Для выполнения аутентификации этот компонент использует сервисы аутентификации, в частности, сервис **IAuthenticationService**, которые регистрируются в приложении с помощью метода _AddAuthentication()_:

В качестве параметров метод _AddAuthentication()_ может принимать схему аутентификации в виде строки и делегат, который устанавливает опции аутентификации - объект **AuthenticationOptions**.

Наиболее расcпространенные схемы аутентификации:

* **Basic**: аутентификация на основе имени и пароля, мы в дальнейшем будем использовть его, т.к. он используется на соревнованиях. Но в реальной разработке он используется редко и в **ASP.NET Core** не имеет реализации. Есть сторонние пакеты, но мы напишем свою реализацию.
* **Cookies**: аутентификация на основе куки. Хранится в константе `CookieAuthenticationDefaults.AuthenticationScheme`
* **Bearer**: аутентификация на основе **JWT**-токенов. Хранится в константе `JwtBearerDefaults.AuthenticationScheme` (вообще токены могут быть любые, а не только **JWT**)

**Схема аутентификации** позволяет выбирать определенный обработчик аутентификации. **Обработчик аутентификации** собственно и выполняет непосредственную аутентификацию пользователей на основе данных запроса и исходя из схемы аутентификации.

Например, для аутентификации с помощью куки передается схема "Cookies". Соответственно для аутентификации пользователя будет выбираться встроенный обработчик аутентификации - класс `Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationHandler`, который на основе полученных в запросе **cookie** выполняет аутентификацию.

А если используется схема "Bearer", то это значит, что для аутентификации будет использоваться **JWT**-токен, а в качестве обработчика аутентификации будет применяться класс `Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerHandler`. Стоит отметить, что для аутентификации с помощью **JWT**-токенов необходимо добавить в проект через **Nuget** пакет `Microsoft.AspNetCore.Authentication.JwtBearer`

При чем в ASP.NET Core мы не ограничены встроенными схемами аутентификации и можем создавать свои кастомные схемы и под них своих обработчиков аутентификации.

Кроме применения схемы аутентификации необходимо подключить аутентификацию определенного типа. Для этого можно использовать следуюшие методы:

* AddCookie(): подключает и конфигурирует аутентификацию с помощью куки.

* AddJwtBearer(): подключает и конфигурирует аутентификацию с помощью jwt-токенов (для этого метода необходим Nuget-пакет `Microsoft.AspNetCore.Authentication.JwtBearer`)

Оба метода реализованы как методы расширения для типа *AuthenticationBuilder*, который возвращается методом AddAuthentication():

```cs
var builder = WebApplication.CreateBuilder();

// добавление сервисов аутентификации
// схема аутентификации - с помощью jwt-токенов
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer();
 
var app = builder.Build();
 
// добавление middleware аутентификации 
app.UseAuthentication();
```

### Авторизация

Авторизация представляет процесс определения прав пользователя в системе, к каким ресурсам приложения он имеет право доступа и при каких условиях.

Хотя авторизация представляет отдельный независимый процесс, тем не менее для нее также необходимо, чтобы приложение также применяло аутентификацию.

Для подключения авторизации необходимо встроить компонент `Microsoft.AspNetCore.Authorization.AuthorizationMiddleware`. Для этого применяется встроенный метод расширения **UseAuthorization()**

Кроме того, для применения авторизации необходимо зарегистрировать сервисы авторизации с помощью метода **AddAuthorization()**

Одна из версий метода принимает делегат, который с помощью параметра *AuthorizationOptions* позволяет сконфигурировать авторизацию.

Ключевыми элементами механизма авторизации в ASP.NET Core являются методы **AllowAnonymous** и **RequireAuthorization** которые позволяет ограничить доступ к ресурсам приложения. Например:

```cs
var builder = WebApplication.CreateBuilder();
 
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer();
builder.Services.AddAuthorization();
 
var app = builder.Build();
 
app.UseAuthentication();
app.UseAuthorization();
 

app.MapGet("/private", () => "Ресурс только для авторизованных пользователей!")
    .RequireAuthorization();

app.MapGet("/", () => "Общедоступный ресурс")
    .AllowAnonymous();
 
app.Run();
```

Здесь в приложении определены две конечных точки: `/` и `/private`. Конечная точка `/` должна быть доступна всем пользователям, поэтому к ней применяется метод *AllowAnonymous* (разрешить не авторизованным), а к конечной точке `/private` применяется метод *RequireAuthorization* (только авторизованным).

Если мы обратимся к конечной точке `/`, то у нас не возникнет никаких проблем.

Однако если мы обратимся к ресурсу `/private`, то мы получим ошибку `401`, которая говорит о том, что пользователь не авторизован для доступа к этому ресурсу.

Дальше всю теорию я расписывать не буду, но вы можете почитать подробнее [тут](https://metanit.com/sharp/aspnet6/13.1.php)

## Реализация "Basic" авторизации

Данные об авторизации, если она нужна, передаются в заголовке запроса:

```
Authorization: <тип авторизации> <данные для авторизации>
```

При базовой аторизации 

* тип авторизации: **Basic**
* данные для авторизации: строка в формате `логин:пароль` закодированная **base64**

```
Authorization: Basic base64encodedloginandpassword
```

>Код для реализации нарыл у GPT, в инете вменяемых не нашёл

1. Создайте класс **BasicAuthenticationHandler**, который должен наследоваться от класса **AuthenticationHandler<TOptions>**

    Класс привожу с комментариями, можно использовать как есть

    ```cs
    public class BasicAuthenticationHandler:
        AuthenticationHandler<AuthenticationSchemeOptions>
    {
        // конструктор, реализация не нужна
        public BasicAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options, 
            ILoggerFactory logger, 
            UrlEncoder encoder, 
            ISystemClock clock) : base(options, logger, encoder, clock)
        {
        }

        // вся "движуха" происходит в этом методе
        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            // если в заголовках нет аттрибута Authorization 
            // то результат авторизации Fail (не успешный)
            if (!Request.Headers.ContainsKey("Authorization"))
                return Task.FromResult(
                    AuthenticateResult.Fail(
                        "Missing Authorization header"));

            try
            {
                // получаем строку авторизации
                var authorizationHeader = Request
                    .Headers["Authorization"].ToString();
                
                // я сделал логгирование всех этапов
                // в релизе можно вырезать
                Console.WriteLine(
                    $"authorizationHeader = {authorizationHeader}");
                
                // достаем из строки "Basic base64data" вторую подстроку
                var base64EncodedUsernamePassword = authorizationHeader
                    .Split(' ')[1];
                
                Console.WriteLine(
                    $"base64EncodedUsernamePassword = {base64EncodedUsernamePassword}");
                
                // декодируем параметры
                var usernamePasswordString = Encoding.UTF8.GetString(
                    Convert.FromBase64String(base64EncodedUsernamePassword));

                Console.WriteLine(
                    $"usernamePasswordString = {usernamePasswordString}");
                
                // разбиваем строку на логин и пароль
                var usernamePasswordArr = usernamePasswordString.Split(':');

                // Тут логин/пароль прибиты гвоздями, 
                // но в реальном приложении надо 
                // считывать из таблицы пользователей
                if (
                    usernamePasswordArr[0] == "admin" && 
                    usernamePasswordArr[1] == "password")
                {
                    // тут какая-то химия от мелкософта
                    var claims = new[] {
                        new Claim(
                            ClaimTypes.NameIdentifier, 
                            usernamePasswordArr[0]),
                        new Claim(
                            ClaimTypes.Name, 
                            usernamePasswordArr[0])
                    };

                    var identity = new ClaimsIdentity(
                        claims, Scheme.Name);

                    var principal = new ClaimsPrincipal(identity);

                    var ticket = new AuthenticationTicket(
                        principal, Scheme.Name);

                    // успешная авторизация
                    return Task.FromResult(
                        AuthenticateResult.Success(ticket));
                }

                // логин/пароль не совпали
                return Task.FromResult(
                    AuthenticateResult.Fail("Invalid username or password"));
            }
            catch
            {
                // при любых ошибках разбора тоже ошибка
                return Task.FromResult(
                    AuthenticateResult.Fail("Invalid Authorization header"));
            }
        }
    }
    ```    

1. В основном файле (`Program.cs`) добавьте сервисы аутентификации и авторизации и подключите авторизацию к *конечным точкам*:

    ```cs
    var builder = WebApplication.CreateBuilder(args);

    // добавляем метод аутентификации "Basic"
    // и задаём обработчиком созданный ранее класс
    builder.Services.AddAuthentication("Basic")
        .AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("Basic", options => { });

    // это скопировано как есть из интернета
    builder.Services.AddAuthorization(options =>
    {
        options.FallbackPolicy = new AuthorizationPolicyBuilder()
            .RequireAuthenticatedUser().Build();
    });

    var app = builder.Build();

    // включаем авторизацию и аутентификацию
    app.UseAuthentication();
    app.UseAuthorization();

    // к конечным точкам дописываем RequireAuthorization 
    // или AllowAnonimous
    app.MapGet("/", () => "Hello World!")
        .RequireAuthorization();
    ```    
В **Visual Studio Code** есть плагин _REST Client_, в нём запрос выглядит так:

```http
GET http://localhost:8080/product
Authorization: Basic admin:password
```

т.е. можно логин и пароль писать "как есть".

В **Visual Studio** так не работает, необходимо упаковать эти параметры в base64 (можно использовать онлайн-конвертеры)

```http
GET http://localhost:8080/product
Authorization: Basic YWRtaW46cGFzc3dvcmQ=
```

В логах сервера видно как выковыриваются данные для авторизации:

```
authorizationHeader = Basic YWRtaW46cGFzc3dvcmQ=
base64EncodedUsernamePassword = YWRtaW46cGFzc3dvcmQ=
usernamePasswordString = admin:password
```

Всё работает, можете использовать в своих проектах.

---

Предыдущая лекция |  | Следующая лекция
:----------------:|:----------:|:----------------:
[API. REST API. Создание сервера ASP.NET Core. Swagger.](./api_asp_net_core.md) | [Содержание](../readme.md#разработка-своего-api) | [HTTP запросы в C#. Получение списка материалов выбранного продукта](./cs_http.md)
