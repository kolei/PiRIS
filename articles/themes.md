<table style="width: 100%;"><tr><td style="width: 40%;">
<a href="../articles/android_studio.md">Первый проект в Android Studio
</a></td><td style="width: 20%;">
<a href="../readme.md">Содержание
</a></td><td style="width: 40%;">
<a href="../articles/layout_orientation.md">Ориентация экрана.
</a></td><tr></table>

<!-- `&lt;` `&gt;` -->

# Стили и темы

## Стили

Мы можем настроить элемент с помощью различных атрибутов, которые задают высоту, ширину, цвет фона, текста и так далее. Но если у нас несколько элементов используют одни и те же настройки, то мы можем объединить эти настройки в стили.

Например, пусть у нас есть несколько элементов TextView:

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
 
    <TextView
        android:id="@+id/textView1"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:gravity="center"
        android:textSize="28sp"
        android:textColor="#3f51b5"
        android:text="Android Lollipop"
 
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toTopOf="@+id/textView2"
        />
    <TextView
        android:id="@+id/textView2"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:gravity="center"
        android:textSize="28sp"
        android:textColor="#3f51b5"
        android:text="Android Marshmallow"
 
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintBottom_toTopOf="@+id/textView3"
        app:layout_constraintTop_toBottomOf="@+id/textView1"
        />
    <TextView
        android:id="@+id/textView3"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:gravity="center"
        android:textSize="28sp"
        android:textColor="#3f51b5"
        android:text="Android Nougat"
 
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/textView2"
        />
 
</androidx.constraintlayout.widget.ConstraintLayout>
```

![](../img/04022.png)

Все эти **TextView** имеют одинаковый набор свойств, и, к примеру, если нам захочется изменить цвет текста, то придется менять его у всех трех TextView. Данный подход не оптимален, а более оптимальный подход представляет использование стилей, которые определяются в проекте в папке `res/values`.

Итак, добавим в проект в папку `res/values` новый элемент Value Resourse File, который назовем `styles.xml`:


![](../img/04023.png)

Определим в файле styles.xml следующее содержимое:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="TextViewStyle">
        <item name="android:layout_width">0dp</item>
        <item name="android:layout_height">wrap_content</item>
        <item name="android:textColor">#3f51b5</item>
        <item name="android:textSize">28sp</item>
        <item name="android:gravity">center</item>
    </style>
</resources>
```

Здесь определен новый стиль **TextViewStyle**, который с помощью элементов **item** задает значения для атрибутов **TextView**.

Стиль задается с помощью элемента `<style>`. Атрибут **name** указывает на название стиля, через которое потом можно ссылаться на него. Необязательный атрибут **parent** устанавливает для данного стиля родительский стиль, от которого дочерний стиль будет наследовать все свои характеристики.

С помощью элементов **item** устанавливаются конкретные свойства виджета, который принимает в качестве значения атрибута **name** имя устанавливаемого свойства.

Теперь применим стиль элементов TextView в файле `activity_main.xml`:

```xml
<TextView
    android:id="@+id/textView1"
        
    style="@style/TextViewStyle"
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    android:text="Android Lollipop"
    app:layout_constraintLeft_toLeftOf="parent"
    app:layout_constraintRight_toRightOf="parent"
    app:layout_constraintTop_toTopOf="parent"
    app:layout_constraintBottom_toTopOf="@+id/textView2"
    />
```

Используя определение `style="@style/TextViewStyle"` текстовое поле связывается с определением стиля. Итоговый результат буде тот же, что и раньше, только кода становится меньше. А если мы захотим поменять какие-то характеристики, то достаточно изменить нужный элемент item в определении стиля.

## Темы

Кроме применение отдельных стилей к отдельным элементам, мы можем задавать стили для всего приложения или activity в виде тем. Тема предтавляет коллекцию атрибутов, которые применяются в целом ко всему приложению, классу activity или иерархии виджетов.

Мы можем сами создать тему. Однако Android уже предоставляет несколько предустановленных тем для стилизации приложения, например, Theme.AppCompat.Light.DarkActionBar и ряд других.

