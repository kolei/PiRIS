Предыдущая лекция |  | Следующая лекция
:----------------:|:----------:|:----------------:
[Вывод данных согласно макету (ListBox, Image)](./cs_layout2.md) | [Содержание](../readme.md#c-и-mysql) | [Подсветка элементов по условию. Дополнительные выборки.](./cs_coloring2.md)

# Продолжаем реализовывать макет

>Нужно вспомнить материалы прошлогодних лекций про [INotifyPropertyChanged](https://github.com/kolei/OAP/blob/master/articles/wpf_filtering.md)

* [Пагинация](#пагинация)
* [Сортировка](#сортировка)
* [Фильтрация](#фильтрация)
* [Поиск](#поиск)

При работе с базой данных нужно учитывать, что объем выборки может быть очень большой. Соответственно фильтр, поиск и пагинацию нужно делать запросами к базе. Но такой вариант усложняет SQL-запросы, поэтому на демо экзамене можно выбрать всю таблицу целиком, а потом использовать LINQ-запросы в геттере (как мы до этого и делали). В рамках лекции мы рассмотрим оба варианта: _правильный_ вариант с запросами к базе вы будете использовать в курсовом проекте, а _простой_ на демо экзамене.


## Пагинация

>В случае если в базе более 20 продуктов, то вывод должен осуществляться постранично (по 20 продуктов на страницу). Для удобства навигации по страницам необходимо вывести список их номеров (как на макете) с возможностью перехода к выбранной странице, а также предусмотреть переходы к предыдущей и следующей страницам.
>
>![](../img/product_list_layout.jpg)

Критерий | Баллы
---------|:---:
Данные выводятся постранично | 1
Выводится по 20 записей на странице | 0.2
Выводится список номеров страниц | 0.5
Реализован переход на выбранную в списке страницу | 0.3
Присутсвует возможность перемещаться на предыдущую и следующую страницу | 0.5 
**Итого** | **2.5**

## Постраничный вывод данных

### Простой вариант

Тут всё просто. Нам в любом случае придется делать *геттер* для фильтрованного списка продукции. Сразу в этом геттере и сделаем выборку данных порциями. Для этого используются методы **LINQ**-запросов **Skip(N)** (пропустить) и **Take(N)** (получить), где `N` - количество пропускаемых и выбираемых элементов соответсвенно.

```cs
// КЛАСС ГЛАВНОГО ОКНА

// тут у нас будет храниться полный список продукции
private IEnumerable<Product> _productList;

// размер страницы
private const int PAGE_LEN = 20;

// тут мы храним номер текущей страницы
private int _currentPage = 1;

// при смене текущей страницы мы должны перерисовать список (вспоминайте про INotifyPropertyChanged)
private int currentPage {
    get {
        return _currentPage;
    }
    set {
        _currentPage = value;
        // при смене текущей страницы перечитываем список продукции
        Invalidate();
    }
}

// и реализуем геттер и сеттер списка продукции
public IEnumerable<Product> productList { 
    get {
        var result = _productList;

        // тут будет поиск, сортировка и фильтрация

        result = result.Skip(PAGE_LEN * currentPage).Take(PAGE_LEN);

        return result;
    } 
    set {
        _productList = value;
        Invalidate();
    }
}
```

### Сложный вариант

1. В глобальные переменные добавим размер страницы (можно его хранить и в классе окна, но тогда придётся добавлять дополнительный параметр в метод _getProduct_)

    ```cs
    class Globals
    {
        public static IDataProvider dataProvider;
        public static int PAGE_LEN = 20;
    }
    ```

1. В интерфейсе **IDataProvider** в метод _getProduct_ добавляем параметр "номер страницы"

    ```cs
    public interface IDataProvider
    {
        IEnumerable<Product> getProduct(int pageNum);
    }
    ```

1. В классе **DBDataProvider** дорабатываем метод _getProduct_ с учётом номера страницы

    ```cs
    public IEnumerable<Product> getProduct(int pageNum)
    {
        using (MySqlConnection db = new MySqlConnection(connectionString))
        {
            return db.Query<Product>(
                "SELECT * FROM ProductView " +
                "LIMIT @pageLen OFFSET @offset", 
                new { 
                    pageLen = Globals.PAGE_LEN, 
                    offset = (pageNum - 1) * Globals.PAGE_LEN }
            ).ToList();
        }
    }
    ```

    Здесь предполагается, что в БД создано представление (view) **ProductView** в котором производится выборка, которую мы написали на одном из прошлых занатий.

    * **LIMIT** - оператор MySQL, который выбирает указанное количество записей

    * **OFFSET** - пропустить указанное количество записей 

1. При получении данных (в классе окна) указываем параметр

    ```cs
    productList = Globals.dataProvider.getProduct(currentPage);
    ```

## Динамический вывод номеров страниц 

### Определение количества записей

Для начала мы должны знать сколько всего записей в базе

В **простом** варианте мы можем просто использовать **LINQ** метод _Count_, который возвращает размер нашей выборки.

В **сложном** варианте мы храним только часть данных, поэтому для получения количества записей в таблице запрашиваем количество из базы:

1. В интерфейс **IDataProvider** добавляем метод _getProductCount_

    ```cs
    int getProductCount();
    ```

1. Реализуем этот метод в классе **DBDataProvider**

    ```cs
    public int getProductCount()
    {
        using (MySqlConnection db = new MySqlConnection(connectionString))
        {
            return db.QuerySingle<int>(
            "SELECT count(*) FROM ProductView");
        }
    }
    ```

    >Для получения скалярных данных используется метод _QuerySingle_

### Реализация пагинатора

1. В **классе окна** объявить массив строк **pageList**

    ```cs
    public List<String> pageList { get; set; } = new List<String>();
    ```

1. В **геттере списка продукции** заполнять его

    >Я реализую только **сложный** вариант

    ```cs
    private int productCount;

    public IEnumerable<Product> productList { 
        get {
            // перечитываю данные из БД
            var result = Globals.dataProvider.getProduct(currentPage);

            // получаю количество записей в БД
            productCount = Globals.dataProvider.getProductCount();

            // очищаю список страниц и заполняю его заново
            pageList.Clear();
            pageList.Add("<");
            for (int i = 1; i < (productCount / Globals.PAGE_LEN) + 1; i++)
            {
                pageList.Add(i.ToString());
            }
            pageList.Add(">");

            // данные пишу напрямую в визуальный компонент
            PageListListBox.ItemsSource = pageList;

            return result;
        } 
    }
    ```

>Для пагинатора используем третью строку главной сетки

1. В вёрстке использовать горизонтальный **ListBox** 

    ```xml
    <ListBox
        x:Name="PageListListBox"
        ItemsSource="{Binding pageList}"
        Grid.Column="1"
        Grid.Row="2">

        <ListBox.ItemsPanel>
            <ItemsPanelTemplate>
                <WrapPanel 
                    HorizontalAlignment="Right" />
            </ItemsPanelTemplate>
        </ListBox.ItemsPanel>

        <ListBox.ItemTemplate>
            <DataTemplate>
                <TextBlock 
                    Margin="5"
                    Text="{Binding}" 
                    PreviewMouseDown="InputElement_OnPointerPressed"/>
            </DataTemplate>
        </ListBox.ItemTemplate>
    </ListBox>
    ```

1. Реализация обработчика клика по кнопкам пагинатора:

    ```cs
    private void InputElement_OnPointerPressed(
        object? sender, PointerPressedEventArgs e)
    {
        switch ((sender as TextBlock).Text)
        {
            case "<":
                // переход на предыдущую страницу с проверкой счётчика
                if (currentPage > 1) currentPage--;
                return;
            case ">":
                // переход на следующую страницу с проверкой счётчика
                if (currentPage < productCount / Globals.PAGE_LEN) currentPage++;
                return;
            default:
                // в остальных элементах просто номер странцы
                currentPage = Convert.ToInt32(
                    (sender as TextBlock).Text
                );
                return;
        }
    }
    ```

## Сортировка

>Пользователь должен иметь возможность отсортировать продукцию (по возрастанию и убыванию) по следующим параметрам: наименование, номер производственного цеха и минимальная стоимость для агента. Выбор сортировки должен быть реализован с помощью выпадающего списка. 

Критерий | Баллы
---------|:---:
Реализована сортировка по названию продукции | 0.2
Реализована сортировка по номеру цеха | 0.2
Реализована сортировка по минимальной стоимости для агента | 0.2
Выбор сортировки реализован с помощью выпадающего списка | 0.5
Сортировка работает в реальном времени | 0.2 
**Итого** | **1.3**

В прошлом году мы делали выбор сортировки радио-кнопками, но такой вариант подходит только если сортировка по одному критерию, а у нас их три...

1. Создаем массив со списком типов сортировок

    ```cs
    public string[] sortList { get; set; } = {
        "Без сортировки",
        "название по убыванию",
        "название по возрастанию",
        "номер цеха по убыванию",
        "номер цеха по возрастанию",
        "цена по убыванию",
        "цена по возрастанию" };
    ```

1. В разметке (в первую строку основного **Grid**) добавляем контейнер для управляющих элементов (**WrapPanel**) и в него выпадающий список (**ComboBox**)

    ```xml
    <WrapPanel
        Grid.Column="1" 
        Orientation="Horizontal" 
        ItemHeight="50">
        
        <ComboBox
            Name="SortTypeComboBox"
            SelectedIndex="0"
            VerticalContentAlignment="Center"
            MinWidth="200"
            SelectionChanged="SortTypeComboBox_SelectionChanged"
            ItemsSource="{Binding sortList}"/>
    </WrapPanel>    
    ```

1. Реализуем обработчик выбора из списка

    Запоминаем ИНДЕКС выбранного элемента

    ```cs
    private int sortType = 0;

    private void SortTypeComboBox_SelectionChanged(
        object? sender, 
        SelectionChangedEventArgs e)
    {
        if (SortTypeComboBox != null)
        {
            sortType = SortTypeComboBox.SelectedIndex;
            Invalidate();
        }
    }
    ```

1. И дорабатываем геттер списка продукции. Я реализую только **сложный** вариант, **простой** вы можете посмотреть в лекциях за прошлый год

    ```cs
    get {
        // ДО выборки данных устанавливаем или сбрасываем условие сортировки (я реализовал только первые 2, остальные реализуйте сами по аналогии)
        switch (sortType)
        {
            case 0:
                Globals.dataProvider.setOrder("");
                break;
            case 1:
                Globals.dataProvider.setOrder("Title");
                break;
            case 2:
                Globals.dataProvider.setOrder("Title DESC");
                break;
        }

        var result = Globals.dataProvider.getProduct(currentPage);

        ...
    ```

    В интерфейс **IDataProvider** добавляем метод _setOrder_

    ```cs
    void setOrder(string condition);
    ```

    И реализуем его в **DBDataProvider**

    ```cs
     private string orderCondition = "";
    public void setOrder(string condition)
    {
        orderCondition = condition;
    }
    ```

    В методе _getProduct_ мы должны учесть сортировку:

    При добавлении сортировок и условий выборки код усложняется, например для добавления сортировки придётся нарисовать такой код:

    ```cs
    var sql = "SELECT * FROM ProductView ";

    if (orderCondition.Length > 0)
        sql += " ORDER BY "+orderCondition;

    sql += " LIMIT @pageLen OFFSET @offset";

    return db.Query<Product>(
        sql, 
        new { 
            pageLen = Globals.PAGE_LEN, 
            offset = (pageNum - 1) * Globals.PAGE_LEN }
    ).ToList();
    ```

    Получается очень сложно, но в счастью есть библиотеки облегчающие нам жизнь. 

    Установите через **NuGet** пакет **Dapper.SqlBuilder**

    С учётом построителя запросов получится такой код:

    ```cs
    public IEnumerable<Product> getProduct(int pageNum)
    {
        using (MySqlConnection db = new MySqlConnection(connectionString))
        {
            var builder = new SqlBuilder();

            // добавляем сортировку
            if (orderCondition.Length>0) 
                builder.OrderBy(orderCondition);

            // формируем шаблон запроса
            var template = builder.AddTemplate(
                "SELECT * FROM ProductView /**where**/ /**orderby**/ LIMIT @pageLen OFFSET @offset",
                new { 
                    pageLen = Globals.PAGE_LEN, 
                    offset = (pageNum - 1) * Globals.PAGE_LEN }
            );

            // выполняем запрос
            return db.Query<Product>(
                template.RawSql,
                template.Parameters).ToList();        
        }
    }
    ```

## Фильтрация

>Кроме этого, пользователь должен иметь возможность отфильтровать данные по типу продукта. Все типы из базы данных должны быть выведены в выпадающий список для фильтрации. Первым элементом в выпадающем списке должен быть “Все типы”, при выборе которого настройки фильтра сбрасываются.

Критерий | Баллы
---------|:---:
Для фильтрации используется выпадающий список с типами продукции | 0.3
Первый элемент в списке "Все типы" | 0.2
Реализована фильтрация | 0.4
Фильтрация работает в реальном времени | 0.2
**Итого** | **1.1**

Список типов продукции мы можем получить из базы данных.

1. Создаем список типов продукции, заполняем его данными из базы (в конструкторе главного окна, там же где получали список продукции) и добавляем в начало пункт "Все типы продукции"

    >Я не показываю реализацию метода _getProductTypes_, с этим вы уже должны справиться сами

    ```cs
    public List<ProductType> productTypeList { get; set; }

    ...

    productTypeList = Globals.dataProvider.getProductTypes().ToList();
    productTypeList.Insert(0, new ProductType { Title = "Все типы продукции" });
      ```

1. В разметке в панель элементов управления (WrapPanel) добавляем выпадающий список

    ```xml
    <ComboBox
        Width="150"
        x:Name="ProductTypeFilter"
        SelectedIndex="0"
        SelectionChanged="ProductTypeFilter_SelectionChanged"
        ItemsSource="{Binding productTypeList}"/>
    ```

    Элементами списка являются не строки, а объекты. В прошлом году я показывал как делать шаблон элемента списка, но как мне кажеться шаблон здесь излишен (его имеет смысл использовать если кроме названия выводится ещё что-то)

    Для преобразования объекта в строку есть метод *Object.ToString()*, и так как все объекты являются потомками класса **Object**, то нам достаточно в модели **ProductType** перегрузить это метод:

    ```cs
    public override string ToString() {
        return Title;
    }
    ```

1. Реализуем обработчик выбора элемента фильтра    

    ```cs
    private int productTypeFilterId = 0;

    private void ProductTypeFilter_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        // запоминаем ID выбранного типа
        productTypeFilterId = (ProductTypeFilter.SelectedItem as ProductType).ID;
        Invalidate();
    }
    ```

1. И опять дорабатываем геттер списка продукции

    >Так как в SQL запросе теперь появляются условия (where), то в интерфейс добавляем методы для добавления и очистки списка условий:
    >
    >```cs
    >private Dictionary<string, object> filters = new Dictionary<string, object>();
    >public void addFilter(string name, string value)
    >{
    >    filters.Add(name, value);
    >}
    >
    >public void clearFilter()
    >{
    >    filters.Clear();
    >}
    >```

    Перед получением данных добавляем фильтр

    ```cs
    ...

    Globals.dataProvider.clearFilter();
    if (productTypeFilterId > 0)
        Globals.dataProvider.addFilter(
            "ProductTypeID = @ProductTypeID", 
            new {ProductTypeID = productTypeFilterId}
        );

    ...
    ```

    В поставщике данных при получении данных учитываем фильтры

    ```cs
    using (MySqlConnection db = new MySqlConnection(connectionString))
    {
        var builder = new SqlBuilder();

        if (orderCondition.Length>0) 
            builder.OrderBy(orderCondition);

        if (filters.Count>0)
        {
            foreach (var item in filters)
                builder.Where(item.Key, item.Value);
        }


        var template = builder.AddTemplate(
            "SELECT * FROM ProductView /**where**/ /**orderby**/ LIMIT @pageLen OFFSET @offset",
            new { pageLen = Globals.PAGE_LEN, offset = (pageNum - 1) * Globals.PAGE_LEN }
        );

        return db.Query<Product>(
            template.RawSql,
            template.Parameters).ToList();
    }
    ```

1. При использовании фильтров нужно учитывать, что количество записей, соответствующих фильтру меньше, чем количество записей в таблице. Т.е. мы должны учитывать фильтр и в методе _getProductCount_

    ```cs
    using (MySqlConnection db = new MySqlConnection(connectionString))
    {
        var builder = new SqlBuilder();
        if (filters.Count > 0)
        {
            foreach (var item in filters)
            {
                builder.Where(item.Key, item.Value);
            }
        }
        var template = builder.AddTemplate( 
            "SELECT count(*) FROM ProductView /**where**/");
        return db.QuerySingle<int>(
            template.RawSql, 
            template.Parameters);
    }
    ```

## Поиск

>Пользователь должен иметь возможность искать конкретную продукцию, используя поисковую строку.
>
>Поиск должен осуществляться по наименованию и описанию продукта.
Поиск, сортировка и фильтрация должны происходить в реальном времени, без необходимости нажатия кнопки “найти”/”отфильтровать” и т.п. Фильтрация и поиск должны применяться совместно. Параметры сортировки, выбранные ранее пользователем, должны сохраняться и во время фильтрации с поиском.

Критерий | Баллы
---------|:---:
Реализован поиск | 0.3
Поиск работает одновременно по нескольким атрибутам | 0.2
Фильтрация и поиск работают одновременно | 0.3
Сортировка работает во время поиска и фильтрации | 0.3
**Итого** | **1.1**

1. В разметке в панель элементов управления (WrapPanel)  добавляем текстовое поле для ввода строки поиска

    ```xml
    <TextBox
        Width="200"
        VerticalAlignment="Center"
        x:Name="searchFilterTextBox" 
        KeyUp="SearchFilterTextBox_OnKeyUp"/>
    ```

1. В коде окна запоминаем вводимую строку

    ```cs
    private string searchFilter="";
    private void SearchFilterTextBox_OnKeyUp(object? sender, KeyEventArgs e)
    {
        if (SearchFilterTextBox) {
            SearchFilter = SearchFilterTextBox.Text;
            Invalidate();
        }
    }
    ```
1. И снова правим геттер списка продукции

    ```cs
    // ищем вхождение строки фильтра в названии и описании объекта без учета регистра
    if (searchFilter.Length > 0)
    {
        Globals.dataProvider.addFilter(
            //"(Title LIKE @search OR Description LIKE @search)",
            "(Title LIKE @search)",
            new { search = $"%{searchFilter}%" }
        );
    }
    ```

    Правильный вариант закомментирован, т.к. в нашем представлении (**ProductView**) нет поля _Description_. Необходимо переписать представление.
    
---

Предыдущая лекция |  | Следующая лекция
:----------------:|:----------:|:----------------:
[Вывод данных согласно макету (ListBox, Image)](./cs_layout2.md) | [Содержание](../readme.md#c-и-mysql) | [Подсветка элементов по условию. Дополнительные выборки.](./cs_coloring2.md)
