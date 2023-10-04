Предыдущая лекция |  | Следующая лекция
:----------------:|:----------:|:----------------:
[Вывод данных согласно макету (ListBox, Image)](../articles/cs_layout2.md) | [Содержание](../readme.md) | [Подсветка элементов по условию. Дополнительные выборки.](../articles/cs_coloring2.md)

# Продолжаем реализовывать макет

>Нужно вспомнить материалы прошлогодних лекций про [INotifyPropertyChanged](https://github.com/kolei/OAP/blob/master/articles/wpf_filtering.md)

* [Пагинация](#пагинация)
* [Сортировка](#сортировка)
* [Фильтрация](#фильтрация)
* [Поиск](#поиск)

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

Тут всё просто. Нам в любом случае придется делать *геттер* для фильтрованного списка продукции. Сразу в этом геттере и сделаем выборку данных порциями. Для этого используются методы LINQ-запросов **Skip(N)** (пропустить) и **Take(N)** (получить), где N - количество пропускаемых и выбираемых элементов соответсвенно.

```cs
// КЛАСС ГЛАВНОГО ОКНА

// тут у нас будет храниться полный список продукции
private IEnumerable<Product> _productList;

private const int PAGE_LEN = 20;
// тут мы храним номер текущей страницы
private int _currentPage = 0;

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
        var res = _productList;

        // тут будет поиск, сортировка и фильтрация

        res = res.Skip(PAGE_LEN * currentPage).Take(PAGE_LEN);

        return res;
    } 
    set {
        _productList = value;
        Invalidate();
    }
}
```

## Динамический вывод номеров страниц 

>Для пагинатора используем третью строку главной сетки

1. В вёрстке использовать горизонтальный **ListBox** (есть в прошлой версии про вёрстку плиткой)

    ```xml
    <ListBox
        x:DataType="system:String"
        ItemsSource="{Binding PageList}"
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
    </ListView>
    ```

1. В **классе окна** объявить массив **pageList** и в **геттере списка продукции** заполнять его

    ```cs
    public List<String> pageList { get; set; } = new List<String>();

    ...

    // в геттере списка продукции после поиска и фильтрации
    pageList.Clear();
    pageList.Add("<");
    for (int i = 1; i < (res.Count() / PAGE_LEN) + 1; i++){
        pageList.Add(i.ToString());
    }
    pageList.Add(">");

    // не забываем уведомить визуальный интерфейс о том, что список страниц изменился
    Invalidate("pageList");
    
    res = res.Skip(PAGE_LEN*currentPage).Take(PAGE_LEN);

    return res;
    ```

1. Метод **Invalidate** с указанием изменившегося элемента

    ```cs
    private void Invalidate(string ComponentName = "productList") 
    {
        if (PropertyChanged != null)
            PropertyChanged(
                this, 
                new PropertyChangedEventArgs(ComponentName));
    }
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
                if (currentPage > 0) currentPage--;
                return;
            case ">":
                // переход на следующую страницу с проверкой счётчика
                if (currentPage < productList.Count() / PAGE_LEN) currentPage++;
                return;
            default:
                // в остальных элементах просто номер странцы
                // учитываем, что номера страниц начинаются с 0
                currentPage = Convert.ToInt32(
                    (sender as TextBlock).Text) - 1;
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
            x:DataType="system:String"
            ItemsSource="{Binding #root:sortList}"/>
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

1. И дорабатываем геттер списка продукции

    ```cs
    get {
        var res = _productList;

        switch (sortType)
        {
            // сортировка по названию продукции
            case 1:
                res = res.OrderBy(p => p.Title);
                break;
            case 2:
                res = res.OrderByDescending(p => p.Title);
                break;
            // остальные сортировки реализуйте сами
        }
        ...
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

    ```cs
    public List<ProductType> ProductTypeList { get; set; }

    ...

    ProductTypeList = context.ProductTypes.ToList();
    ProductTypeList.Insert(0, new ProductType { Title = "Все типы продукции" });
    ```

1. В разметке в панель элементов управления (WrapPanel) добавляем выпадающий список

    ```xml
    <ComboBox
        Width="150"
        x:Name="ProductTypeFilter"
        SelectedIndex="0"
        SelectionChanged="ProductTypeFilter_SelectionChanged"
        x:DataType="model:ProductType"
        ItemsSource="{Binding #root.productTypeList}"/>
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
    private int ProductTypeFilterId = 0;

    private void ProductTypeFilter_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        // запоминаем ID выбранного типа
        ProductTypeFilterId = (ProductTypeFilter.SelectedItem as ProductType).ID;
        Invalidate();
    }
    ```

1. И опять дорабатываем геттер списка продукции

    ```cs
    ...
    var res = _productList;

    // действия, которые уменьшают размер выборки помещаем вверх
    if (productTypeFilterId > 0)
        res = res.Where(
            p => p.ProductTypeId == productTypeFilterId);

    switch (sortType)
    ...
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
    if (searchFilter != "")
        res = res.Where(
            p => p.Title.IndexOf(searchFilter, 
                    StringComparison.OrdinalIgnoreCase) >= 0 ||
                 p.Description?.IndexOf(searchFilter, 
                    StringComparison.OrdinalIgnoreCase) >= 0
        );
    ```
    
---

Предыдущая лекция |  | Следующая лекция
:----------------:|:----------:|:----------------:
[Вывод данных согласно макету (ListBox, Image)](../articles/cs_layout2.md) | [Содержание](../readme.md) | [Подсветка элементов по условию. Дополнительные выборки.](../articles/cs_coloring2.md)