По умолчанию приложение уже применяет темы. Так, откроем файл AndroidManifest.xml. В нем мы можем увидеть следующее определение элемента application, представляющего приложение:

```xml
<application
    android:allowBackup="true"
    android:icon="@mipmap/ic_launcher"
    android:label="@string/app_name"
    android:roundIcon="@mipmap/ic_launcher_round"
    android:supportsRtl="true"
    android:theme="@style/Theme.ViewApp">
```        

Задание темы происходит с помощью атрибута *android:theme*. В данном случае используется ресурс, который называется в моем случае *Theme.ViewApp*. По умолчанию файлы тем определены в папке `res/values`. В частности, здесь можно найти условный каталог themes, в котором по умолчанию есть два элемента: `themes.xml`:

Дальше про темы читайте в [оригинальной лекции](https://metanit.com/java/android/6.2.php)

# Работа с ресурсами

Ресурс в приложении Android представляет собой файл, например, файл разметки интерфейса или некоторое значение, например, простую строку. То есть ресурсы представляют собой и файлы разметки, и отдельные строки, и звуковые файлы, файлы изображений и т.д. Все ресурсы находятся в проекте в каталоге `res`. Для различных типов ресурсов, определенных в проекте, в каталоге res создаются подкаталоги. Поддерживаемые подкаталоги:

* **animator**: xml-файлы, определяющие анимацию свойств
* **anim**: xml-файлы, определяющие tween-анимацию
* **color**: xml-файлы, определяющие список цветов
* **drawable**: Графические файлы (.png, .jpg, .gif) или описание фигур в .xml формате
* **mipmap**: Графические файлы, используемые для иконок приложения под различные разрешения экранов
* **layout**: xml-файлы, определяющие пользовательский интерфейс приложения
* **menu**: xml-файлы, определяющие меню приложения
* **raw**: различные файлы, которые сохраняются в исходном виде
* **values**: xml-файлы, которые содержат различные используемые в приложении значения, например, ресурсы строк
* **xml**: Произвольные xml-файлы
* **font**: файлы с определениями шрифтом и расширениями .ttf, .otf или .ttc, либо файлы XML, который содержат элемент `<font-family>`

## Применение ресурсов

Существует два способа доступа к ресурсам: в файле исходного кода и в файле xml.

### Ссылка на ресурсы в коде

Тип ресурса в данной записи ссылается на одно из пространств (вложенных классов), определенных в файле `R.java`, которые имеют соответствующие им типы в xml:

* **R.drawable** (ему соответствует тип в xml drawable)
* **R.id** (id)
* **R.layout** (layout)
* **R.string** (string)
* **R.attr** (attr)
* **R.plural** (plurals)
* **R.array** (string-array)

Например, для установки ресурса `activity_main.xml` в качестве графического интерфейса в коде **MainActivity** в методе *onCreate()* есть такая строка:

```kt
setContentView(R.layout.activity_main)
```

Через выражение **R.layout.activity_main** мы и ссылаемся на ресурс `activity_main.xml`, где **layout** - тип ресурса, а **activity_main** - имя ресурса.

Подобным образом мы можем получать другие ресурсы. Например, в файле `res/values/strings.xml` определен ресурс **app_name**:

```xml
<resources>
    <string name="app_name">ViewApp</string>
</resources>
```

Этот ресурс ссылается на строку. Чтобы получить ссылку на данный ресурс в коде, мы можем использовать выражение **R.string.app_name**.

### Доступ в файле xml

Нередко возникает необходимость ссылаться на ресурс в файле xml, например, в файле, который определяет визуальный интерфейс, к примеру, в `activity_main.xml`. Ссылки на ресурсы в файлах xml имеют следующую формализованную форму: `@[имя_пакета:]тип_ресурса/имя_ресурса`

* имя_пакета представляет имя пакета, в котором ресурс находится (указывать необязательно, если ресурс находится в том же пакете)

* тип_ресурса представляет подкласс, определенный в классе R для типа ресурса

* имя_ресурса имя файла ресурса без расширения или значение атрибута android:name в XML-элементе (для простых значений).

Например, мы хотим вывести в элемент **TextView** строку, которая определена в виде ресурса в файле `strings.xml`:

```xml
<TextView
    android:id="@+id/textView"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/app_name" />
```

В данном случае свойство *text* в качестве значения будет получать значение строкового ресурса **app_name**.

Подробнее про ресурсы можно посмотреть в [отдельной лекции](https://metanit.com/java/android/2.5.php)

# Фигуры в качестве фона для визуальных элементов

Часто применяется для круглых кнопок.

Вообще для задания цвета фона используется атрибут *android:background*, но в андроиде невозможно задать скругленные углы, чтобы получить круглые кнопки (или прямоугольные со скруглёнными углами).

Для реализации такой фичи можно в качестве фона задать *drawable* ресурс: `@drawable/название_файла_ресурса`

А в качестве *drawable* ресурса может быть, как мы уже знаем, картинка или фигура.

Про фигуры расскажу подробнее:

В каталоге `res/drawable` создайте "Drawable Resource File" c корневым элементом **shape** ([фигура](https://developer.android.com/guide/topics/resources/drawable-resource#Shape))

В качестве фигуры можно использовать 4 примитива. 

* **rectangle** - прямоугольник
* **oval** - овал
* **line** - горизонтальная линия
* **ring** - кольцо

Для фигуры **ring** в теге **shape** могут быть определены дополнительные атрибуты:

* **android:innerRadius** - внутренний радиус
* 

Также в теге **shape** могут быт вложенные теги для настройки фигур:

* **stroke** - можно задать толщину и цвет границы фигуры, например овал с тонкой черной границей:

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <shape
        xmlns:android="http://schemas.android.com/apk/res/android"
        android:shape="oval">
        <stroke
            android:width="1dp"
            android:color="#000000">
        </stroke>
    </shape>
    ```

    ![](../img/04024.png)

    ещё у тега **stroke** есть атрибуты *android:dashWidth* - ширина пунктирной линии и *android:dashGap* - промежуток между линиями

* **solid** - задаёт цвет заливки фигуры
    
    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <shape
        xmlns:android="http://schemas.android.com/apk/res/android"
        android:shape="rectangle">
        <stroke
            android:width="2dp"
            android:color="#0000FF">
        </stroke>
        <solid
            android:color="#00FF00">
        </solid>
    </shape>
    ```

    ![](../img/04025.png)

* **size** - по умолчанию фигура занимает все доступное ей пространство, но мы можем явно указать её размер с помощью тега size.

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <shape
        xmlns:android="http://schemas.android.com/apk/res/android"
        android:shape="rectangle">
        <stroke
            android:width="2dp"
            android:color="#0000FF">
        </stroke>
        <size
            android:width="100dp"
            android:height="100dp">
        </size>
    </shape>
    ```

    ![](../img/04026.png)

* **padding** - позволяет нам задать величину отступа внутри фигуры. Это актуально, например, для **TextView**. Отступ будет учтен при размещении текста.

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <shape
        xmlns:android="http://schemas.android.com/apk/res/android"
        android:shape="rectangle">
        <stroke
            android:width="2dp"
            android:color="#0000FF">
        </stroke>
        <padding
            android:bottom="5dp"
            android:top="20dp"
            android:left="50dp"
            android:right="30dp">
        </padding>
    </shape>
    ```

    ![](../img/04027.png)

* **gradient** - заливка с переходом из одного цвета в другой (можно с переходом через третий цвет). Градиенту можно указать угол и тип (линейный, радиальный).

* **corners** - с помощью этого тега мы можем задать скруглённые углы для прямоугольника

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <shape
        xmlns:android="http://schemas.android.com/apk/res/android"
        android:shape="rectangle">
        <stroke
            android:width="1dp"
            android:color="#000000">
        </stroke>
        <corners
            android:radius="40dp">
        </corners>
    </shape>
    ```

    ![](../img/04028.png)

    Причем можно задать свой радиус для каждого угла

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <shape
        xmlns:android="http://schemas.android.com/apk/res/android"
        android:shape="rectangle">
        <stroke
            android:width="1dp"
            android:color="#000000">
        </stroke>
        <corners
            android:topLeftRadius="15dp"
            android:topRightRadius="30dp"
            android:bottomRightRadius="45dp"
            android:bottomLeftRadius="60dp">
        </corners>
    </shape>
    ```

    ![](../img/04029.png)

* **ring** - кольцо. Для кольца мы можем настроить два параметра: размер внутреннего радиуса и толщина кольца. Причем, эти два параметра мы можем указывать в абсолютном и относительном выражении.

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <shape
        xmlns:android="http://schemas.android.com/apk/res/android"
        android:innerRadius="50dp"
        android:shape="ring"
        android:thickness="40dp"
        android:useLevel="false">
        <solid
            android:color="#FF0000">
        </solid>
        <size
            android:height="200dp"
            android:width="200dp">
        </size>
    </shape>
    ```

    ![](../img/04030.png)

    Подробнее про режимы отображения кольца (и других фигур) можно посмотреть [здесь](https://startandroid.ru/ru/uroki/vse-uroki-spiskom/377-urok-162-grafika-drawable-shape-gradient.html)

# Обработка событий (клик по кнопке)

Существует несколько способов задать обработчики событий:

1. Атрибут **onClick**

Для кнопок (тег **Button**) можно задать обработчик клика, для этого в разметке добавьте атрибут *android:onClick* и задайте имя функции обработчика:

```xml
<Button
    ...
    android:onClick="onOperationClick"/>
```

Чтобы не писать вручную эту функцию можно нажать на её названии клавиши `Alt+Enter` и выбрать действие "Create onOperationClick(view) in MainActivity"

>Если мы вручную добавляли новую *activity*, то нужно в корневой элемент добавить ссылку на класс, который будет работать с этой *activity*: `tools:context=".MainActivity"`

Один и тот же обработчик можно назначить нескольким кнопкам (в калькуляторе можно сделать всего два обработчика: один для числовых кнопок, а второй для функциональных)

В коде обработчика мы должны либо привести параметр *view* к типу **Button**: 

```kt
fun onOperatorClick(view: View) {
    when((view as Button).text){
        "*" -> {
            // реализовать операцию умножения 
        }
    }
}
```

Либо в разметке добавить кнопкам атрибут *android:tag* и в коде анализировать его содержимое (ему приведение типов не нужно, т.к. он объявлен в классе **View**)

2. Программное добавление обработчика в классе:

Сначала надо получить экземпляр элемента (для этого используется функция **findViewById**), затем назначить ему событие:

```kt
val btn_one = findViewById<Button>(R.id.btn_one)
if (btn_one != null) {
    btn_one.setOnClickListener {
        textView.text="hello"
    }
}
```


# Дополнение

В мастере создания нового проекта Android Studio для многих шаблонов проект использует библиотеку компонентов MaterialDesign для Android. И он устанавливает тему по умолчанию на основе Theme.MaterialComponents.DayNight.DarkActionBar.

Побочным эффектом этого является то, что любые элементы `<Button>` в макете превращаются в виджеты **MaterialButton**, а не в обычные виджеты **Button**. **MaterialButton** игнорирует атрибут *android:background*.

Если вам нужна кнопка с индивидуальным фоном, и ваша тема настроена на использование *Theme.MaterialComponents*, вы можете переключить элемент XML в макете на `<android.widget.Button>` вместо `<Button>`.

# Задание

* используя стили раскрасить функциональные и цифровые кнопки калькулятора
* сделать кнопки со скругленными углами используя фигуры
* создайте обработчики нажатия кнопок и реализуйте работу калькулятора

<table style="width: 100%;"><tr><td style="width: 40%;">
<a href="../articles/android_studio.md">Первый проект в Android Studio
</a></td><td style="width: 20%;">
<a href="../readme.md">Содержание
</a></td><td style="width: 40%;">
<a href="../articles/layout_orientation.md">Ориентация экрана.
</a></td><tr></table>
