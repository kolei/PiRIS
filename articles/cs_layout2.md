<table style="width: 100%;"><tr><td style="width: 40%;">
<a href="../articles/cs_mysql_connection3.md">Создание подключения к БД MySQL. Получение данных с сервера.
</a></td><td style="width: 20%;">
<a href="../readme.md">Содержание
</a></td><td style="width: 40%;">
<a href="../articles/cs_pagination.md">Пагинация, сортировка, фильтрация, поиск
</a></td><tr></table>

# Вывод данных согласно макету (ListView, Image).

>Старый вариант с SQL-запросами находится [тут](./cs_layout.md)

>Напоминаю как выглядит макет списка продукции
>![](../img/product_list_layout.jpg)
>
>Критерий | Баллы
>---------|:-----:
>Список продукции отображается в соответствии с макетом | 0.5
>У каждой продукции в списке отображается изображение | 0.3
>При отсутствии изображения отображается картинка-заглушка из ресурсов | 0.3

Для создания такого макета используется элемент **ListView**

В разметке вместо **DataGrid** вставляем **ListView**

```xml
<ListView
    Grid.Row="1"
    Grid.Column="1"
    ItemsSource="{Binding ProductList}"
>
    <!-- сюда потом вставить ListView.ItemTemplate -->
</ListView>
```

Внутри него вставляем шаблон для элемента списка (*ListView.ItemTemplate*): пока у нас только прямоугольная рамка со скруглёнными углами (в этом макете вроде скрулять не надо, возможно осталось от другого шаблона)

```xml
<ListView.ItemTemplate>
    <DataTemplate>
        <Border 
            BorderThickness="1" 
            BorderBrush="Black" 
            CornerRadius="5">

            <!-- сюда потом вставить содержимое: grid из трёх колонок -->

        </Border>
    </DataTemplate>
</ListView.ItemTemplate>                
```

Внутри макета вставляем **Grid** из трёх колонок: для картинки, основного содержимого и стоимости.

```xml
<Grid 
    Margin="10" 
    HorizontalAlignment="Stretch">

    <Grid.ColumnDefinitions>
        <ColumnDefinition Width="64"/>
        <ColumnDefinition Width="*"/>
        <ColumnDefinition Width="auto"/>
    </Grid.ColumnDefinitions>

    <!-- сюда потом вставить колонки -->

</Grid>
```

**В первой** колонке выводим изображение:

```xml
<Image
    Width="64" 
    Height="64"
    Source="{Binding ImagePreview,TargetNullValue={StaticResource defaultImage}}" />
```

Обратите внимание, вместо поля *Image* я вывожу вычисляемое поле *ImagePreview* - в геттере проверяю есть ли такая картинка, т.к. наличие названия в базе не означает наличие файла на диске.

Вычисляемое поле можно добавить в сгенерированный класс **Product** (файл `Models/Product.cs`), но этот файл может быть перезаписан при повторном реконструировании БД, поэтому лучше создавать модифицированные классы в другом месте. Классы в C# могут быть описаны в нескольких файлах (главное чтобы они были в одном namespace), для этого используется ключевое слово **partial**:

На демо экзамене есть критерии оценки за логическую и файловую структуру, поэтому куда попало классы писать не надо. Создайте каталог `Classes` и в нём класс **Product**. В созданном классе поменяйте namespace (напоминаю, оно должно быть таким же, как у модели) и добавьте в класс **Product** вычисляемые поля:  

```cs
namespace WpfApp3.Models
{
    public partial class Product
    {
        public Uri ImagePreview
        {
            get
            {
                var imageName = Environment.CurrentDirectory + (Image ?? "");
                return System.IO.File.Exists(imageName) ? new Uri(imageName) : null;
            }
        }

        public string TypeAndName
        {
            get
            {
                // обратите внимание, мы читаем свойство Title виртуального поля ProductType
                return ProductType?.Title + " | " + Title;
            }
        }
    }
}
```

