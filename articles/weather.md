<table style="width: 100%;"><tr><td style="width: 40%;">
<a href="../articles/themes.md">Стили и темы. Ресурсы. Фигуры. Обработчики событий.
</a></td><td style="width: 20%;">
<a href="../readme.md">Содержание
</a></td><td style="width: 40%;">
<a href="../articles/weather2.md">Проект погода (продолжение): SplashScreen (заставка). Выбор города. Выбор и отображение массива значений (почасовая, ежедневная)
</a></td><tr></table>

# Проект погода (начало): геолокация, http(s)-запросы, разбор json, ImageView.

На примере проекта *Калькулятор* мы познакомились с интерфейсом **Android Studio**, более-менее разобрались со структурой проекта андроид.

На примере проекта "Погода" мы научимся:

* [определять текущую позицию](#геолокация)
* [запрашивать данные о погоде](#получение-информации-о-погоде)
* [разбирать полученные данные (json)](#разбор-json)
* [отображать полученные данные (тут добавится новый визуальный элемент - **ImageView**)](#отображение-иконки)
* выбор города из списка и получение погоды для выбранного города (во второй части)
* получение погоды за несколько дней и вывод списка погодных данных (во второй части)

**Создайте новый проект**

>Если ругается на несовместимость версии, то попробуйте откатить версии зависимостей:
>
>```
>dependencies {
>    implementation 'androidx.core:core-ktx:1.3.2'
>    implementation 'androidx.appcompat:appcompat:1.2.0'
>    implementation 'com.google.android.material:material:1.3.0'
>    implementation 'androidx.constraintlayout:constraintlayout:2.0.4'
>    implementation 'com.google.android.gms:play-services-location:17.0.0'
>}
>```

## Геолокация

Последнее время Google сильно закрутили гайки. Мало того, что есть список разрешений в манифесте, но для использования геолокации мы должны ещё явно запросить разрешение у пользователя.

Итак, **первым делом** в манифест добавляем разрешения для геолокации (прямо в теге **manifest**):

```
<uses-permission 
    android:name="android.permission.ACCESS_FINE_LOCATION" />

<uses-permission 
    android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

**Затем** в классе главного окна объявляем переменные *fusedLocationClient* и *mLocationRequest*:

```kt
class MainActivity : AppCompatActivity() {
    // не в каком-то методе, а прямо в классе
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var mLocationRequest: LocationRequest
```

В конструкторе главного окна инициализируем *fusedLocationClient* и проверяем разрешение на геолокацию (метод *checkPermission*, реализация будет ниже):

```kt
fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
checkPermission()
```

Реализуем метод *checkPermission*:

```kt
private fun checkPermission(){
    if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
        ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED)
    {
        // нет разрешений - запрашиваем
        val permissions = arrayOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
        )
        ActivityCompat.requestPermissions(this, permissions, 0)
    } else {
        // есть разрешения - запускаем периодический опрос геолокации
        mLocationRequest = LocationRequest()
        mLocationRequest.interval = 10000
        mLocationRequest.fastestInterval = 1000
        mLocationRequest.priority = LocationRequest.PRIORITY_HIGH_ACCURACY

        fusedLocationClient.requestLocationUpdates(mLocationRequest, mLocationCallback, Looper.myLooper())
    }
}

// этот метод будет вызван, когда пользователь разрешит геолокацию
// в нём мы снова вызываем метод checkPermission
override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<String>,
                                                grantResults: IntArray) {
    when (requestCode) {
        1 -> {
            if (grantResults.isNotEmpty() && grantResults[0] ==
                PackageManager.PERMISSION_GRANTED) {
                if ((ContextCompat.checkSelfPermission(this@MainActivity, Manifest.permission.ACCESS_FINE_LOCATION) === PackageManager.PERMISSION_GRANTED))
                {
                    checkPermission()
                }
            } else {
                Toast.makeText(this, "Permission Denied", Toast.LENGTH_SHORT).show()
            }
            return
        }
    }
}


// этот метод будет вызван, когда клиент геолокации получит координаты
private var mLocationCallback: LocationCallback = object : LocationCallback() {
    override fun onLocationResult(locationResult: LocationResult) {
        if (locationResult.locations.isNotEmpty()) {
            val locIndex = locationResult.locations.size - 1
            val lon = locationResult.locations[locIndex].longitude
            val lat = locationResult.locations[locIndex].latitude
            onGetCoordinates(lat, lon)
        }
    }
}
```

И, наконец, реализуем метод получения координат:

```kt
fun onGetCoordinates(lat: Double, lon: Double){
    // первым делом останавливаем опрос
    fusedLocationClient.removeLocationUpdates(mLocationCallback)
    // пока просто выводим координаты на экран
    Toast.makeText(this, "${lat}, ${lon}", Toast.LENGTH_LONG).show()
}
```

При первом запуске приложение запросит у нас разрешение на доступ к геолокации

![](../img/04031.png)

>Позже я постараюсь завернуть весь этот ужас в отдельный класс.

## Получение информации о погоде

[Раздел из ПМ 05.01 про HTTP](api_php.md)

Для получения информации о погоде воспользуемся открытым АПИ [openweathermap](https://openweathermap.org/api)

В АПИ есть несколько вариантов: текущая погода, почасовая, на несколько дней, на месяц... Но для бесплатного использования подходят не все.

Для начала получим данные о [текущей](https://openweathermap.org/current) погоде по координатам (By geographic coordinates)

Формат запроса:

```
api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
```

Координаты мы уже получили в предыдущем разделе, **API key** можно получить зарегистрировавшись на сайте, но можно воспользоваться моим (увидите в коде)

Дополнительно можно указать:

* **mode** - формат ответа (**json** или **xml**, **json** установлен по-умолчанию, поэтому этот параметр не трогаем)

* **units** - единицы измерения, нам нужны метрические, поэтому этот паарметр используем

* **lang** - Язык ответа. По умолчанию английский, поэтому тоже используем

В итоге получается такой URL:

```kt
val url = "https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${token}&lang=ru"
```

Проверить правильность запроса и посмотреть на результат можно запустив этот URL в **Postman**-е (он будет на демо-экзамене). Но лично мне больше нравится плагин **REST Client** для **VSCode**

Можно описать переменные и запрос в отдельном файле (например, `api.http`) и выполнять запросы прямо из **VSCode**

```
@lat=56.638372
@lon=47.892991
@token=d4c9eea0d00fb43230b479793d6aa78f

### Запрос текущей погоды
GET https://api.openweathermap.org/data/2.5/weather?lat={{lat}}&lon={{lon}}&units=metric&appid={{token}}&lang=ru
```

В ответ на этот запрос должно прийти что-то подобное:

```json
{
  "coord": {
    "lon": 47.893,
    "lat": 56.6384
  },
  "weather": [
    {
      "id": 802,
      "main": "Clouds",
      "description": "переменная облачность",
      "icon": "03n"
    }
  ],
  "base": "stations",
  "main": {
    "temp": -6.58,
    "feels_like": -10.63,
    "temp_min": -6.58,
    "temp_max": -6.58,
    "pressure": 1030,
    "humidity": 65,
    "sea_level": 1030,
    "grnd_level": 1018
  },
  "visibility": 10000,
  "wind": {
    "speed": 2.36,
    "deg": 236,
    "gust": 6.21
  },
  "clouds": {
    "all": 33
  },
  "dt": 1636565376,
  "sys": {
    "type": 1,
    "id": 9042,
    "country": "RU",
    "sunrise": 1636517829,
    "sunset": 1636548458
  },
  "timezone": 10800,
  "id": 466806,
  "name": "Йошкар-Ола",
  "cod": 200
}
```

В **Android**-е есть встроенные функции работы с **http**-запросами, но стандартный код для сетевых запросов сложен, излишен и в реальном мире почти не используется. Используются библиотеки. Самые популярные: [OkHttp](https://square.github.io/okhttp/) и Retrofit.

Рассмотрим работу к **OkHttp**

>[Примеры синхронных и асинхронных запросов на котлине](https://square.github.io/okhttp/recipes/)

Перед использованием не забудьте добавить в манифест разрешение на работу с интернетом

```
<uses-permission android:name="android.permission.INTERNET" />
```

И, если на сайте нет сертификата, атрибут в тег **application**:

```
android:usesCleartextTraffic="true"
```

Ещё в зависимости проекта нужно добавить билиотеку (в файл `build.gradle(:app)` в раздел *dependencies*):

```
implementation 'com.squareup.okhttp3:okhttp:4.10.0'
```

>Токен объявите константой в свойствах класса
>```kt
>private val appid = "d4c9eea0d00fb43230b479793d6aa78f"
>```

Итак, в методе *onGetCoordinates* вместо вывода координат на экран вставьте http-запрос:

>Неизвестные методы **Android Studio** показывает красным цветом. Чтобы добавить пакет, в котором описан такой метод, нужно поместить курсор на этот метод и, либо через контекстное меню, либо нажатием **Alt+Enter** добавить пакет в импортируемые (если вариантов импорта несколько, то смотрите по контексту - в нашем случае в названии пакета должно быть что-то про **okhttp**)

В примерах из [OkHttp](https://square.github.io/okhttp/) нет обработки исключительных ситуаций, я написал метод, который принимает на вход строку **url** или готовый **Request** и возвращает callback с ответом или исключением (если связи физически нет):

```kt
// в классе объявите свойство client
private val client = OkHttpClient()

fun httpGet(
    url: Any, // тип Any - тут может быть строка для GET запроса, или готовый Request
    callback: (response: Response?, error: Exception?)->Unit
) {
    var request: Request = when (url) {
        is String -> Request.Builder()
            .url(url)
            .build()
        is Request -> url as Request
        else -> {
            callback.invoke(null, Exception("Не верный тип параметра \"url\""))
            return
        }
    }
    client.newCall(request).enqueue(object : Callback {
        override fun onFailure(call: Call, e: IOException) {
            callback.invoke(null, Exception(e.message!!))
        }

        override fun onResponse(call: Call, response: Response) {
            response.use {
                callback.invoke(response, null)
            }
        }
    })
}
```

Как выглядит вызов этого метода:

```kt
fun onGetCoordinates(lat: Double, lon: Double){
    ...

    httpGet("https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appid}&lang=ru&units=metric")
    {response, error ->
        try {
            // если в запросе получено исключение, то "выбрасываем" его
            if (error != null) throw error

            // если ответ получен, но код не 200, то тоже "выбрасываем" исключение
            if (!response!!.isSuccessful) throw Exception(response.message)

            // начинаем обработку ответа    

            val json = JSONObject(response.body!!.string())

            // обращение к UI должно быть в контексте UiThread
            runOnUiThread {
                textView.text = json.getString("name")
            }
        } catch (e: Exception) {
            // любую ошибку показываем на экране
            runOnUiThread {
                AlertDialog.Builder(this)
                    .setTitle("Ошибка")
                    .setMessage(e.message)
                    .setPositiveButton("OK", null)
                    .create()
                    .show()
            }
        }
    }
}
```

Что здесь происходит?

**Во-первых**, андроид не разрешает запускать http(s)-запросы из основного потока. Их нужно запускать асинхронно. В **OkHttp** это делает метод **enqueue**.

В параметрах метода указывается *callback*-функция в виде лямбда-выражения, в котором должны быть реализованы методы для успешного и неуспешного запросов (тут нужно учитывать, что успех или не успех относятся к транспортному уровню, смог **OkHttp** получить ответ сервера или нет). 

После разбора принятых данных их обычно выводят на экран. Тут надо учитывать что функция обратного вызова всё ещё находится в потоке, а к визуальным элементам можно обращаться только из основного потока. Для работы с визуальными элементами заворачиваем кусок кода в конструкцию:

```kt
runOnUiThread {
    textView.text = json.getString("name")
}
```

Тут я вывел на экран только название города (разбор JSON будет ниже)

## Разбор JSON

Мы получили результат в виде JSON-строки, теперь нужно преобразовать её в JSON-объект и достать нужные нам данные

Для преобразования строки в JSON-объект используется конструктор JSONObject

```kt
val json = JSONObject(someJsonString)
```

Теперь в переменной json у нас экземпляр JSON-объекта

Для получения данных из JSON-объекта есть get методы

* **getJSONArray** - получить массив
* **getJSONObject** - получение объекта (по индексу из массива или по имени из объекта)
* **getString** - получить строку

Также есть **getInt**, **getDouble**..., доступные методы будут видны в контекстном меню.

Из полученного объекта (листинг был выше) нам нужны (эти данные вы будете выводить на экран по итогам этой лекции):

* название иконки погоды: **weather[0].icon**
* описание погоды: **weather[0].description**
* температура: **main.temp**
* влажность: **main.humidity**
* скорость (**wind.speed**) и направление (**wind.deg**) ветра
* название населенного пункта: **name**

Приведу несколько примеров

```kt
val json = JSONObject(response.body!!.string())

// получение массива
val wheather = json.getJSONArray("weather")

// извлечение строки из первого элемента массива  
val icoName = wheather.getJSONObject(0).getString("icon")

// извлечение числа из объекта
val temp = json.getJSONObject("main").getDouble("temp")
```

## Отображение иконки

В разметку окна добавьте элемент **ImageView**

```xml
<ImageView
    android:id="@+id/ico"
    android:layout_width="100dp"
    android:layout_height="100dp"
/>
```

Для программного отображения изображения нужно вызвать метод **setImageBitmap(Bitmap)**

Но сам **Bitmap** нам ещё нужно получить из интернета.

В JSON-ответе название иконки погоды находится в массиве погоды. Я его доставал в примере выше (переменная icoName)

Урл иконки выглядит так (описано в АПИ):

```kt
val icoUrl = "https://openweathermap.org/img/w/${icoName}.png"
```

Для загрузки картинок воспользуемся тем же методом **httpGet**:

>Вызов этого метода нужно вставить в предыдущий callback

```kt
...
runOnUiThread {
    textView.text = json.getString("name")
}

httpGet("https://openweathermap.org/img/w/${icoName}.png")
{response, error ->
    try {
        // если в запросе получено исключение, то "выбрасываем" его
        if (error != null) throw error

        // если ответ получен, но код не 200, то тоже "выбрасываем" исключение
        if (!response!!.isSuccessful) throw Exception(response.message)

        runOnUiThread {
            ico.setImageBitmap(
                BitmapFactory
                    .decodeStream(
                        response.body!!.byteStream()
                    )
            )
        }

    } catch (e: Exception) {
        // любую ошибку показываем на экране
        runOnUiThread {
            AlertDialog.Builder(this)
                .setTitle("Ошибка")
                .setMessage(e.message)
                .setPositiveButton("OK", null)
                .create()
                .show()
        }
    }
}
```

# Задание

Разобрать все перечисленные выше параметры погоды и вывести их на экран

<table style="width: 100%;"><tr><td style="width: 40%;">
<a href="../articles/themes.md">Стили и темы. Ресурсы. Фигуры. Обработчики событий.
</a></td><td style="width: 20%;">
<a href="../readme.md">Содержание
</a></td><td style="width: 40%;">
<a href="../articles/weather2.md">Проект погода (продолжение): SplashScreen (заставка). Выбор города. Выбор и отображение массива значений (почасовая, ежедневная)
</a></td><tr></table>
