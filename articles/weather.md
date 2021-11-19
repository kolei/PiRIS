<table style="width: 100%;"><tr><td style="width: 40%;">
<a href="../articles/themes.md">Стили и темы. Ресурсы. Фигуры. Обработчики событий.
</a></td><td style="width: 20%;">
<a href="../readme.md">Содержание
</a></td><td style="width: 40%;">
<a href="../articles/weather2.md">Проект погода (продолжение): SplashScreen (заставка). Выбор города. Выбор и отображение массива значений (почасовая, ежедневная)
</a></td><tr></table>

# Проект погода (начало): геолокация, http(s)-запросы, разбор json, ImageView.

На примере "Калькулятора" мы познакомились с интерфейсом *Android Studio*, более-менее разобрались со структурой проекта андроид.

На примере проекта "Погода" мы научимся:

* [определять текущую позицию](#геолокация)
* [запрашивать данные о погоде](#получение-информации-о-погоде)
* [разбирать полученные данные (json)](#разбор-json)
* [отображать полученные данные (тут добавится новый визуальный элемент - **ImageView**)](#отображение-иконки)
* выбор города из списка и получение погоды для выбранного города (во второй части)
* получение погоды за несколько дней и вывод списка погодных данных (во второй части)

Создайте новый проект

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

Для получения информации о погоде воспользуемся открытым АПИ [openweathermap](https://openweathermap.org/api)

В АПИ есть несколько вариантов: текущая погода, почасовая, на несколько дней, на месяц...

Для начала получим данные о [текущей](https://openweathermap.org/current) погоде по координатам (By geographic coordinates)

Базовый формат выглядит так:

```
api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
```

Координаты мы уже получили в предыдущем разделе, **API key** можно получить зарегистрировавшись на сайте, но можно воспользоваться моим (увидите в коде)

Дополнительно можно указать:

* **mode** - формат ответа (**json** или **xml**, **json** установлен по-умолчанию, поэтому этот параметр не трогаем)

* **units** - единицы измерения, нам нужны метрические, поэтому этот паарметр используем

* **lang** - Язык ответа. По умолчанию английский, поэтому тоже используем

В итоге получается такой URL:

```
https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${token}&lang=ru
```

Проверить правильность запроса и посмотреть на результат можно запустив этот URL в **Postman**-е (он будет на демо-экзамене). Но лично мне больше нравится плагин **REST Client** для **VSCode**

Можно описать переменные и запрос в отдельном файле (api.http) и выполнять запросы прямо из **VSCode**

```
@lat=56.638372
@lon=47.892991
@token=d4c9eea0d00fb43230b479793d6aa78f

# Запрос текущей погоды
GET https://api.openweathermap.org/data/2.5/weather?lat={{lat}}&lon={{lon}}&units=metric&appid={{token}}&lang=ru
```

В ответ на этот запрос должно прийти что-то подобное

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

Для http-запросов в Андроиде есть встроенный клиент. Он сильно устарел и вообще монстрообразный, в реальной разработке обычно используют библиотеки типа **okhttp**. Но т.к. на демо-экзамене не будет доступа в интернет, то придется использовать то что есть.

Я нашел и адаптировал для вас синглтон (объект), для запросов. Лежит он в [каталоге](../shpora/HttpHelper.kt) `shpora` этого репозитория (тут я текст не привожу, т.к. он ещё не до конца отлажен). Его же я положу и в публичный репозиторий админа на демо-экзамене.

Создайте у себя в проекте аналогичный файл, **обратите вснимание** на комментарии - в манифест надо добавить разрешения для работы с интернетом.

Итак, в методе *onGetCoordinates* вместо вывода координат на экран вставьте http-запрос:

>Токен объявите переменной в начале класса
>```kt
>private val token = "d4c9eea0d00fb43230b479793d6aa78f"
>```


```kt
val url = "https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${token}&lang=RU"
HTTP.requestGET(url) {result, error ->
    if(result != null) {
        val json = JSONObject(result)
        val wheather = json.getJSONArray("weather")
        val icoName = wheather.getJSONObject(0).getString("icon")

        runOnUiThread {
            textView.text = json.getString("name")
        }
    }
}
```

Что здесь происходит?

**Во-первых**, андроид не разрешает запускать http-запросы из основного потока. Их нужно заворачивать в потоки или корутины. Я заворачитваю запрос в поток, т.к. для поддержки корутин нужно добавлять библиотеку, вам дополнительно с потоками разбираться не нужно. 

```kt
fun requestGET(
    r_url: String, 
    callback: (result: String?, error: String)->Unit
){
    Thread( Runnable {
        var error = ""
        var result: String? = null
        try {
            ...
        }
        catch (e: Exception){
            error = e.message.toString()
        }

        callback.invoke(result, error)
    }).start()
}
```

Функция принимает на вход URL, с которого нужно получить данные и callback-функцию в виде лямбда-выражения, которая возвращает текст ответа типа **String?** (нуллабельная строка, т.е. при ошибке вернет **null**) и текст ошибки. 

Но в коде главного окна вызов этой функции выглядит иначе - один параметр и какой-то блок кода за функцией

```kt
HTTP.requestGET(url) {result, error ->
    //
}
```

Это фича котлина. Если лямбда выражение объявлено последним параметром функции, то его можно вынести за скобки. В принципе более привычный аналог выглядит так

```kt
HTTP.requestGET(url, {result, error ->
    //
})
```

Но вы должны знать о такой фиче, т.к. она достаточно часто используется.

После разбора принятых данных их обычно выводят на экран. Тут надо учитывать что наша функция обратного вызова всё ещё находится в потоке, а к визуальным элементам можно обращаться только из основного потока. Для работы с визуальными элементами заворачиваем кусок кода в конструкцию:

```kt
runOnUiThread {
    textView.text = json.getString("name")
}
```

Тут я вывел на экран название города (разбор JSON будет ниже)

## Разбор JSON

Мы получили результат в виде строки, теперь нужно преобразовать её в JSON-объект и достать нужные нам данные

Для преобразования строки в JSON-объект используется конструктор JSONObject

```kt
val json = JSONObject(result)
```

Теперь в переменной json у нас экземпляр JSON-объекта

Для получения данных из JSON-объекта есть get методы

* **getJSONArray** - получить массив
* **getJSONObject** - получение объекта (по индексу из из массива или по имени из объекта)
* **getString** - получить строку

Также есть **getInt**, **getDouble**..., доступные методы будут видны в контекстном меню.

Из полученного объекта (листинг был выше) нам нужны:

* название иконки погоды: weather[0].icon
* описание погоды: weather[0].description
* температура: main.temp
* влажность: main.humidity
* скорость (wind.speed) и направление (wind.deg) ветра
* название населенного пункта: name

Приведу несколько примеров

```kt
val json = JSONObject(result)

// получение массива
val wheather = json.getJSONArray("weather")

// извлечение строки из первого элемента массива  
val icoName = wheather.getJSONObject(0).getString("icon")

// извлечение числа из объекта
val temp = json.getJSONObject("main").getDouble("temp")
```

## Отображение иконки

В разметку главного окна добавьте элемент **ImageView**

```xml
<ImageView
    android:id="@+id/ico"
    android:layout_width="100dp"
    android:layout_height="100dp"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintTop_toTopOf="parent"
    />
```

Для программного отображения изображения нужно вызвать метод **setImageBitmap(Bitmap)**

Но сам **Bitmap** нам ещё нужно получить из интернета.

В JSON-ответе название иконки погоды находится в массиве погоды. Я его доставал в примере выше (переменная icoName)

Урл иконки выглядит так

```
https://openweathermap.org/img/w/${icoName}.png
```

И в моей библиотеке есть отдельный метод для загрузки картинок

```
fun getImage(url: String, callback: (result: Bitmap?, error: String)->Unit)
```

Первый параметр URL изображения, второй лямбда выражение для функции обратного вызова, которое возвращает Bitmap или ошибку

Вызов этого метода можно вставить в предыдущий callback

```kt
...
runOnUiThread {
    textView.text = json.getString("name")
}

HTTP.getImage("https://openweathermap.org/img/w/${icoName}.png") { bitmap, error ->
    if (bitmap != null) {
        var imageView = findViewById<ImageView>(R.id.ico)
        runOnUiThread {
            imageView.setImageBitmap(bitmap)
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
