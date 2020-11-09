[содержание](/readme.md)

https://startandroid.ru/ru/uroki/vse-uroki-spiskom.html

1. [Установка Android Studio](#Установка-Android-Studio)
2. [Создание нового проекта](#Создание-нового-проекта)
3. [Знакомство с интерфейсом Android Studio](#Знакомство-с-интерфейсом-Android-Studio)
4. [Добавление кнопки и обработчика события onClick для нее](#Добавление-кнопки-и-обработчика-события-onClick-для-нее)
5. [Проект "калькулятор"](#Проект-калькулятор)
6. [Проект "Погода"](#Проект-Погода)

    * [Получение текущей локации](#Получение-текущей-локации)
    * [Http запросы](#Http-запросы)
    * [Вывод иконки погоды](#Вывод-иконки-погоды)
    * [Splash screen](#Splash-screen)
    * [Получение массива данных (данные о погоде за несколько дней)](#Получение-массива-данных-данные-о-погоде-за-несколько-дней)
    * [Создание дополнительной формы (список городов)](#Создание-дополнительной-формы-список-городов)

7. [Проект "Достопримечательности"](#Проект-Достопримечательности)
    * [Авторизация на сервере](#Авторизация-на-сервере)
    * [Создание приложения с Google Maps](#Создание-приложения-с-Google-Maps)

8. [Тестовый локальный сервер](#Тестовый-локальный-сервер)

9. [Проект "Погода" для электронных часов (Wear OS)](#Проект-Погода-для-электронных-часов-Wear-OS)

# Установка Android Studio

> Внешний вид Android Studio может измениться в следующих версиях, методичка написана на основе версии 3.5 (Windows)

1. [Скачать дистрибутив (версия ОС определяется автоматически)](https://developer.android.com/studio/)

2. Установить Android Studio (все настройки по-умолчанию)

3. Установить эмулятор

    * откройте AVD Manager 
    ![запуск AVD manager](/img/as003.png)

    * кликните "Create Virtual Device"
    ![создание эмулятора](/img/as004.png)

    * выберите устройство
    ![](/img/as005.png)

    * скачайте образ (у меня уже скачан для Q) и нажмите "Next"
    ![](/img/as006.png)


# Создание нового проекта

1. Создайте новый проект (File - New - New Project...)
![создание нового проекта](/img/as007.png)    

2. Выберите "Empty Activity"
![создание нового проекта](/img/as001.png)    

3. Задайте название (Name) и местоположение (Save location) проекта. Остальные настройки по-умолчанию
![настройка проекта](/img/as002.png)


# Знакомство с интерфейсом Android Studio

1. В панели "Project" отображается структура нашего проекта:
![знакомство с интерфейсом](/img/as008.png)

    * внешний вид описывается в activity_main.xml, который расположен в app/res/layout

    * программный код (MainActivity) для этого *activity* расположен в app/java/com.example.test1, где "com.example.test1" название пакета

    * в центральном окне открыты закладки для activity_main и MainActivity

    * в режиме **Design** на закладке activity_main отображается внешний вид выбранного экрана, палитра компонентов (с нее можно перетаскивать компоненты на форму) и аттрибуты выбранного компонента (в нашем случае TextView)

    * на закладке MainActivity отображается код приложения
    ![знакомство с интерфейсом](/img/as009.png)
    <br/>, где
        * super.onCreate(savedInstanceState) - вызов конструктора базового класса
        * setContentView(R.layout.activity_main) - инициализация activity

# Добавление кнопки и обработчика события onClick для нее

1. С панели перетаскиваем объект "Button" на форму
![добавление кнопки](/img/as010.png)  
При добавлении компонента на форму система выдает предупреждение, что нет привязок по горизонтали и вертикали - если их не задать, то все компоненты будут иметь координаты 0,0 и будут отрисовываться в левом верхнем углу. Чтобы этого не происходило нужно добавить привязку либо к сторонам формы, либо к соседним объектам. (Привязка нужна по *горизонтали* и *вертикали*, т.е. не обязательно делать все четыре привязки, достаточно двух)
![добавление кнопки](/img/as013.png)  
Привязку можно задать либо на самом объекте  
![добавление кнопки](/img/as014.png)    
либо в аттрибутах  
![добавление кнопки](/img/as015.png)    

2. Для объекта можно поменять цвет фона, цвет и стиль текста  
![добавление кнопки](/img/as016.png)    

3. В свойствах кнопки заполняем поле id. **Идентификатор визуального компонента одновременно является названием объекта в коде, поэтому в названии можно использовать только буквы, цифры и знак "_".** Я назвал кнопку *btn_one*.

4. Переходим на закладку "MainActivity.kt" и набираем первые буквы id кнопки
![добавление кнопки](/img/as011.png), 
<br/>выбираем полное имя из подсказки - Android Studio автоматически добавит в импорт все объекты нашей формы, т.о. мы можем обращаться к объекту не объявляя его явно<br/>
![добавление кнопки](/img/as012.png)<br/>
    > В jave для создания ссылки на объект нужно было использовать функцию 
    >```java
    >val btn_one = findViewById(R.id.btn_one)
    >```

5. Создаем обработчик на событие "click". Обработчик (слушатель) событий назначается с помощью метода setOnClickListener. Есть несколько вариантов его использования:<br/>
    
    * первый вариант: обработчик пишется прямо в месте объявления (в конструкторе формы), подходит для мелких действий
    ```kt
    btn_one.setOnClickListener {
        textView.text="hello"
    }
    ```

    * второй вариант: создается функция обработчик

    ```java
    ...
    btn_one.setOnClickListener(this::onClick)
    ...
    
    fun onClick(view: View){
        textView.text = "hello"
    }
    ```

    * третий вариант: добавить форме интерфейс "View.OnClickListener" и реализовать событие "onClick"
    ```java
    class MainActivity : AppCompatActivity(), View.OnClickListener {
        override fun onClick(v: View?) {
            textView.text = "hello"
        }

        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            setContentView(R.layout.activity_main)

            btn_one.setOnClickListener(this)
        }
    }
    ```
    Можно один и тот же обработчик событий назначить нескольким объектам

    ```java
        btn_one.setOnClickListener(this)
        btn_two.setOnClickListener(this)
    ```

    * четвертый вариант: в коде создать функцию обработчик и в аттрибутах кнопки свойству "onClick" присвоить эту функцию:
    ```java
    fun onClick(v: View) {
        var tmp = textView.text.toString()
        // when - это аналог switch
        when(v.id) {
            //R.id.btn_one - идентификатор кнопки
            R.id.btn_one -> textView.text = tmp+'1'
            R.id.btn_bs->{
                if(tmp.isNotEmpty()) {
                    textView.text = tmp.take(tmp.length-1)
                }
            }
        }
    }
    ```
    ![](/img/as017.png)

# Проект **калькулятор**

1. Установите, если еще нет, Adobe XD https://www.adobe.com/ru/products/xd.html

2. Склонируйте (или скачайте) дизайн калькулятора https://github.com/kolei/wsr-calc

3. Реализуйте дизайн в Android Studio (максимально близко к дизайну расположить и раскрасить компоненты: текст и кнопки) и напишите логику (обработчики нажатий на все кнопки)

## Оптимизация размещения кнопок

Позиционировать каждую кнопку нудно и дизайн получается девайсо-зависимым

Попробуем "резиновую" верстку с помощью LinearLyout

1. Очистим Activity от всех компонентов, поместим на форму LinearLayout (vertical)
![](/img/as019.png)  
и "привяжем" к краям родителя

2. Поместим на форму TextView для дисплея калькулятора - ширина компонента автоматически выравнивается по родительскому LinearLayout, высоту задаим позже

3. Поместим на форму LinearLayout (horizontal)
![](/img/as020.png)  
высоту зададим как у кнопки из дизайна

4. поместим в этот контейнер кнопку
![](/img/as021.png)  
и установим layout_height = match_parent  
после этого скопируем кнопку и вставим 3 копии  
![](/img/as022.png)  

5. повторим пп 3-4 для всех рядов кнопок калькулятора

6. Высоту TextView подгоним так, чтобы был заполнен весь Activity


## Конкатенация строк

Вообще строки склеиваются знаком "+", но свойство text объекта textView имеет тип CharSequence и конкатенацию не поддерживает, приходится делать двойное преобразование:

```java
btn_one.setOnClickListener{
    // объявляем временную строковую переменную
    var tmp = textView.text.toString()
    textView.text = tmp+'1'
}
```

## Удаление последнего символа

Есть несколько методов для получения подстроки, например, **take** возвращает первые **n** символов строки:

```java
btn_bs.setOnClickListener {
    if(textView.text.length>0)
        textView.text = textView.text.take(textView.text.length-1)
}
```

> Котлин компилируемый язык, в Android Studio не удобно проверять как будет работать какая-то функция. Для проверки можно использовать онлайн "проигрыватель" https://play.kotlinlang.org/


## Добавление альбомной ориентации

В режиме "design" кликаем кнопку "Orientation..." выбираем "Create Landscape Variation"    
![](/img/as023.png)

Система автоматически создаст Layout с альбомной ориентацией.   
![](/img/as024.png)

> Учитывайте, что конструктор общий для всех ориентаций - при обращении к несуществующему объекту произойдет исключение. Что-бы этого не происходило, нужно либо обработчики событий для кнопок оформить отдельными функциями, либо проверять наличие объекта кнопки перед вызовом ``setOnClickListener``



# Проект **Погода**

Цели:
* получить текущую локацию
* по сети получить погоду для текущей локации
* отобразить погоду на форме
* создание splash-screen
* создание дополнительных форм, переход между формами, обмен данными между формами

## Получение текущей локации

### Стандартные средства

[Тут](https://developers.google.com/android/reference/com/google/android/gms/location/package-summary) описаны стандартные интерфейсы для работы с геолокацией


[На основе этого примера можно посмотреть как это работает](https://en.proft.me/2019/01/3/how-get-location-latitude-longitude-android-kotlin/)

1. В манифест добавляем разрешения для работы с геолокацией  
```
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
```

![](/img/as025.png)


2. В build.graddle (Module: app) добавляем зависимость  
```
implementation 'com.google.android.gms:play-services-location:11.8.0'
```

![](/img/as026.png)


Полный текст программы:

```kt
package com.example.wheather

import android.Manifest
import android.app.AlertDialog
import android.content.pm.PackageManager
import android.location.Location
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {

    var fusedLocationClient: FusedLocationProviderClient? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // инициализируем объект
        fusedLocationClient = LocationServices.
            getFusedLocationProviderClient(this)

        // запрашиваем разрешение
        if (checkPermission(
            Manifest.permission.ACCESS_COARSE_LOCATION,
            Manifest.permission.ACCESS_FINE_LOCATION)) 
        {
            fusedLocationClient?.lastLocation?.
                addOnSuccessListener(this,
                    // Got last known location. In some rare
                    // situations this can be null.
                    {location : Location? ->
                        // полученные координаты выводим на экран
                        if(location == null) {
                            textView.text = "location == null"
                        } else location.apply {
                            textView.text = location.toString()
                        }
                    })
        }
    }

    private fun checkPermission(vararg perm:String) : Boolean {
        val PERMISSION_ID = 42

        val havePermissions = perm.toList().all {
            ContextCompat.checkSelfPermission(this,it) ==
                    PackageManager.PERMISSION_GRANTED
        }

        if (!havePermissions) {
            if(perm.toList().any {
                ActivityCompat.
                    shouldShowRequestPermissionRationale(this, it)
            }){
                val dialog = AlertDialog.Builder(this)
                    .setTitle("Permission")
                    .setMessage("Permission needed!")
                    .setPositiveButton("OK", {id, v ->
                        ActivityCompat.requestPermissions(
                            this, perm, PERMISSION_ID)
                    })
                    .setNegativeButton("No", {id, v -> })
                    .create()
                dialog.show()
            } else {
                ActivityCompat.requestPermissions(this, perm, PERMISSION_ID)
            }
            return false
        }
        return true
    }
}
```

### Сторонние библиотеки

В стандартной реализации, как обычно, слишком много букв, к счастью есть [библиотека](https://github.com/BirjuVachhani/locus-android), в которой вся рутина скрыта:

1. Добавляем репозиторий в build.graddle (Project)

```
maven { url 'https://jitpack.io' }
```

![](/img/as027.png)


2. Добавляем зависимости в build.graddle (Module app)

```
implementation 'com.google.android.gms:play-services-location:17.0.0'
implementation 'com.github.BirjuVachhani:locus-android:3.0.1'
```

![](/img/as028.png)


3. В конструктор добавляем запрос геолокации:

```kt
Locus.getCurrentLocation(this) { result ->
    result.location?.let {
        tv.text = "${it.latitude}, ${it.longitude}"
    } ?: run {
        tv.text = result.error?.message
    }
}
```


Полный текст программы:

```kt
package com.example.locator2

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.birjuvachhani.locus.Locus
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        Locus.getCurrentLocation(this) { result ->
            result.location?.let {
                tv.text = "${it.latitude}, ${it.longitude}"
            } ?: run {
                tv.text = result.error?.message
            }
        }

    }
}
```

## Http запросы

В Kotlin-е есть встроенные функции работы с http-запросами, но стандартный код для сетевых запросов сложен, излишен и в реальном мире почти не используется. Используются библиотеки. Самые популярные: [OkHttp](https://square.github.io/okhttp/) и Retrofit.

Рассмотрим работу к **OkHttp**

https://square.github.io/okhttp/recipes/ - примеры синхронных и асинхронных запросов на котлине

### Подключение библиотеки к проекту:
   
![](/img/as018.png)

1. На закладке **Project** в **Gradle Scripts** открываем файл **build.gradle (Module: app)**

2. В файле находим секцию **dependencies** (зависимости)

3. Добавляем нашу библиотеку ``implementation 'com.squareup.okhttp3:okhttp:4.2.1'``. На момент написания методички последняя версия была 4.2.1, вы можете уточнить актуальную версию на сайте.

4. Синхронизируйте измения (Gradle скачает обновившиеся зависимости)
    
5. В манифест добавляем права на доступ в интернет
```
<uses-permission android:name="android.permission.INTERNET" />
```    

6. В функцию определения координат вместо вывода координат на экран вставаляем вызов функции, запрашивающей погоду для этих координат


```kt
Locus.getCurrentLocation(this) { result ->
    result.location?.let {
        //tv.text = "${it.latitude}, ${it.longitude}"

        getWheather(it.longitude, it.latitude)

    } ?: run {
        tv.text = result.error?.message
    }
}
```

## Вывод иконки погоды

Для отображения иконки погоды используем компонент ImageView и библиотеку Glide. Для установки библиотеки:

    * добавить репозиторий mavenCentral() в build.graddle (Project)
    * добавить зависимость ``implementation 'com.github.bumptech.glide:glide:4.10.0'`` в build.graddle (Module)

Функция запроса погоды

```kt
// http клиент
private val client = OkHttpClient()

fun getWheather(lon: Double, lat: Double) {
    val token = "d4c9eea0d00fb43230b479793d6aa78f"
    val url = "https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${token}"

    val request = Request.Builder().url(url).build()

    client.newCall(request).enqueue(object : Callback {

        override fun onFailure(call: Call, e: IOException) {
            setText( e.toString() )
        }

        override fun onResponse(call: Call, response: Response) {
            response.use {
                if (!response.isSuccessful) throw IOException("Unexpected code $response")

                // так можно достать заголовки http-ответа
                //for ((name, value) in response.headers) {
                //  println("$name: $value")
                //}

                //строку преобразуем в JSON-объект
                var jsonObj = JSONObject(response.body!!.string())


                // обращение к визуальному объекту из потока может вызвать исключение
                // нужно присвоение делать в UI-потоке
                setText( jsonObj )
            }
        }
    })
}

fun setText(t: JSONObject){
    runOnUiThread { 
        // достаем из ответа сервера название иконки погоды
        val wheather = t.getJSONArray("weather")
        val icoName = wheather.getJSONObject(0).getString("icon")
        val icoUrl = "https://openweathermap.org/img/w/${icoName}.png"

        // аналогично достаньте значение температуры и выведите на экран

        // загружаем иконку и выводим ее на icon (ImageView)
        Glide.with(this).load( icoUrl ).into( icon )
    }
}

```

## Splash screen

Запрос данных может занять несколько секунд, чтобы пользователь не смотрел на пустую форму можно добавить загрузочный экран, который будет отображать какую-то картинку, пока данные не получены.

1. В каталог ``res/drawable`` положить картинку (с расширением png)
2. на форму кинуть ImageView, задать фоном загруженную картинку  и развернуть на весь экран
3. После отрисовки полученных данных скрыть картинку ``.isVisible = false``
4. Чтобы пользователь успел полюбоваться вашим Splash-скрином, можно сделать скрытие по таймеру:

```kt
// объявляем приватную переменую ``ready``, которая будет установлена при получении данных о погоде
private var ready = false

// и счетчик
private var couter = 0

...

// в конструктор добавляем счечик (маскимальное время ожидания, периодические события)
object : CountDownTimer(5000,1000){
    override fun onTick(millisUntilFinished: Long) {
        // если данные получены и прошло 3 сек, то скрываем splash screen и останавливаем счетчик
        counter++
        if(counter>3 && ready){
            splash_screen.isVisible = false
            this.cancel()
        }
    }

    override fun onFinish(){
        splash_screen.isVisible = false
    }
}.start()

...

Glide.with(this).load( icoUrl ).into(icon)

// в конце функции получения данных выставляем флаг готовности
ready = true

```

## Получение массива данных (данные о погоде за несколько дней)

Цели:

* работа с разными вариантами данных
* работа с циклами
* поиск визуального объекта по его ``id``

### Данные о погоде за 5 дней

Описание API находится [тут](https://openweathermap.org/forecast5)

### Работа с циклами

При получении данных за 5 дней API возвращает JSON-массив данных

```kt

...

var list = t.getJSONArray("list")

// объект JSONArray не реализует интерфейс Iterable, поэтому нужно обращаться к элементам массива по индексу
for(i in 0..list.length()-1){
    var item = list.getJSONObject(i)
    
    // дальше обрабатываем как обычно
    ...

}

```

### Поиск визуального объекта по его ``id``

Для отображения нескольких записей о погоде можно использовать два варианта: 

* в дизайнере создать n-визуальных объектов с ``id`` вида ``item_0``, ``item_1`` ..``item_(n-1)``. И потом при отрисовке получать ссылку на объект по его ``id``

> Для этого проекта не пригодилось, но для ознакомления оставлю  
>```kt
>val id = resources.
>    getIdentifier("item_${i}", "id ", getPackageName())
>
>if(id>0){
>    val cur_item = findViewById<TextView>(id)
>
>    cur_item.text = температура
>}
>```

* динамически создавать визуальные объекты для каждой записи о погоде

На этом варианте остановлюсь подробнее:

1. Добавляем на форму горизонтальный скролл и зададим id вложенному LinearLayout

![](/img/as029.png)

2. Добавим класс, потомок LinearLayout

![](/img/as030.png)

![](/img/as031.png)

```kt
class CustomLayout : LinearLayout {
    // описываем публичные аттрибуты для текста и картинки
    var tempTextView: TextView? = null
    var icoImageView: ImageView? = null

    // пишем конструктор
    constructor(context: Context?): super(context){
        this.orientation = LinearLayout.VERTICAL
        this.minimumWidth = 150

        // создаем TextView
        tempTextView = TextView(context)
        tempTextView!!.textAlignment = View.TEXT_ALIGNMENT_CENTER
        this.addView(tempTextView)

        // создаем ImageView
        icoImageView = ImageView(context)
        this.addView(icoImageView)

    }
}
```

Далее в основном коде в цикле обработки данных о погоде динамически создаем наш CustomLayout для каждого элемента и помещаем его в созданный скролл

```kt
for(i in 0..list.length()-1){
    val item = CustomLayout(this)
    if(item!=null) {
        container.addView(item)
        item.tempTextView!!.text = i.toString()
        Glide.with(this).load(icoUrl).into(item.icoImageView!!)
    }
}
```

## Создание дополнительной формы (список городов)

1. Создаем новую форму (Activity)

![Создаем новую форму](/img/as032.png)

![Задаем название](/img/as033.png)

2. На форму кидаем вертикальный LinearLayout, в него TextView и ListView. ListView обзываем как *cityList*

![Задаем название](/img/as035.png)


3. На основную форму добавляем кнопу перехода на экран выбора города и обработчик для нее:

```kt
selectCity.setOnClickListener {
    // при клике переходим на форму выбора города
    startActivity( Intent(this, CityListActivity::class.java) )
}
```

4. Класс CityListActivity

Подробнее см [тут](http://developer.alexanderklimov.ru/android/listactivity.php)

```kt
// создаем массив городов
private var names = arrayOf(
    "Moscow",
    "Yoshkar-Ola",
    "Kazan"
)
```

```kt
// в конструкторе создаем адаптер для списка городов
// где R.layout.city_list_item - название НОВОГО layout для элемента списка
cityList.adapter = ArrayAdapter(
    this,
    R.layout.city_list_item, names
)
```

Android Studio покажет ошибку, что не знает что такое ``city_list_item`` - добавляем реализацию:

![Создание Layout для элемента списка](/img/as036.png)

**Внимание!** RootElement поменять на TextView

![Создание Layout для элемента списка](/img/as037.png)

```kt
// создаем обработчик событий выбора элемента списка
cityList.setOnItemClickListener { parent, view, position, id ->
    val mainIntent = Intent(this, MainActivity::class.java)
    val cityName = names[id.toInt()]

    // запоминаем выбранное название города
    mainIntent.putExtra("city_name", cityName)

    // возвращаемся на основной экран (Activity)
    startActivity( mainIntent )
}
```

В MainActivity считываем название выбранного города

```kt
val cityName = intent.getStringExtra("city_name")
```

и делаем проверку, если город есть, то запрашиваем данные о погоде по названию города, если нет, то по старому варианту через определение координат

## Передача параметров в форму

```kt
// перед переходом в Activity можно передать параметры
val mainIntent = Intent(this, MainActivity::class.java)

val cityName = "Moscow"

mainIntent.putExtra("city_name", cityName)

startActivity( mainIntent )

...

// и в целевом активити, соответственно, извлечь эти данные
val newCityName = intent.getStringExtra("city_name")
```

## Хранение данных

Для хранения больших массивов данных нужно использовать SQLite или аналоги, но для простых приложений можно использовать *Preferences* - хранение пар *ключ* -> *значение*:

```kt
// аттрибут класса - массив городов - пустой массив
private var names = emptyArray<String>()


// запрашиваем приватное хранилище с названием "settings" (если нет, то создаст автоматически, количество хранилищ не ограничено)
val myPreferences = getSharedPreferences("settings", MODE_PRIVATE)

// запрашиваем из хранилища список городов (можно задать значение по-умолчанию)
// андроид не позволяет хранить массивы, поэтому список хранится как строка с разделителями
val oldCityListString = myPreferences.getString("cityList", "Moscow|Kazan|Yoshkar-Ola")

// заполняем массив городов
names = cityListString!!.split("|").toTypedArray()
```

Для записи данных в хранилище нужно создать объект "редактор" и после записи сохранить изменения:

```kt
val editor = myPreferences.edit()
try {
    editor.putString("cityList", oldCityListString+"|"+newCityName )
}finally {
    editor.commit()
}
```

## Контрольное задание по проекту **Погода**

Создать приложение состоящее из трех форм (Activity)

**Первый эркан**: "Заставка" (splash-screen). Показывать не менее 3-х секунд. Чтобы без толку не висело - в этом экране запрашиваем текущую локацию. Если координаты определены, то переходим на второй экран, если ошибка, то на третий

**Второй экран**: основная форма с показом погоды за текущий день и список за 5 дней. На экране должна быть кнопка выбора города, по клику на которой открывается третий экран

**Третий экран**: выбор города (в него попадаем при ошибке геолокации или при переходе со второго экрана). При выборе города переходим на *второй экран* и показываем погоду для выбранного города


# Проект **Достопримечательности**

Цели:

* Работа с сетью (GET, POST запросы, авторизация, получение данных)
* Научитсья работать с Google Maps (вывод текущей позиции и создание геометок)
* Научиться работать с *Custom View* - изображение достопримечательности с детальным описанием вместо текстовой метки
* Построение маршрутов (по выбранным геометкам)


Структура приложения:

* **Первый экран**: заставка (в фоне авторизация на сервере и запрос геолокации). При успешной авторизации переходим на экран с картой

* **Второй экран**: карта. 
    * При переходе на экран с сервера запрашивается список достопримечательностей
    * список достопримечательностей и текущая локация отображаются на карте
    * по клику на достопримечательности показывать *Custom View* и помечать (или отменять отметку) для последующего запроса построения маршрута
    * при выборе достопримечательностей показывать/скрывать кнопку *Построить маршрут*
    * при клике на эту кнопку отправлять запрос на построение маршрута

## Авторизация на сервере

> Для сетевых запросов далее будем пользоваться библиотекой [Fuel](https://github.com/kittinunf/fuel). 

### Установка библиотеки

В зависимости приложения добавляем ``implementation 'com.github.kittinunf.fuel:fuel-android:2.2.1'`` (актуальную версию библиотеки уточняйте на сайте разработчика)

> не забываем в манифесте разрешить работу с интерентом: ``<uses-permission android:name="android.permission.INTERNET"/>``

В импорт добавить ``import com.github.kittinunf.result.Result`` (автоматически он не цепляется)

### Примеры запросов

Запросы бывают двух типов: синхронные (приложение ждет ответа от сервера, останавливая работу - такие запросы имеет смысл использовать только при авторизации, когда дальше просто нельзя двигаться) и асинхронные (запрос посылается в фоне, выполнение программы продолжается - такой режим предпочтительнее, т.к. не "замораживает" интерфейс). 

В последних версиях Андроид синхронные запросы в основном потоке запрещены, так что рассматривать будем только асинхронные

> Вариантов авторизации существует множество, далее рассмотрен вариант, который использовался в демо-экзамене на курсах "Мастера 5000"

Алгоритм авторизации:

* при любом запросе должен добавляться параметр **token**
* если токен не найден, то вернется сообщение, что пользователь не авторизован: ``{"notice":{"answer": "user not authorized"}}``
* для получения токена необходимо послать **post** запрос на URL ``/login`` с параметрами login и password (в качестве логина используйте ИФамилия в латинской транскрипции, т.е. Евгений колесников = EKolesnikov. Пароль любой)
* если токен уже был получен, то сервер вернет ошибку ``{"notice":{"answer": "User is active"}}``, в этом случае нужно разлогиниться (послать запрос с теми же параметрами на URL ``/logout``). При успешной авторизации сервер вернет токен: ``{"notice": {"token":123}``


> Адрес сервера динамический, уточняйте в начале лабораторной/практики

```kt
Fuel
    .post(  "http://192.168.1.18:8080/login", 
            listOf("login" to "ekolesnikov", "password" to "passw"))
    .responseString { request, response, result ->
        when (result) {
            is Result.Failure -> {
                // отображает сообщение на экране
                Toast.makeText(applicationContext,
                                result.getException().toString(),
                                Toast.LENGTH_LONG).show()
            }
            is Result.Success -> {
                // тут реализуете разбор полученного ответа
            }
        }
    }
```

В параметрах метода **.post** передаются *URL* сервера и список параметров (логин и пароль). Метод **.responseString** срабатывает при получении ответа от сервера.

Приложение может не запуститься, выдав ошибку "Cleartext HTTP traffic to ... not permitted" - в последних версиях Андроида по-умолчанию запрещено работать без ssl. Для разрешения открытого траффика добавьте в манифест в секцию **application** аттрибут ``android:usesCleartextTraffic="true"``

> Как я писал выше, способов авторизации может быть несколько, в частности **Fuel** поддерживает базовую авторизацию (про нее мы говорили в прошлом году):
>
>```kt
>Fuel.get("https://httpbin.org/basic-auth/$user/$password")
>    .authentication()
>    .basic(username, password)
>    .response { result -> }
>```


## Создание приложения с Google Maps

Основано на этой [статье](http://developer.alexanderklimov.ru/android/google_maps.php) и [этой](https://startandroid.ru/ru/uroki/vse-uroki-spiskom/306-urok-139-google-maps-sozdanie-i-nastrojka-proekta-karta-kamera-sobytija.html) и [этой](https://www.raywenderlich.com/230-introduction-to-google-maps-api-for-android-with-kotlin)

1. Добавляем в приложение новое Activitu, выбрав форму "Google Maps Activity"

После создания Activity Android Studio автоматически создаст и откроет файл для генерации ключа.

1. Перейдите по ссылке

![создание приложения](/img/as040.png)

2. Создайте новый проект

![создание приложения](/img/as041.png)

3. Создайте ключ API

4. Полученный ключ вставьте в google_maps_api.xml (файл из которого переходили по ссылке)


И немного поправим стандартный метод **onMapReady**

```kt
override fun onMapReady(googleMap: GoogleMap) {
    mMap = googleMap

    // координаты техникума
    val yotc = LatLng(56.639439, 47.892384)

    // к метке добавлена подпись
    mMap.addMarker(MarkerOptions().position(yotc).title("Метка ЙОТК")
        .snippet("Йошкар-Олинский Технологический Коледж"))

    // используем камеру с масштабированием
    mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(yotc, 16F))
}
```

### Добавление текущей позиции

1. В build.graddle (app) добавляем зависимость ``implementation 'com.google.android.gms:play-services-location:17.0.0'``

2. Добавляем приватные аттрибуты класса:

```kt
    private var lat: Double = 0.0
    private var lon: Double = 0.0
```

3. В конструкторе инициализируем локатор (зависимости для локатора см. выше, мы его использовали в проекте **Погода**):

```kt
Locus.getCurrentLocation(this) { result ->
    result.location?.let {
        lat = it.latitude
        lon = it.longitude

        // тут можно вызвать функцию отображения текущей геолокации

    } ?: run {
        error = "${error}${result.error?.message}\n"
    }
}
```

Включение слоя с текущей геолокацией:

```kt
// на карте включаем слой с текущей локацией
mMap.isMyLocationEnabled = true

currentLatLng = LatLng(lat, lon)
mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(currentLatLng, 14f))
```

4. В методе ``onMapReady`` запрашиваем список достопримечательностей (можно и в конструкторе, но пока карты нет - нет смысла в этих данных)

```kt
Fuel.post("http://192.168.1.18:8080/points",
    listOf("token" to token))
    .responseString{request, response, result ->

        // тут разбираем ответ сервера

    }
```

В этом же методе можно прикрутить **слушателя** на событие клика по геометкам (по клику мы меняем цвет маркера и показываем/скрываем кнопку расчета маршрута):

```kt
mMap.setOnMarkerClickListener(object : GoogleMap.OnMarkerClickListener {
    override fun onMarkerClick(marker: Marker): Boolean {
        if(marker.tag==0) {
            marker.tag = 1
            marker.setIcon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_GREEN))
        } else {
            marker.tag = 0
            marker.setIcon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_RED))
        }

        // в этой функции показываем/скрываем кнопку Расчитать маршрут
        checkMarkers()

        return false
    }
})
```

То ли в API Google Maps нет методов для получения списка маркеров, то ли я не смог их найти, но в инете все хранят маркеры в отдельном массиве:

```kt
    private var marker_list =  arrayListOf<Marker>()

    ...

    //в функции добавления маркетов на карту мы должны добавить их в этот список
    val marker = MarkerOptions()
        .position(coord)
        .title( point.getString("short") )
        .icon(
            BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_RED))

    marker_list.add( mMap.addMarker(marker) )

    ...

    private fun checkMarkers(){
       for (marker in marker_list){
           if (marker.tag==1){
               btn_route.isVisible = true
               return
           }
       }
       btn_route.isVisible = false
    }
```

### Добавление своих объектов

Основано на [этой](https://startandroid.ru/ru/uroki/vse-uroki-spiskom/307-urok-140-google-maps-svoi-obekty-na-karte.html) статье

1. Запросите список достопримечательностей по адресу http://<адрес сервера>:8080/points. Тип запроса: POST, в параметрах токен.

2. Добавьте маркеры на карту

```kt
    private fun getPoints(){
        Fuel.post("http://192.168.1.18:8080/points",
            listOf("token" to token))
            .responseString{request, response, result ->
                when (result) {
                    is Result.Failure ->
                        Toast.makeText(applicationContext,
                            "Get points failure: ${result.getException()}",
                            Toast.LENGTH_LONG).show()
                    is Result.Success ->
                        try{
                            val jsonResp = JSONObject(result.get())
                            if (jsonResp.has("status") && jsonResp.getString("status")=="OK"){
                                // добавляем точки на карту
                                val points = jsonResp.getJSONArray("points")
                                for (i in 0 until points.length()){
                                    val point = points.getJSONObject(i)

                                    val coord = LatLng(point.getDouble("lat"), point.getDouble("lon"))

                                    val marker = MarkerOptions()
                                        .position(coord)
                                        .title( point.getString("short") )
                                        .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_RED))

                                    marker_list.add( mMap.addMarker(marker) )
                                }
                            }
                            else
                                throw Exception("Не верный формат ответа сервера или ошибка")
                        }catch(e: Exception){
                            Toast.makeText(applicationContext,
                                "Get points failure: ${e.message}",
                                Toast.LENGTH_LONG).show()
                        }
                }
            }
    }
```

### Добавление кнопки

В дизайнере кнопка на фрагмент с картой не перетаскивается, добавить можно прямо в XML:

```xml
    <Button
        android:id="@+id/btn_route"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="top|left"
        android:layout_marginTop="10dp"
        android:padding="10dp"
        android:paddingRight="10dp"
        android:text="Построить маршрут"
        android:visibility="invisible" />
```

В дизайнере она опять же видна не будет, но в структуре формы появится и на экране отобразится


### Добавление маршрута

Если интересно, можете прикрутить себе настоящий запрос к Directions API, но это API платное (хотя первый год денег не берут, но все-равно нужно привязывать карту). Но можете пропустить комментарий

> 1. В зависимости добавим пакет ``implementation 'com.google.maps.android:android-maps-utils:0.5'``
>
> 2. Получаем ключ для работы с API: переходим по [ссылке](https://cloud.google.com/maps-platform/pricing/), жмем **Get Started** (на цену не обращаем внимания, первый год пользования бесплатный). Если к вашему аккаунту не привязан биллинг, то нужно привязать.
>
>    * выбираем продукт (Routes)
>
>![выбираем продукт](/img/as043.png)
>
>    * выбираем проект, для которого нужен ключ. Выбирайте тот проект, который был создан для Google Maps
>
>![выбираем проект](/img/as044.png)
>
>    * включаем API
>
>![включаем API](/img/as045.png)
>
>    * копируем созданный ключ и вставляем его приватной переменной класса (вроде правильнее хранить в манифесте или ресурсах, но пока это не принципиально)
>![включаем API](/img/as046.png)
>

Чтобы не активировать кучу ключей, я сделал на локальном сервере проксирование этих запросов. Теперь вместо ``https://maps.googleapis.com/maps/api/directions/json?`` можно писать ``http://192.168.1.18:8080/directions?``. Ключ можно не указывать, все остальные параметры передаются как есть (не забываем добавить **token**).

Из текущей локации и выбранных точек формируем запрос маршрута (маршрут зацикленный, откуда вышли, туда и вернемся):

```kt

// очищаем предыдущий маршрут
if(lastRoute!=null) lastRoute!!.remove()

// формируем список путевых точек https://developers.google.com/maps/documentation/directions/intro#DirectionsRequests

// wayponts=lat1,lon1[|latN,lonN]

var waypoints = ""

for (marker in marker_list){
    if(marker.tag==1){
        if(waypoints!="") waypoints += "|"
            waypoints += "${marker.position.latitude},${marker.position.longitude}"
    }
}


if(waypoints!=""){
    Fuel.get("http://192.168.1.18:8080/directions", listOf(
         "origin" to "${lat},${lon}",
         "destination" to "${lat},${lon}",
         "waypoints" to waypoints,
         "mode" to "walking",
         "language" to "ru",
         "token" to token))
    .responseString { request, response, result ->
            when(result){
                is Result.Failure -> 
                    Toast.makeText(this, result.getException().toString(), Toast.LENGTH_LONG).show()
                is Result.Success ->
                    try {
                                val resp = JSONObject(result.get())

                                if(resp.has("error_message"))
                                    throw Exception(resp.getString("error_message"))

                                val legs = resp.getJSONArray("routes").getJSONObject(0).getJSONArray("legs")

                                if (resp.getString("status") != "OK")
                                    throw Exception("status: error")

                                //Линия которую будем рисовать
                                val line = PolylineOptions()
                                val latLngBuilder = LatLngBounds.Builder()

                                for (j in 0 until legs.length()) {
                                    val steps= legs.getJSONObject(j).getJSONArray("steps")

                                    //Проходимся по всем точкам, добавляем их в Polyline и в LanLngBounds.Builder
                                    for (i in 0 until steps.length()) {
                                        var point = LatLng(
                                            steps.getJSONObject(i).getJSONObject("start_location").getDouble(
                                                "lat"
                                            ),
                                            steps.getJSONObject(i).getJSONObject("start_location").getDouble(
                                                "lng"
                                            )
                                        )
                                        line.add(point)
                                        latLngBuilder.include(point)

                                        point = LatLng(
                                            steps.getJSONObject(i).getJSONObject("end_location").getDouble(
                                                "lat"
                                            ),
                                            steps.getJSONObject(i).getJSONObject("end_location").getDouble(
                                                "lng"
                                            )
                                        )
                                        line.add(point)
                                        latLngBuilder.include(point)

                                    }
                                }

                                //Делаем линию более менее симпатичное
                                line.width(16f).color(R.color.colorPrimary)

                                //Добавляем линию на карту
                                lastRoute = mMap.addPolyline(line)

                                //Выставляем камеру на нужную нам позицию
                                val latLngBounds = latLngBuilder.build()

                                val track = CameraUpdateFactory.newLatLngBounds(
                                    latLngBounds,
                                    500,
                                    500,
                                    25
                                )//width это размер нашего экрана

                                mMap.moveCamera(track)

                        } catch (e: Exception){
                                    Toast.makeText(this, e.toString(), Toast.LENGTH_LONG).show()
                                }
                            }
                        }
                } catch (e: ApiException) {
                    e.printStackTrace()
                    Toast.makeText(this, e.toString(), Toast.LENGTH_LONG).show()
                } catch (e: InterruptedException) {
                    e.printStackTrace()
                    Toast.makeText(this, e.toString(), Toast.LENGTH_LONG).show()
                } catch (e: IOException) {
                    e.printStackTrace()
                    Toast.makeText(this, e.toString(), Toast.LENGTH_LONG).show()
                }
}                
```

### Отображение пользовательского экрана информации о маркере

Информационное окно маркера отображает canvas (фактически скриншот формы), поэтому при отложенной загрузке картинок из интернета приходится извращаться - ловить завершение загрузки ресурса и снова показывать информационное окно.

1. В ``res\layout`` добавить шаблон для окна ``custom_infowindow.xml`` (кликаем правой кнопкой по папке layout и создаем Layout resource file)

![](/img/as047.png)

Примерное содержимое: ImageView и TextView

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="200dp"
    android:layout_height="wrap_content"
    android:orientation="vertical">

    <ImageView
        android:id="@+id/image"
        android:layout_width="match_parent"
        android:layout_height="200dp"
        android:maxWidth="200dp" />

    <TextView
        android:id="@+id/tv"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="10dp"
        android:text="Custom Info layout textview"
        android:textColor="@color/colorAccent"
        android:textSize="20sp" />

</LinearLayout>
```

2. В функцию ``onMapReady`` добавляем строчку ``mMap.setInfoWindowAdapter( CustomInfoWindowAdapter() )`` - функция setInfoWindowAdapter задает пользовательский класс для отрисовки информационного окна

3. Делаем класс, для хранения урла картинки и описания для маркера

```kt
    // массив маркеров хранит новый тип данных
    private var marker_list =  arrayListOf<MyMarker>()

    ...

    internal inner class MyMarker {
        var marker: Marker
        var url: String
        var description: String
        var downloaded = false

        constructor(_marker: Marker, _url: String, _desc: String){
            marker = _marker
            url = _url
            description = _desc
        }
    }
```    

и при создании маркера заполняем эти параметры

```kt
    val mymarker = MyMarker(mMap.addMarker(marker) ,
                            point.getString("img"),
                            point.getString("description"))

    marker_list.add( mymarker )
```

3. Реализуем класс ``CustomInfoWindowAdapter`` (объявляем внутренний класс прямо внутри класса активити) наследник ``GoogleMap.InfoWindowAdapter``

> Нашел примеры для загрузки картинок с callback-ом с использованием библиотеки Picasso
> ``implementation 'com.squareup.picasso:picasso:2.71828'``

```kt
internal inner class CustomInfoWindowAdapter : GoogleMap.InfoWindowAdapter {
        fun getImgUrl4Marker(marker: Marker): Triple<String?,String?,Boolean?>{
            for (i in 0 until marker_list.size){
                if(marker_list[i].marker==marker)
                    return Triple("$attr_URL/img/${marker_list[i].url}",
                                marker_list[i].description,
                                marker_list[i].downloaded)
            }
            return Triple(null,null,null)
        }

        // абстрактная функция класса InfoWindowAdapter - должна быть реализована в потомках
        override fun getInfoWindow(marker: Marker): View? {
            //тут менять только если меняется форма окна (круглое или облачко...)
            return null
        }

        // в этой функции реализуется отрисовка контента, т.е. нашей формы
        override fun getInfoContents(marker: Marker): View? {
            // извлекаем кастомный layout
            val inflater = applicationContext.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
            val view = inflater.inflate(R.layout.custom_infowindow, null)

            // получаем урл и описание маркера
            val (imgUrl, desc) = getImgUrl4Marker(marker)

            val (imgUrl, desc, downloaded) = getImgUrl4Marker(marker)

            if(imgUrl!=null) {
                // Picasso кэширует картинки, если картинка уже была загружена, то callback не нужен
                if (downloaded!!) {
                    Picasso.get().load(imgUrl).into(view.image)
                } else {
                    // если новая картинка, то загружаем картинку с callback функцией
                    Picasso.get().load(imgUrl).into(view.image, InfoWindowRefresher(marker))
                }
            }
            return view
        }
    }
```

4. Реализуем класс InfoWindowRefresher

```kt
    internal inner class InfoWindowRefresher : Callback {
        private lateinit var markerToRefresh: Marker

        // в конструкторе запоминаем маркер
        constructor(marker: Marker) {
            markerToRefresh = marker
        }

        override fun onError(e: Exception?) {}

        // по готовности ресурса перерисовываем информационное окно маркера
        override fun onSuccess() {
            for (i in 0 until marker_list.size){
                if(marker_list[i].marker==markerToRefresh){
                    marker_list[i].downloaded = true
                    break
                }
            }
            markerToRefresh.showInfoWindow()
        }
    }
```

# Тестовый локальный сервер

При работе в команде часто бывает, что код приложения уже более менее готов (можно отдавать тестерам), а сервера еще нет. Рассмотрим тестовый сервер, который можно быстро накидать на коленке для проверки API:

> Пока написал на том, на чем умею - node.js. В перспективе перепишу на котлин

1. Установите node.js (с официального сайта, все настройки по-умолчанию)

2. Создайте каталог для сервера, перейдите в него и выполните команду (в командной строке операционной системы) ``npm init`` (на все вопросы жмите Enter). NPM - это менеджер пакетов, команда **init** создаст файл package.json - в нем хранятся зависимости, название главного файла проекта и т.п.

3. В каталоге с проектом выполните команды (тоже в командной строке):

``npm install express --save``

и 

``npm install request --save``

``npm install request-promise --save``

Менеджер пакетов установит пакеты ``express`` (http-сервер) и ``request-promise`` (http-клиент), ключ ``--save`` запишет эти зависимости в файл проекта

2. Создайте файл ``index.js`` (или то название, которое вы дали главному файлу проекта). В него скопируйте код сервера:

```js
// директива интерпретатору "строгий режим"
'use strict';

// импортируем библиотеки
const   express = require('express'),
        request = require('request-promise');

// создаем массив пользователей и массив достопримечательностей (достопримечательности можете добавить свои)
var logged_users = [],
    points = [
        {"lat":56.63676, "lon":47.888929, "short":"Вечный огонь", "description":"Описание объекта Вечный огонь", "img":"fire.jpg"},
        {"lat":56.631275, "lon":47.888787, "short":"Йошкин кот", "description":"Описание объекта Йошкин кот", "img":"cat.jpg"},
        {"lat":56.631554, "lon":47.899335, "short":"Пушкин и Онегин", "description":"Описание объекта Пушкин и Онегин", "img":"onegin.jpg"},
        {"lat":56.633858, "lon":47.900887, "short":"Простая еда", "description":"Описание объекта Простая еда", "img":"jumanji.jpg"}
    ];

//добавляю к консольному выводу дату и время
function console_log(fmt, ...aparams){
    fmt = (new Date()).toJSON().substr(0, 19)+' '+fmt;
    console.log(fmt, ...aparams);
}

// генерирую случайное число для токена
function getToken(){
    return Math.ceil( Math.random()*9999999 )+1;
}

// поиск пользователя в массиве по логину/паролю
function getLoggedUser(login, password){
    for (let index = 0; index < logged_users.length; index++) {
        if(logged_users[index].login == login && logged_users[index].password==password){
            return index;
        }
    }
    return null;
}

// поиск пользователя по токену
function getUserByToken(token){
    for (let index = 0; index < logged_users.length; index++) {
        if(logged_users[index].token == token){
            return index;
        }
    }
    return null;
}

// проверка пользователя при логине
function checkUser(login, password){
    let index = getLoggedUser(login, password);

    if(index==null){
        // новый юзер
        let newUser = {login, password, token: getToken()};
        console_log("Новый пользователь: login=%s, token=%s", login, newUser.token);

        logged_users.push(newUser);
        return newUser.token;
    }else{
        if(logged_users[index].token==0) {
            //токена нет - генерим и возвращаем
            logged_users[index].token = getToken();
            console_log("Успешная авторизация: login=%s, token=%s", login, logged_users[index].token);
            return logged_users[index].token;
        }
        else {
            console_log("Пользователь уже авторизован: login=%s", login);
            throw new Error("User is active");
        }

    }
}

// создание экземпляра http-сервера
var app = express();

// метод .use задает команды, которые будут выполнены до разбора GET/POST команд

// декодирует параметры запроса
app.use( express.urlencoded() );

// содержимое каталога img раздается статически по урлу /img/
app.use('/img', express.static('img') );

// логгирую все входящие запросы
app.use((req, res, next)=>{
    console_log('[express] %s request from %s, body: %s', req.path, req.ip, JSON.stringify(req.body));
    next();
});

// POST запрос "логин"
app.post('/login', (req,res)=>{
    try {
        // проверяем параметры запроса
        if(req.body.login==undefined) throw new Error("В параметрах нет аттрибута login");
        if(req.body.password==undefined) throw new Error("В параметрах нет аттрибута password");

        // проверяем пользователя
        let token = checkUser(req.body.login, req.body.password);

        // если все нормально - возвращаем токен
        res.json({notice: {token}});
        
    } catch (error) {
        // при ошибке возвращаем текст ошибки
        res.json({notice:{answer: error.message}});
    }

    // метод .end закрывает соединение
    res.end();
});

// POST запрос "logout"
app.post('/logout', (req,res)=>{
    try {
        if(req.body.login==undefined) throw new Error("В параметрах нет аттрибута login");
        if(req.body.password==undefined) throw new Error("В параметрах нет аттрибута password");

        let index = getLoggedUser(req.body.login, req.body.password);
        if(index==null) throw new Error("пользователь не найден");
        else logged_users[index].token = 0;

        res.json({notice: {text: "user logout"}});
    } catch (error) {
        res.json({notice:{answer: error.message}});
    }
    res.end();
});

// POST запрос списка достопримечательностей
app.post('/points', (req, res)=>{
    try {
        if(req.body.token==undefined) throw new Error("В параметрах нет аттрибута token");

        let userIndex = getUserByToken(req.body.token);

        if(userIndex==null) throw new Error("Пользователь с таким токеном не найден");

        // в ответ пишем массив достопримечательностей
        res.json( {status: "OK", points} );
    } catch (error) {
        res.json({notice:{answer: error.message}});
    }
    res.end();
});

// обработка запроса GET /directions - проксирование запроса расчета маршрута
app.get('/directions', (req,res)=>{
    try {
        if(req.query.token==undefined) throw new Error("В параметрах нет аттрибута token");

        let userIndex = getUserByToken(req.query.token);

        if(userIndex==null) throw new Error("Пользователь с таким токеном не найден");

        let url = "";

        // все входящие параметры, кроме токена, передаем дальше
        Object.keys(req.query).forEach(function(key) {
            if(key!="token"){
                if(url=="") url = "https://maps.googleapis.com/maps/api/directions/json?";
                else url += '&';
                url+=key+'='+req.query[key];
            }
        });

        url += '&key=<тут должен быть ключ>';

        console_log("Directions redirect: %s", url);

        // http-запрос
        request({
            method: 'GET',
            uri: url,
            json: true
        }).then(function (response) {
            // Запрос был успешным, используйте объект ответа как хотите
            console_log( JSON.stringify(response) );
            res.json( response );
            res.end();
        }).catch(function (err) {
            // Произошло что-то плохое, обработка ошибки
            let ans = {notice: {answer: err}}
            console_log( JSON.stringify(ans) );
            res.json(and);
            res.end();
        });
    } catch (error) {
        let ans = {notice: {answer: error.message}}
        console_log( JSON.stringify(ans) );
        res.json( ans );
        res.end();
    }
});

// запуск сервера на порту 8080
app.listen(8080, '0.0.0.0', ()=>{
    console_log('HTTP сервер успешно запущен на порту 8080');
}).on('error', (err)=>{
    console_log('ошибка запуска HTTP сервера: %s', err)
});
```

# Проект **Погода** для электронных часов (Wear OS)

1. Установите эмулятор для часов (будьте внимательны, не установите китайскую версию)

![](/img/as048.png)

![](/img/as049.png)

![](/img/as050.png)

![](/img/as051.png)

2. Создайте проект:

![](/img/as052.png)

3. Используя библиотеку **Fuel** напишите запрос погоды по названию города. На первом экране покажите температуру, облачность и кнопку "Подробнее". По клику на кнопке сделайте переход на второе окно (реализовать активити) с отображением подробной информации о погоде


[содержание](/readme.md)