<table style="width: 100%;"><tr><td style="width: 40%;">
<a href="../articles/cs_layout2.md">Вывод данных согласно макету (ListView, Image)
</a></td><td style="width: 20%;">
<a href="../readme.md">Содержание
</a></td><td style="width: 40%;">
<a href="../articles/cs_coloring2.md">Подсветка элементов по условию. Дополнительные выборки.
</a></td><tr></table>

Продолжаем реализовывать макет

>Нужно вспомнить материалы прошлогодних лекций про [INotifyPropertyChanged](https://github.com/kolei/OAP/blob/master/articles/wpf_filtering.md)

* [Пагинация](#пагинация)
* [Сортировка](#сортировка)
* [Фильтрация](#фильтрация)
* [Поиск](#поиск)

# Пагинация

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

Тут всё просто. Нам в любом случае придется делать геттер для фильтрованного списка продукции. Сразу в этом геттере и сделаем выборку данных порциями. Для этого используются LINQ-запросы **Skip(N)** (пропустить) и **Take(N)** (получить), где N - количество пропускаемых и выбираемых элементов соответсвенно.

```cs
// КЛАСС ГЛАВНОГО ОКНА

// тут у нас будет храниться полный список продукции
private IEnumerable<Product> _productList;

// тут мы храним номер текущей страницы
private int _currentPage = 0;

// при смене текущей страницы мы должны перерисовать список (вспоминайте про INotifyPropertyChanged)
private int currentPage {
    get {
        return _currentPage;
    }
    set {
        _currentPage = value;
        Invalidate();
    }
}

// и реализуем геттер и сеттер списка продукции
public IEnumerable<Product> productList { 
    get {
        return _ProductList.Skip(20 * CurrentPage).Take(20);
    } 
    set {
        _ProductList = value;
        Invalidate();
    }
}
```

## Динамический вывод номеров страниц 

В принципе можно руками в разметке нарисовать эти элементы, и может даже эксперты не обратят на это внимания. Но рассмотрим всё-таки ~~правильный вариант~~. 

Этот вариант рабочий, но проще сделать по [другому](#пагинация-версия-2)

<details>

<summary>Старый вариант пагинатора с программным созданием элементов</summary>

1. В разметку страницы под **ListView** добавьте **пустой** именованный **StackPanel** (горизонтальный с выравниванием по правому краю)

    ```xml
    <StackPanel 
        x:Name="Paginator"
        Margin="5"
        Grid.Row="2" 
        Grid.Column="1"
        HorizontalAlignment="Right" 
        Orientation="Horizontal"/>
    ```

2. Теперь в сеттере списка продукции динамически создадим текстовые блоки

    Таким образом, при любом изменении списка продукции будут перерисовываться и номера страниц

    ```cs
    set {
        // это остаётся как есть
        _ProductList = value;

        // очищаем содержимое пагинатора
        Paginator.Children.Clear();

        // добавляем переход на предыдущую страницу
        Paginator.Children.Add(new TextBlock { Text = " < " });

        // в цикле добавляем страницы
        for (int i = 1; i < _ProductList.Count()/20; i++)
            Paginator.Children.Add(
                new TextBlock { Text = " "+i.ToString()+" " });

        // добавляем переход на следующую страницу
        Paginator.Children.Add(new TextBlock { Text = " > " });

        // проходимся в цикле по всем сохданным элементам и задаем им обработчик PreviewMouseDown
        foreach (TextBlock tb in Paginator.Children)
            tb.PreviewMouseDown += PrevPage_PreviewMouseDown;
    }
    ```

3. И реализуем обработчик нажатия мыши на номерах страниц

    ```cs
    private void PrevPage_PreviewMouseDown(
        object sender,
        MouseButtonEventArgs e)
    {
        switch ((sender as TextBlock).Text)
        {
            case " < ":
                // переход на предыдущую страницу с проверкой счётчика
                if (CurrentPage > 0) CurrentPage--;
                return;
            case " > ":
                // переход на следующую страницу с проверкой счётчика
                if (CurrentPage < _ProductList.Count() / 20) CurrentPage++;
                return;
            default:
                // в остальных элементах просто номер странцы
                // учитываем, что надо обрезать пробелы (Trim)
                // и то, что номера страниц начинаются с 0
                CurrentPage = Convert.ToInt32(
                    (sender as TextBlock).Text.Trim() )-1;
                return;
        }   
    }
    ```
</details>

# Сортировка

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
    public string[] SortList { get; set; } = {
        "Без сортировки",
        "название по убыванию",
        "название по возрастанию",
        "номер цеха по убыванию",
        "номер цеха по возрастанию",
        "цена по убыванию",
        "цена по возрастанию" };
    ```

2. В разметке (основной Grid) добавляем контейнер для управляющих элементов (WrapPanel) и в него выпадающий список (**ComboBox**)

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
            ItemsSource="{Binding SortList}"/>
    </WrapPanel>    
    ```

3. Реализуем обработчик выбора из списка

    Запоминаем ИНДЕКС выбранного элемента

    ```cs

    private int SortType = 0;

    private void SortTypeComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        SortType = SortTypeComboBox.SelectedIndex;
        Invalidate();
    }
    ```

4. И дорабатываем геттер списка продукции

    ```cs
    get {
        var Result = _ProductList;

        switch (SortType)
        {
            // сортировка по названию продукции
            case 1:
                Result = Result.OrderBy(p => p.Title);
                break;
            case 2:
                Result = Result.OrderByDescending(p => p.Title);
                break;
            // остальные сортировки реализуйте сами
        }

        // пагинатор в самом конце
        return Result.Skip(20 * CurrentPage).Take(20);
    } 
    ```

# Фильтрация

>Кроме этого, пользователь должен иметь возможность отфильтровать данные по типу продукта. Все типы из базы данных должны быть выведены в выпадающий список для фильтрации. Первым элементом в выпадающем списке должен быть “Все типы”, при выборе которого настройки фильтра сбрасываются.

Критерий | Баллы
---------|:---:
Для фильтрации используется выпадающий список с типами продукции | 0.3
Первый элемент в списке "Все типы" | 0.2
Реализована фильтрация | 0.4
Фильтрация работает в реальном времени | 0.2
**Итого** | **1.1**

Список типов продукции мы можем получить из базы данных.

1. Создаем список продукции, заполняем его данными из базы (в конструкторе главного окна, там же где получали список продукции) и добавляем в начало пункт "Все типы продукции"

    ```cs
    public List<ProductType> ProductTypeList { get; set; }

    ...

    ProductTypeList = context.ProductTypes.ToList();
    ProductTypeList.Insert(0, new ProductType { Title = "Все типы продукции" });
    ```

2. В разметке в панель элементов управления (WrapPanel) добавляем выпадающий список

    ```xml
    <ComboBox
        Width="150"
        x:Name="ProductTypeFilter"
        SelectedIndex="0"
        SelectionChanged="ProductTypeFilter_SelectionChanged"
        ItemsSource="{Binding ProductTypeList}">
    </ComboBox>
    ```

    Элементами списка являются не строки, а объекты. В прошлом году я показывал как делать шаблон элемента списка, но как мне кажеться шаблон здесь излишен (его имеет смысл использовать если кроме названия выводится ещё что-то)

    Для преобразования объекта в строку есть метод *Object.ToString()*, и так как все объекты являются потомками класса **Object**, то нам достаточно в модели **ProductType** перегрузить это метод:

    ```cs
    public override string ToString() {
        return Title;
    }
    ```

3. Реализуем обработчик выбора элемента фильтра    

    ```cs
    private int ProductTypeFilterId = 0;

    private void ProductTypeFilter_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        // запоминаем ID выбранного типа
        ProductTypeFilterId = (ProductTypeFilter.SelectedItem as ProductType).ID;
        Invalidate();
    }
    ```

4. И опять дорабатываем геттер списка продукции

    ```cs
    ...
    var Result = _ProductList;

    // действия, которые уменьшают размер выборки помещаем вверх
    if (ProductTypeFilterId > 0)
        Result = Result.Where(
            p => p.ProductTypeID == ProductTypeFilterId);

    switch (SortType)
    ...
    ```

# Поиск

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
        x:Name="SearchFilterTextBox" 
        KeyUp="SearchFilterTextBox_KeyUp"/>
    ```

2. В коде окна запоминаем вводимую строку

    ```cs
    private string SearchFilter="";
    private void SearchFilterTextBox_KeyUp(object sender, KeyEventArgs e)
    {
        SearchFilter = SearchFilterTextBox.Text;
        Invalidate();
    }
    ```
3. И снова правим геттер списка продукции

    ```cs
    // ищем вхождение строки фильтра в названии и описании объекта без учета регистра
    if (SearchFilter != "")
        Result = Result.Where(
            p => p.Title.IndexOf(SearchFilter, StringComparison.OrdinalIgnoreCase) >= 0 ||
                p.Description?.IndexOf(SearchFilter, StringComparison.OrdinalIgnoreCase) >= 0
        );
    ```

---

В принципе всё работает, но список страниц формируется по полному списку продукции и не учитывает фильтр и поиск - перенесём этот код из сеттера в геттер. 

Ещё одна засада в том, что если мы находимся на последней странице и включаем фильтр, то сдвиг уходит за границы массива и отображается пустой список - т.е. перед выводом списка надо проверять валидность старицы

Итоговый список продукции должен выглядеть примерно так:

```cs
public IEnumerable<Product> ProductList {
    get {
        var Result = _ProductList;

        // фильтр по типу продукции
        if (ProductTypeFilterId > 0)
            Result = Result.Where(i => i.ProductTypeID == ProductTypeFilterId);

        // поиск
        // ищем вхождение строки фильтра в названии и описании объекта без учета регистра
        if (SearchFilter != "")
            Result = Result.Where(
                p => p.Title.IndexOf(SearchFilter, StringComparison.OrdinalIgnoreCase) >= 0 ||
                        p.Description?.IndexOf(SearchFilter, StringComparison.OrdinalIgnoreCase) >= 0
            );

        // сортировка
        switch (SortType)
        {
            // сортировка по названию продукции
            case 1:
                Result = Result.OrderBy(p => p.Title);
                break;
            case 2:
                Result = Result.OrderByDescending(p => p.Title);
                break;
                // остальные сортировки реализуйте сами

        }

        // пагинатор
        Paginator.Children.Clear();

        Paginator.Children.Add(new TextBlock { Text = " < " });
        for (int i = 1; i <= (Result.Count() / 20)+1; i++)
            Paginator.Children.Add(new TextBlock { Text = " " + i.ToString() + " " });
        Paginator.Children.Add(new TextBlock { Text = " > " });
        foreach (TextBlock tb in Paginator.Children)
            tb.PreviewMouseDown += PrevPage_PreviewMouseDown;

        // если текущая страница больше расчетного количества
        if (CurrentPage > Result.Count() / 20)
            CurrentPage = Result.Count() / 20;

        return Result.Skip(20 * CurrentPage).Take(20);
    } 
    set {
        _ProductList = value;
        Invalidate();
    }
}
```

# Пагинация (версия 2)

Пагинацию можно сделать проще:

1. В вёрстке использовать горизонтальный **ListView** (есть в прошлой версии про вёрстку плиткой)

    Вместо `<StackPanel Name="Paginator"...`

    ```xml
    <ListView
        ItemsSource="{Binding PageList}"
        Grid.Column="1"
        Grid.Row="2">

        <ListView.ItemsPanel>
            <ItemsPanelTemplate>
                <WrapPanel 
                    HorizontalAlignment="Right" />
            </ItemsPanelTemplate>
        </ListView.ItemsPanel>

        <ListView.ItemTemplate>
            <DataTemplate>
                <TextBlock 
                    Margin="5"
                    Text="{Binding label}" 
                    PreviewMouseDown="TextBlock_PreviewMouseDown"/>
            </DataTemplate>
        </ListView.ItemTemplate>
    </ListView>
    ```

1. В проект добавить класс **PageItem**

    ```cs
    public class PageItem
    {
        public string label { get; set; }
    }
    ```

1. В **классе окна** объявить массив **PageList** и в **геттере списка продукции** заполнять его, а не генерировать динамически содержимое для пагинатора

    ```cs
    public List<PageItem> PageList { get; set; } = new List<PageItem>();

    ...

    // в геттере
    PageList.Clear();
    PageList.Add(new PageItem { label = "<" });
    for (int i = 1; i <= (Result.Count() / 20) + 1; i++){
        PageList.Add(new PageItem { label = i.ToString() });
    }
    PageList.Add(new PageItem { label = ">" });

    // не забываем уведомить визуальный интерфейс о том, что список страниц изменился
    Invalidate("PageList");
    ```

1. Метод **Invalidate** с указанием изменившегося элемента

    ```cs
    private void Invalidate(string ComponentName = "ProductList") 
    {
        if (PropertyChanged != null)
            PropertyChanged(
                this, 
                new PropertyChangedEventArgs(ComponentName));
    }
    ```

1. Реализация обработчика клика по кнопкам пагинатора:

    ```cs
    private void TextBlock_PreviewMouseDown(object sender, MouseButtonEventArgs e)
    {
        switch ((sender as TextBlock).Text)
        {
            case "<":
                // переход на предыдущую страницу с проверкой счётчика
                if (currentPage > 0) currentPage--;
                return;
            case ">":
                // переход на следующую страницу с проверкой счётчика
                if (currentPage < _ProductList.Count() / PAGE_LEN) currentPage++;
                return;
            default:
                // в остальных элементах просто номер странцы
                // учитываем, что надо обрезать пробелы (Trim)
                // и то, что номера страниц начинаются с 0
                currentPage = Convert.ToInt32(
                    (sender as TextBlock).Text) - 1;
                return;
        }
    }
    ```
---

<table style="width: 100%;"><tr><td style="width: 40%;">
<a href="../articles/cs_layout2.md">Вывод данных согласно макету (ListView, Image)
</a></td><td style="width: 20%;">
<a href="../readme.md">Содержание
</a></td><td style="width: 40%;">
<a href="../articles/cs_coloring2.md">Подсветка элементов по условию. Дополнительные выборки.
</a></td><tr></table>
