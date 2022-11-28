# Android TV

>Содрано [отсюда](https://habr.com/ru/post/316260/), [отсюда](https://skillbox.ru/media/code/razrabotka_pod_android_tv/) и [отсюда](https://skillbox.ru/media/code/razrabotka_pod_android_tv_part2/)

[Первая](https://habr.com/ru/post/316260/) статья довольно древняя (2016 год), попробуем реализовать в 2022

Данная лекция познакомит вас с разработкой простого приложения для Android TV.

Так как интерфейс приложений для телефонов и Android TV имеет существенные различия, то мы должны создать интерфейс приложения, подходящий для взаимодействия на TV. Например, нам следует создавать приложения с которыми можно взаимодействовать, используя только клавиши `—` `↑` `↓` `→` `←`. В реализации такого интерфейса нам может помочь библиотека **LeanbackSupport**, позволяющая вполне легко создавать UI, который будет удобен при работе с приложениями на Android TV.

## Коротко о библиотеке Leanback

Библиотека Leanback представляет собой набор шаблонов экранов с различными функциональными особенностями. Есть экраны для отображения списков, карточек контента, диалогов и т. д. Эти экраны обрабатывают все пользовательские переходы между элементами и анимации, а также имеют довольно обширный функционал для построения простых приложений “из коробки”. Идеология данной библиотеки заключается в том, что все приложения на ее основе должны быть похожи в плане пользования. Не нужно думать, узнает ли пользователь о том что можно прокрутить вниз? Узнает, потому что он уже пользовался сотнями однотипных приложений.

## Создание проекта в Android Studio

Запустив Android Studio, необходимо создать новый проект. При создании выбрать платформу TV и указать минимальную версию SDK. Android Studio предложит нам создать "Blank Activity", его и создадим (в оригинальной статье предлагают создать пустой проект без активности "No Activity" и руками добавлять классы, файлы разметки и фрагменты, но это долго, проще выкинуть лишнее из рабочего проекта) 

![](../img/tv_01.png)

Можем запустить и увидеть что проект работает и что-то показывает:

![](../img/tv_02.png)

Рассмотрим структуру созданного проекта:

### Манифест

>Менять мы пока ничего не будем, просто ознакомимся с особенностями проекта для TV

* По-умолчанию уже добавлено разрешение на работу с интернетом

    ```xml
    <uses-permission android:name="android.permission.INTERNET" />
    ```

* Заданы требования к целевому устройству

    Может отсутствовать (не требуется) тачскрин:

    ```xml
    <uses-feature
        android:name="android.hardware.touchscreen"
        android:required="false" />
    ```

    Приложение должно запускаться только на Android TV. Если вы разрабатываете приложение не только для TV, то вам следует установить значение *false*:

    ```xml
    <uses-feature
        android:name="android.software.leanback"
        android:required="true" />
    ```

* При объявлении Activity мы указываем в *intent-filter* в теге *category*, что Activity должна запускаться на Android TV.

    ```xml
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />

        <category android:name="android.intent.category.LEANBACK_LAUNCHER" />
    </intent-filter>
    ```    

### MainActivity

Первым запускается как обычно **MainActivity**

```kt
class MainActivity : FragmentActivity() 
{
    override fun onCreate(savedInstanceState: Bundle?) 
    {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        if (savedInstanceState == null) {
            getSupportFragmentManager().beginTransaction()
                .replace(R.id.main_browse_fragment, MainFragment())
                .commitNow()
        }
    }
}
```

`activity_main.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/main_browse_fragment"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity"
    tools:deviceIds="tv"
    tools:ignore="MergeRootFrame" />
```    

По коду мы видим, что вёрстка приложени состоит из единственного фрагмента, содержимое для которого генерится в классе **MainFragment**.

### MainFragment

Класс **MainFragment** наследуется от класса `BrowseSupportFragment()`, а про его структуру хорошо расписано во [второй](https://skillbox.ru/media/code/razrabotka_pod_android_tv/) статье. 

**BrowseFragment** — это фрагмент, предназначенный для создания экрана со списками элементов и заголовками. Его структура выглядит следующим образом:

![](../img/tv_01.webp)

Рассмотрим каждый из элементов:

* **TitleView** - это контейнер с элементами. Он нужен для брендирования приложения (текст и логотип в правом верхнем углу), а также для добавления кнопки поиска. Чтобы кнопка поиска была видимой, ей необходимо установить слушателя. Это можно сделать, вызвав метод *setOnSearchClickedListener* у фрагмента.

* **HeadersFragment & RowsFragment** - **HeadersFragment** — список заголовков в левой части экрана и **RowsFragment** — контейнер для контента в правой части экрана. Эти фрагменты работают в связке, и **BrowseFragment** делегирует им отрисовку элементов своего адаптера.

Таким образом, в методе *onActivityCreated* класса **MainFragment** настраиваются вышеперечисленные контейнеры. Можем убедиться в этом закомментировав функции, которые что-то делают и посмотрев на результат:

```kt
override fun onActivityCreated(savedInstanceState: Bundle?) {
    Log.i(TAG, "onCreate")
    super.onActivityCreated(savedInstanceState)

    // prepareBackgroundManager()
    // setupUIElements()
    // loadRows()
    // setupEventListeners()
}
```

![](../img/tv_03.png)

#### Метод *prepareBackgroundManager*

Инициализирует *lateinit* свойства класса и пока ничего не показывает

#### Метод *setupUIElements*

Устанавливает заголовок в правом верхнем углу и цвет для левой панели

![](../img/tv_04.png)

#### Метод *loadRows* 

Формирует всё содержимое, разберёмся с ним подробнее:

1. `val list = MovieList.list` - Получаем список фильмов

    Свойство *list* класса **MovieList** возвращает массив объектов **Movie**, реализацию можно не разбирать, мы в реальном проекте всё-равно этот список будем получать динамически из АПИ.

1. `val rowsAdapter = ArrayObjectAdapter(ListRowPresenter())` - Создаётся **стандартный** адаптер **ArrayObjectAdapter** использующий **стандартный** класс-представление **ListRowPresenter** для вывода "строки". "Строка" (*ListRow* - строка списка), отображаемая этим представлением, выводит во фрагменте заголовков (*HeadersFragment* - левая часть экрана) заголовок, а во фрагменте строк (*RowsFragment* - правая часть) содержимое.

1. `val cardPresenter = CardPresenter()` - создание самописанного (реализующего абстрактный класс) экземпляра представления карточки фильма

1. Цикл перебора категорий (`for (i in 0 until NUM_ROWS)`)

    >Тут количество категорий "прибито гвоздями", в реальном проекте мы будем перебирать список имеющихся категорий

    ```kt
    if (i != 0) {
        Collections.shuffle(list)
    }
    ```

    Эта конструкция меняет содержимое коллекции в случайном порядке для всех строк, кроме первой. Если этого не сделать, то выведутся одинаковые строки (строки формируются из одного и того же списка фильмов):

    ![](../img/tv_05.png)

    Далее создаётся адаптер для содержимого, которое будет отображаться в *RowsFragment* (правая часть экрана) и заполняется фильмами из списка:

    ```kt
    val listRowAdapter = ArrayObjectAdapter(cardPresenter)
    for (j in 0 until NUM_COLS) {
        listRowAdapter.add(list[j % 5])
    }
    ```

    В конце цикла создаётся заголовок для категории. Заголовок вместе со списком фильмов добавляется в адаптер "строк" *rowsAdapter*:

    ```kt
    val header = HeaderItem(
        i.toLong(), 
        MovieList.MOVIE_CATEGORY[i])

    rowsAdapter.add(
        ListRow(
            header, 
            listRowAdapter))
    ```

    В итоге структура выглядит примерно так:

    ![](../img/tv_07.png)

    **ListRowPresenter** это стандартный класс библиотеки **Leanback**, отвечающий за размещение заголовка и содержимого по разным фрагментам (Headers и Rows). **CardPresenter** класс, отвечающий за отображение отдельного элемента (в правом фрагменте).

1. Добавление строки с настройками

    ![](../img/tv_06.png)

    Строка находится в общем адаптере (вертикальный список), но реализация элементов списка у неё другая:

    ```kt
    // формируем заголовок
    val gridHeader = HeaderItem(
        NUM_ROWS.toLong(), 
        "PREFERENCES")

    // здесь создаётся представление для элемента настроек
    val mGridPresenter = GridItemPresenter()

    // на его основе делается адаптер для строки элементов
    val gridRowAdapter = ArrayObjectAdapter(mGridPresenter)

    // и в эту строку добавляются пункты меню настроек
    gridRowAdapter.add(
        resources.getString(R.string.grid_view))
    gridRowAdapter.add(
        getString(R.string.error_fragment))
    gridRowAdapter.add(
        resources.getString(R.string.personal_settings))
    ```

    В итоге в основной адаптер добавляется строка с настройками

    ```kt
    rowsAdapter.add(
        ListRow(gridHeader, gridRowAdapter))
    ```

    И готовый адаптер назначается адаптеру нашего класса (его нет в нашей реализации, он объявлен в родительском классе)

    ```kt
    adapter = rowsAdapter
    ```

#### Метод *setupEventListeners*

Настраивает события, которые будет обрабатывать приложение:

```kt
setOnSearchClickedListener {
    Toast.makeText(
            activity!!, 
            "Implement your own in-app search",
            Toast.LENGTH_LONG)
        .show()
}
```

Назначение этого события **включает** иконку поиска. Реализации поиска пока никакой нет.

```kt
onItemViewClickedListener = ItemViewClickedListener()
```

*onItemViewClickedListener* - обработчик события клика по карточке фильма

```kt
onItemViewSelectedListener = ItemViewSelectedListener()
```

*onItemViewSelectedListener* - обработчик клика по элементу вертикального списка (категории)

## Модификация под свои нужды

### Загрузочный экран

Не знаю, будет ли это на демо-экзамене, но для демонстрации работы с обычными *activity* добавим загрузочный экран:

1. Добавьте пустую активность (в контекстном меню пакета `New -> Activity -> Empty Activity`)

1. В манифесте перенесите тег `<intent-filter>` из активности *.MainActivity* в *.LaunchActivity* (я ещё скопировал атрибут `android:screenOrientation="landscape"`)

1. В `drawable` ресурсы добавьте картинку для заставки и в файл разметки добавьте **ImageView** с этой картинкой

1. В классе **LaunchActivity**: 

    * поменяйте родителя, вместо **AppCompatActivity** оставьте просто **Activity** (**AppCompatActivity** не реализован в Android TV)

    * Реализуйте таймер и переход на главное окно:

        ```kt
        class LaunchActivity : Activity() {
            lateinit var that: Activity
            override fun onCreate(savedInstanceState: Bundle?) {
                super.onCreate(savedInstanceState)
                setContentView(R.layout.activity_launch)
                that = this
                Timer().schedule(3000L){
                    that.runOnUiThread {
                        startActivity(Intent(that, MainActivity::class.java))
                    }
                }
            }
        }
        ```

        Тут мне лень было писать метод для обработки события таймера, поэтому контекст (*this*) я сохранил в отдельную переменную (внутри лямбда-функции таймера контекст другой)

Всё замечательно работает!!!

### Получение списка фильмов с сервера

Что-бы не терять время просто так, поместим этот код в загрузочную активность (заодно проверим как тут работает класс **Application**)

В классе приложения (**MyApp**) описываем переменную
`val movieList = ArrayList<Movie>()`, в которую будем записывать информацию о фильмах (Класс **Movie** я пока оставил как есть).


```kt
override fun onCreate(savedInstanceState: Bundle?) 
{
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_launch)
    app = applicationContext as MyApp
    that = this
    Timer().schedule(3000L){
        that.runOnUiThread {
            startActivity(Intent(that, MainActivity::class.java))
        }
    }
    // запрос списка фильмов вынесен в отдельный метод
    getMovieList()
}

private fun getMovieList() {
    Http.call("http://cinema.kolei.ru/movies?filter=new"){ 
        response, error ->
        try {
            if (error != null) throw error
            if (!response!!.isSuccessful) 
                throw Exception(response.message)

            var json = JSONArray(response.body!!.string())

            // работу с классом приложения на всякий случай тоже заворачиваю в UI поток
            runOnUiThread {
                app.movieList.clear()
                for (i in 0 until json.length()){
                    val item = json.getJSONObject(i)
                    app.movieList.add(Movie(
                        id = item.getLong("movieId"),
                        title = item.getString("name"),
                        description = item.getString("description"),
                        cardImageUrl = "http://cinema.kolei.ru/up/images/${item.getString("poster")}"
                    ))
                }
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

В классе **MainFragment** указатель на *app* получаем через ссылку на текущую активность (я упоминал в прошлой лекции, что фрагмент не может существовать сам по себе, а работает в контексте какой-то активности)

```kt
override fun onActivityCreated(savedInstanceState: Bundle?) 
{
    super.onActivityCreated(savedInstanceState)
    app = activity?.application as MyApp
```

И в методе *loadRows* задаём в качестве списка фильмов тот, который получили с сервера

```kt
private fun loadRows() {
    val list = app.movieList  //MovieList.list
```

Запускаем проект и видим, что данные получены и отображаются верно (нужно только поправить вёрстку) и знакомые нам механизмы работы с классом приложения и сетевые запросы работают как надо:

![](../img/tv_08.png)

### Группировка по категориям

В АПИ в информацию о фильме я добавил категорию. 

Добавим поле для категории в класс **Movie**

```kt
var category: String? = null
```

Не забываем заполнить его при получении данных:

```kt
app.movieList.add(Movie(
    id = item.getLong("movieId"),
    title = item.getString("name"),
    description = item.getString("description"),
    cardImageUrl = "http://cinema.kolei.ru/up/images/${item.getString("poster")}",
    category = item.getString("category")
))
```

В методе *loadRows*, перед формированием данных для отображения, получаем список уникальных названий категорий:

```kt
val categoriesList = list.map{m->m.category}.distinct()
```

С методом *distinct* вы уже знакомы, а метод *map* преобразует содержимое массива. В нашем случае мы выбираем только название категорий (в итоге получается массив строк).

![](../img/tv_09.png)

Теперь перебираем список категорий, создавая для каждой свой *listRowAdapter*. Далее во вложенном цикле заполняем этот адаптер подходящими по категории фильмами. После заполнения одной категории заголовок (категория) и содержимое этой категории (*listRowAdapter*) записываются в общий 

```kt
for (i in categoriesList.indices){
    val listRowAdapter = ArrayObjectAdapter(cardPresenter)

    // формируем элементы строки, фильтруя фильмы по категории
    for (j in list.indices) {
        if (list[j].category != null && list[j].category == categoriesList[i]) {
            listRowAdapter.add(list[j])
        }
    }

    // сформированную строку с заголовком пишем в rowsAdapter
    val header = HeaderItem(categoriesList[i])
    rowsAdapter.add(ListRow(header, listRowAdapter))
}
```

![](../img/tv_10.png)

### Настройка вёрстки карточки фильма

<!-- https://tv.withgoogle.com/# -->

<!-- https://habr.com/ru/company/ivi/blog/351084/ -->

<!-- https://corochann.com/introduction-android-tv-application-hands-on-tutorial-1-32/

https://corochann.com/construction-of-browsefragment-android-tv-application-hands-on-tutorial-2-71/

https://www.kodeco.com/20747024-android-tv-getting-started -->