1. Файлы подгружаемые с диска должны быть в формате **Uri**, иначе программа ищет их в ресурсах исполняемого файла
1. К имени файла добавляю путь к текущему каталогу 
1. Если такого файла нет, то возвращаю **null**, в этом случае срабатывает параметр привязки *TargetNullValue* - отображать изображение по-умолчанию.
1. Изображение по-умолчанию задается в ресурсах окна (первый элемент в теге Window)

    ```xml
    <Window.Resources>
        <BitmapImage 
            x:Key='defaultImage' 
            UriSource='./Images/picture.png' />
    </Window.Resources>
    ```

    тут, как раз, указывается путь к изображению в ресурсах (в моём случае в приложении создан каталог `Images` и в него ЗАГРУЖЕН файл)

**Во второй** колонке вывожу основную информацию о продукте: тип + название, аритикул и список материалов.

Так как данные выводятся в несколько строк, то заворачиваю их в **StackPanel** (тут можно использовать и **Grid**, но их и так уже много в разметке)

```xml
<StackPanel
    Grid.Column="1"
    Margin="5"
    Orientation="Vertical">

    <TextBlock 
        Text="{Binding TypeAndName}"/>

    <TextBlock 
        Text="{Binding ArticleNumber}"/>

    <TextBlock 
        Text="{Binding MaterialString}"/>
</StackPanel>
```

Вообще выводимый текст можно форматировать, но чтобы не запоминать лишних сущностей можно нарисовать ещё один геттер *TypeAndName* (в том же классе **Product**)

Артикул выводится как есть

Строка материалов должна формироваться динамически по таблице связей **ProductMaterial**, про неё раскажу ниже.

**В третьей** колонке выводим **сумму материалов**, т.е. опять динамически формируем по таблице связей.

```cs
<TextBlock 
    Grid.Column="2"
    Text="{Binding MaterialSum}"/>
```

Если мы сейчас попробуем запустить наше приложение, то получим исключение (что-то с **NULL**). Дело в том, что по-умолчанию в модель загружаются данные только текущей таблицы (Product), а виртуальное свойство **ProductType** остаётся не заполненным. Для того, чтобы считать связанные данные, нужно при чтении данных использовать метод **Include**:

>Количество включений не ограничено, но всё сразу лучше не загружать - WPF достаточно "умный", чтобы вычислять нужные свойства только при отображении, поэтому строку материалов и сумму можно считать отдельно

```cs
using (var context = new esmirnovContext())
{
    ProductList = context.Products
        .Include(product => product.ProductType)
        .Include(product => product.ProductMaterials)
        .ToList();
}
```

На данный момент приложение выглядит примерно так

![](../img/cs005.png)

Видно, что размер элемента зависит от содержимого.

Чтобы это исправить нужно добавить в **ListView** стиль для элемента контейнера, в котором задать горизонтальное выравнивание по ширине:

```xml
<ListView
    Grid.Row="1"
    Grid.Column="1"
    ItemsSource="{Binding ProductList}"
>
    <ListView.ItemContainerStyle>
        <Style 
            TargetType="ListViewItem">
            <Setter 
                Property="HorizontalContentAlignment"
                Value="Stretch" />
        </Style>
    </ListView.ItemContainerStyle>
    ...
```

Теперь окно должно выглядеть как положено:

![](../img/cs006.png)

## Расчёт материалов

Материалы (название и цену) мы можем взять из таблицы **Material**, которая связана с продуктами (**Product**) отношением *многие-ко-многим* через таблицу **ProductMaterial**. Массив этих связей мы в продукты уже включили, осталось выбрать материалы: 

