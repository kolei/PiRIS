<table style="width: 100%;"><tr><td style="width: 40%;">
<a href="../articles/themes.md">Стили и темы. Ресурсы. Фигуры. Обработчики событий.
</a></td><td style="width: 20%;">
<a href="../readme.md">Содержание
</a></td><td style="width: 40%;">
<a href="../articles/weather2.md">Проект погода (продолжение): SplashScreen (заставка). Выбор города. Выбор и отображение массива значений (почасовая, ежедневная)
</a></td><tr></table>

# Проект погода (продолжение): SplashScreen (заставка). Выбор города. Выбор и отображение массива значений (почасовая, ежедневная)

## SplashScreen (заставка).

Если приложение долго грузится (запрос геолокации или "тяжёлых" данных из сети), то принято при запуске показывать заставку.

Есть два варианта:

1. Рисуют дополнительную **activity** с заставкой и запускают её первой. 
2. Прямо на основной **activity** рисуют **ImageView** поверх всех элементов и скрывают её, когда необходимость в ней исчезает.

Рассмотрим второй вариант (при условии что у нас **ConstraintLayout**):

Я в качестве заставки буду показывать фон:

* первым элементом кладем **ImageView** с картинкой, задав ему режим растягивания на весь экран `android:scaleType="fitXY"` и Z-индекс `android:elevation="999dp"`

```xml
<ImageView
    android:scaleType="fitXY"
    android:elevation="999dp"

    android:id="@+id/splash"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    app:layout_constraintBottom_toBottomOf="parent"
    app:layout_constraintEnd_toEndOf="parent"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintTop_toTopOf="parent"
    app:srcCompat="@drawable/splash" />
```

* в коде главного окна в момент, когда нужно убрать заставку меняем Z-индекс заставки

    ```kt
    val splash = findViewById<ImageView>(R.id.splash)
    splash.elevation = 0F
    ```

    >чтобы картинка нам не мешалась при разработке, мы можем в дизайнере оставить Z-индекс **0**, а в конструкторе окна задать **999F**

Тут надо помнить, что в вёрстке указываются **dp**, а в коде **float**

## Выбор города

>В принципе список можно вывести прямо в главном окне (на форму кинуть **ListView** и с помощью атрибута *elevation* поместить его поверх всех элементов), но в таком случае не будет реализован выход по кнопке *Назад*, что может сказаться на юзабилити. 

Поэтому, будем реализовывать "классический" вариант со списком в отдельном **activity**. Заодно научимся запускать дополнительные **activity** и получать от них ответ.

1. Создаем новую форму (**Activity**) с именем *CityListActivity*

    ![Создаем новую форму](/img/as032.png)

2. На главное окно добавляем кнопу перехода на экран выбора города и обработчик для нее:

    ```kt
    startActivityForResult( 
        Intent(this, CityListActivity::class.java), 
        1)
    ```

    Здесь *startActivityForResult* - метод запуска нужной **activity**. 

3. На форму *CityListActivity* кидаем вертикальный **LinearLayout**, в него **TextView** (для заголовка "Выберите город") и **ListView**. **ListView** присваиваем id *cityList*

    ![](/img/as035.png)


4. В классе *CityListActivity* 

    * создаем массив городов

        ```kt
        private var cityNames = arrayOf(
            "Moscow",
            "Yoshkar-Ola",
            "Kazan"
        )
        ```

    * в конструкторе получаем указатель на **ListView**

        ```kt
        cityListView = findViewById(R.id.cityList)
        ```

    * задаем для списка **ArrayAdapter**. **ArrayAdapter** связывает массив данных с шаблоном элемента списка.

        ```kt
        cityListView.adapter = ArrayAdapter(
            this,
            R.layout.city_list_item,
            cityNames
        )
        ```

        Android Studio покажет ошибку, что не знает что такое ``city_list_item`` - в контекстном меню добавляем реализацию:

        ![Создание Layout для элемента списка](/img/as036.png)

        **Внимание!** RootElement поменять на TextView

        ![Создание Layout для элемента списка](/img/as037.png)

        Созданный шаблон можно настроить (установить высоту, добавить границы...)

    * задаем обработчик клика по элементу списка

        cityListView.setOnItemClickListener { parent, view, position, id ->
            // получаем название города
            val cityName = cityNames[position]

            // запоминаем выбранное название города в параметрах
            val newIntent = Intent()
            newIntent.putExtra("cityName", cityName)
            setResult(RESULT_OK, newIntent)

            // заверщаем текущий activity
            finish();
        }
        ```

5. В классе главного окна для получения результата выбора реализуем метод *onActivityResult*

    ```kt
    @SuppressLint("MissingSuperCall")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (data == null) {
            return
        }
        val name = data.getStringExtra("cityName")

        // тут запускаем http-запрос по имени города
    }
    ```

    >Метод *onActivityResult* гугл объявил устаревшим (deprecated), и в IDE он помечается как ошибка - надо в контекстном меню "More action..." выбрать "Supress: add...". Перед методом будет добавлена аннотация `@SuppressLint("MissingSuperCall")`.