```cs
private string? _materialString = null;
private double _materialSum = 0;

public string MaterialString
{
    get
    {
        if (_materialString == null)
        {
            using (var context = new ksmirnovContext())
            {
                _materialString = "";
                foreach (var item in ProductMaterials)
                {
                    var material = context.Materials
                        .Where(m => m.Id == item.MaterialId).First();
                    _materialString += material?.Title + ", ";
                    _materialSum += Convert.ToDouble(material?.Cost ?? 0) * (item.Count ?? 0);
                }
            }
        }
        return _materialString;
    }
}

public double MaterialSum
{
    get {
        return _materialSum;
    }
}
```

Что тут происходит?

**Во-первых**, чтобы каждый раз не пересчитывать данные мы их кешируем:

```cs
private string? _materialString = null;
```

Если материалы продукта вычисляются в первый раз (значение равно **null**), то происходит реальное чтение из базы, иначе возвращаем ранее вычисленное значение.

**Во-вторых**, перебираем список материалов и формируем строку и сумму материалов

```cs
// перебираем массив материалов продукта
foreach (var item in ProductMaterials)
{
    // ищем материал по его Id
    var material = context.Materials
        .Where(m => m.Id == item.MaterialId).First();
    // формируем строку
    _materialString += material?.Title + ", ";
    // и цену, учитывая количество материалов
    _materialSum += Convert.ToDouble(material?.Cost ?? 0) * (item.Count ?? 0);
}
```

Теперь отображается всё что требуется по заданию, причём мы не написали ни одного запроса к БД, всё за нас сделал ORM фреймворк.

![](../img/cs007.png)

# Вывод данных "плиткой"

Такое задание было на одном из прошлых соревнований WorldSkills, вполне вероятно что появится и на демо-экзамене.

Компоненты **ListBox** и **ListView** по умолчанию инкапсулируют все элементы списка в специальную панель **VirtualizingStackPanel**, которая располагает все элементы по вертикали. Но с помощью свойства **ItemsPanel** можно переопределить панель элементов внутри списка. 

Мы будем использовать уже знакомую вам **WrapPanel**:

```xml
<ListView.ItemsPanel>
    <ItemsPanelTemplate>
        <WrapPanel 
            HorizontalAlignment="Center" />
    </ItemsPanelTemplate>
</ListView.ItemsPanel>
```

>Атрибут *HorizontalAlignment* используем, чтобы "плитки" центрировались.

![](../img/01072.png)

Как видим, элементы отображаются горизонтальным списком, но нет переноса. Для включения переноса элементов нужно в **ListView** отключить горизонтальный скролл, добавив атрибут `ScrollViewer.HorizontalScrollBarVisibility="Disabled"`:

![](../img/01073.png)

Свойство *ItemContainerStyle* уже не нужно и его можно убрать.

Размеры наших элементов по-прежнему зависят от содержимого - тут надо править шаблон **ItemTemplate**.

Итоговая разметка для вывода "плиткой" должна выглядеть примерно так:

```xml
<ListView
    ItemsSource="{Binding ProductList}"
    x:Name="ListView"
    ScrollViewer.HorizontalScrollBarVisibility="Disabled" 
>
    <ListView.ItemsPanel>
        <ItemsPanelTemplate>
            <WrapPanel 
                HorizontalAlignment="Center" />
        </ItemsPanelTemplate>
    </ListView.ItemsPanel>

    <!--ListView.ItemContainerStyle>
        <Style 
            TargetType="ListViewItem">
            <Setter 
                Property="HorizontalContentAlignment"
                Value="Stretch" />
        </Style>
    </-->
    
    
    <ListView.ItemTemplate>
        ...
    </ListView.ItemTemplate>
</ListView>    
```

<table style="width: 100%;"><tr><td style="width: 40%;">
<a href="../articles/cs_mysql_connection3.md">Создание подключения к БД MySQL. Получение данных с сервера.
</a></td><td style="width: 20%;">
<a href="../readme.md">Содержание
</a></td><td style="width: 40%;">
<a href="../articles/cs_pagination.md">Пагинация, сортировка, фильтрация, поиск
</a></td><tr></table>