<table style="width: 100%;"><tr><td style="width: 40%;">
<a href="../articles/cs_coloring.md">Подсветка элементов по условию. Дополнительные выборки.Массовая смена цены продукции.
</a></td><td style="width: 20%;">
<a href="../readme.md">Содержание
</a></td><td style="width: 40%;">
<a href="../articles/kotlin.md">Основы языка Kotlin
</a></td><tr></table>

# Добавление/редактирование продукции

>Необходимо добавить возможность редактирования данных существующей продукции, а также добавление новой продукции в новом окне - форме для добавления/редактирования продукции.
>
>Переходы на данное окно должны быть реализованы из главной формы списка: для редактирования - при нажатии на конкретный элемент, для добавления - при нажатии кнопки “Добавить продукцию”.
>
>На форме должны быть предусмотрены следующие поля: артикул, наименование, тип продукта (выпадающий список), изображение, количество человек для производства, номер производственного цеха, минимальная стоимость для агента и подробное описание (с возможностью многострочного ввода).
>
>Также необходимо реализовать вывод списка материалов, используемых при производстве продукции, с указанием количества. В список можно добавлять новые позиции и удалять существующие. При добавлении материалы должны выбираться из выпадающего списка с возможностью поиска по наименованию.
>
>При открытии формы для редактирования все поля выбранного объекта должны быть подгружены в соответствующие поля из базы данных, а таблица заполнена актуальными значениями.
>
>Стоимость продукции может включать сотые части, а также не может быть отрицательной. Система должна проверять существование продукта с введенным артикулом и не давать использовать один
артикул для нескольких продуктов.
>
>Пользователь может добавить/заменить изображение у продукции.
>
>Для того чтобы администратор случайно не изменял несколько продуктов, предусмотрите невозможность открытия более одного окна редактирования.
>
>В окне редактирования продукта должна присутствовать кнопка “Удалить”, которая удаляет продукт из базы данных. При этом должны соблюдаться следующие условия. Если у продукта есть информация о материалах, используемых при его производстве, или история изменения цен, то эта информация должна быть удалена вместе с продуктом. Но если у продукта есть информация о его продажах агентами, то удаление продукта из базы данных должно быть запрещено. После удаления продукта система должна сразу вернуть пользователя обратно к списку продукции.
>
>После редактирования/добавления/удаления продукции данные в окне списка продукции должны быть обновлены.

Критерий | Баллы
---------|:---:
Реализован переход на окно добавления | 0.1
Реализован переход на окно редактирования выбранного объекта | 0.2
Присутствуют все поля для заполнения | 0.5
При редактировании продукции в поля для ввода загружены данные из БД | 0.3
Выбор типа продукта реализован в виде выпадающего списка со значениями из БД | 0.3
Для ввода описания продукции предусмотрено многострочное поле для ввода | 0.2
***Реализован список используемых материалов для текущего продукта*** | 0.3
***В списке присутствует название материала и используемое количество*** | 0.2
***При редактировании продукции список материалов заполнен значениями из БД*** | 0.2
***В список можно добавлять новые позиции*** | 0.3
***Из списка можно удалять существующие позиции*** | 0.2
***При добавлении материалы выбираются из выпадающего списка со значениями из БД*** | 0.3
***В списке материалов реализована возможность поиска по наименованию*** | 0.2
***Список используемых материалов сохраняется в БД при добавлении*** | 0.5
***Список используемых материалов сохраняется в БД при редактировании*** | 0.5
Стоимость продукции не может быть отрицательной | 0.1
Стоимость продукции записывается только с точностью до сотых | 0.2
Реализована проверка артикула на уникальность | 0.3
Есть возможность выбрать изображение | 0.2
Изображение продукции подгружается из БД при редактировании | 0.2
Есть возможность заменить изображение | 0.1
Данные при добавлении сохраняются в БД | 0.5
Данные при редактировании изменяются в БД | 0.5
Открывается только одно окно редактирования | 0.1
*Реализовано удаление выбранного продукта, у которого не заполнен список используемых материалов* | 0.2
*Реализовано удаление продукта вместе с информацией об используемых материалах* | 0.5
*Запрещено удаление продукта, по которому были выполнены продажи агентом* | 0.3
*После удаления реализован автоматический переход обратно в список* | 0.1
После закрытия окна данные в таблице обновляются | 0.3
**Итого** | **7.9**

# Создание окна редактирования продукции

Для добавления и редактирования мы будем использовать одно и то же окно. Название окна будем вычислять по наличию ID у продукции (у новой записи это поле = 0)

1. Создайте новое окно: **EditWindow**

2. В классе окна **EditWindow** добавьте свойство *CurrentProduct*, в котором будет храниться добавляемый/редактируемый экземпляр продукции:

    ```cs
    public Product CurrentProduct { get; set; }
    ```

    И геттер для названия окна:

    ```cs
    public string WindowName {
        get {
            return CurrentProduct.ID == 0 ? "Новый продукт" : "Редактирование продукта";
        }
    }
    ```
3. В конструктор окна добавьте параметр типа **Product** и присвойте его ранее объявленному свойству:

    ```cs
    public EditWindow(Product EditProduct)
    {
        InitializeComponent();
        DataContext = this;
        CurrentProduct = EditProduct;
    }
    ```

4. В разметке окна вместо фиксированного названия вставьте привязку к свойству *WindowName*

    ```xml
    <Window
        ...
        Title="{Binding WindowName}">
    ```

5. В окне создайте сетку из трёх колонок: в первой у нас будет изображение, во второй редактируемые поля продукта, а в третей список материалов

    ```xml
    <Grid.ColumnDefinitions>
        <ColumnDefinition Width="auto"/>
        <ColumnDefinition Width="*"/>
        <ColumnDefinition Width="auto"/>
    </Grid.ColumnDefinitions>
    ```

6. Во вторую колонку добавьте **StackPanel** с границами (чтобы визуальные компоненты не прилипали к границам окна) и в этом списке разместите редактируемые элементы

    >На форме должны быть предусмотрены следующие поля: артикул, наименование, тип продукта (выпадающий список), изображение, количество человек для производства, номер производственного цеха, минимальная стоимость для агента и подробное описание

    ```xml
    <StackPanel 
        Margin="5">

        <Label Content="Артикул"/>
        <TextBox Text="{Binding CurrentProduct.ArticleNumber}"/>

        <Label Content="Наименование продукта"/>
        <TextBox Text="{Binding CurrentService.Title}"/>

        ...

    </StackPanel>
    ```

    Обычные поля наклепайте по шаблону сами, а я подробнее остановлюсь на полях: тип продукта, изображение и описание:

    * Выбор типа продукта из списка

        В классе окна объявляем свойство *ProductTypes* - список типов продукции

        ```cs
        public IEnumerable<ProductType> ProductTypes { get; set; }
        ```

        И в конструкторе получаем его из поставщика данных

        ```cs
        ProductTypes = Globals.DataProvider.GetProductTypes();
        ```

        В выпадающий список мы должны передать собственно список выбираемых объектов (*ItemsSource*) и текущий объект (*SelectedItem*) из этого списка. Но у нас в модели **Product** нет объекта **ProductType**, есть отдельные поля *ProductTypeID* и *ProductTypeTitle*. Изменим модель, вместо этих полей сделаем поле *CurrentProductType*, значение которого будем получать из списка типов по ID

        В поставщик данных добавим переменную, в которой будет храниться список типов продукции:

        ```cs
        private List<ProductType> ProductTypes = null;
        ```

        Исправим метод **GetProductTypes**, чтобы он считывал список только в первый раз (поиск объектов происходит по хешу и нам важно, чтобы этот список был всегда один и тот же)

        ```cs
        public IEnumerable<ProductType> GetProductTypes()
        {
            if (ProductTypes == null)
            {
                ProductTypes = new List<ProductType>();
                ...
        ```

        В модели **Product** убираем свойства *ProductTypeTitle*, *ProductTypeID* и добавляем *CurrentProductType* (после этого пересоберите проект и исправьте возникшие ошибки)

        ```cs
        // public string ProductTypeTitle { get; set; }
        // public int ProductTypeID { get; set; }
        public ProductType CurrentProductType { get; set; }
        ```

        И в классе **MySQLDataProvider** переделайте получение типа продукта:

        ```cs
        // NewProduct.ProductTypeID = Reader.GetInt32("ProductTypeID");
        // NewProduct.ProductTypeTitle = Reader["ProductTypeTitle"].ToString();
        NewProduct.CurrentProductType = GetProductType(Reader.GetInt32("ProductTypeID"));
        ```

        Реализация метода *GetProductType*:

        ```cs
        private ProductType GetProductType(int Id)
        {
            // тут заполнится список типов продукции, если он ещё пустой
            GetProductTypes();
            return ProductTypes.Find(pt => pt.ID == Id);
        }
        ```

        Теперь в верстке окна редактирования продукции мы можем использовать выпадающий список

        ```xml
        <ComboBox 
            ItemsSource="{Binding ProductTypes}"
            SelectedItem="{Binding CurrentProduct.CurrentProductType}"/>
        ```

    * смена изображения продукции

        Вывод изображения производится как и в главном окне

        ```xml
        <Image
            Width="200" 
            Height="200"
            Source="{Binding CurrentProduct.ImagePreview,TargetNullValue={StaticResource defaultImage}}" />
        ```

        А для смены изображения используем стандартный диалог Windows, повесив его на кнопку *Сменить картинку* (кнопку добавьте сами в **StackPanel**)

        Обработчик кнопки:

        ```cs
        private void ChangeImage_Click(object sender, RoutedEventArgs e)
        {
            OpenFileDialog GetImageDialog = new OpenFileDialog();
            // задаем фильтр для выбираемых файлов
            // до символа "|" идет произвольный текст, а после него шаблоны файлов разделенные точкой с запятой
            GetImageDialog.Filter = "Файлы изображений: (*.png, *.jpg)|*.png;*.jpg";
            // чтобы не искать по всему диску задаем начальный каталог
            GetImageDialog.InitialDirectory = Environment.CurrentDirectory;
            if (GetImageDialog.ShowDialog() == true)
            {
                // перед присвоением пути к картинке обрезаем начало строки, т.к. диалог возвращает полный путь
                CurrentProduct.Image = GetImageDialog.FileName.Substring(Environment.CurrentDirectory.Length);
                // обратите внимание, это другое окно и другой Invalidate, который реализуйте сами
                Invalidate();
            }
        }
        ```

    * Многострочное описание

        Тут просто - разрешаем переносы и задаем высоту элемента

        ```xml
        <Label Content="Описание продукта"/>
        <TextBox 
            AcceptsReturn="True"
            Height="2cm"
            Text="{Binding CurrentProduct.Description}"/>
        ```

7. Сохранение введенных данных

    В разметку добавьте кнопку **Сохранить** и напишите обработчик

    ```cs
    private void Button_Click(object sender, RoutedEventArgs e)
    {
        // вся работа с БД должна быть завернута в исключения
        try
        {
            // сюда добавлять проверки

            // метод SaveProduct реализуем ниже
            Globals.DataProvider.SaveProduct(CurrentProduct);
            DialogResult = true;
        }
        catch (Exception ex)
        {
            MessageBox.Show(ex.Message);
        }
    }
    ```

    В интерфейсе **IDataProvider** объявляем метод *SaveProduct*:

    ```cs
    void SaveProduct(Product ChangedProduct);
    ```

    И реализуем его в классе поставщика данных 

    ```cs
    public void SaveProduct(Product ChangedProduct)
    {
        Connection.Open();
        try
        {
            if (ChangedProduct.ID == 0)
            {
                // новый продукт - добавляем запись
                string Query = @"INSERT INTO Product
                (Title,
                ProductTypeID,
                ArticleNumber,
                Description,
                Image,
                ProductionPersonCount,
                ProductionWorkshopNumber,
                MinCostForAgent)
                VALUES
                (@Title,
                @ProductTypeID,
                @ArticleNumber,
                @Description,
                @Image,
                @ProductionPersonCount,
                @ProductionWorkshopNumber,
                @MinCostForAgent)";

                MySqlCommand Command = new MySqlCommand(Query, Connection);
                Command.Parameters.AddWithValue("@Title", ChangedProduct.Title);
                Command.Parameters.AddWithValue("@ProductTypeID", ChangedProduct.CurrentProductType.ID);
                Command.Parameters.AddWithValue("@ArticleNumber", ChangedProduct.ArticleNumber);
                Command.Parameters.AddWithValue("@Description", ChangedProduct.Description);
                Command.Parameters.AddWithValue("@Image", ChangedProduct.Image);
                Command.Parameters.AddWithValue("@ProductionPersonCount", ChangedProduct.ProductionPersonCount);
                Command.Parameters.AddWithValue("@ProductionWorkshopNumber", ChangedProduct.ProductionWorkshopNumber);
                Command.Parameters.AddWithValue("@MinCostForAgent", ChangedProduct.MinCostForAgent);
                Command.ExecuteNonQuery();
            }
            else
            {
                // существующий продукт - изменяем запись

                string Query = @"UPDATE Product
                SET
                Title = @Title,
                ProductTypeID = @ProductTypeID,
                ArticleNumber = @ArticleNumber,
                Description = @Description,
                Image = @Image,
                ProductionPersonCount = @ProductionPersonCount,
                ProductionWorkshopNumber = @ProductionWorkshopNumber,
                MinCostForAgent = @MinCostForAgent
                WHERE ID = @ID";

                MySqlCommand Command = new MySqlCommand(Query, Connection);
                Command.Parameters.AddWithValue("@Title", ChangedProduct.Title);
                Command.Parameters.AddWithValue("@ProductTypeID", ChangedProduct.CurrentProductType.ID);
                Command.Parameters.AddWithValue("@ArticleNumber", ChangedProduct.ArticleNumber);
                Command.Parameters.AddWithValue("@Description", ChangedProduct.Description);
                Command.Parameters.AddWithValue("@Image", ChangedProduct.Image);
                Command.Parameters.AddWithValue("@ProductionPersonCount", ChangedProduct.ProductionPersonCount);
                Command.Parameters.AddWithValue("@ProductionWorkshopNumber", ChangedProduct.ProductionWorkshopNumber);
                Command.Parameters.AddWithValue("@MinCostForAgent", ChangedProduct.MinCostForAgent);
                Command.Parameters.AddWithValue("@ID", ChangedProduct.ID);
                Command.ExecuteNonQuery();
            }
        }
        finally
        {
            Connection.Close();
        }
    }
    ```

8. Открытие окна редактирования для существующей и новой продукции

    * для редактирования существующей продукции в списке продукции реализуем обработчик двойного клика

        ```cs
        private void ProductListView_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            // в создаваемое окно передаем выбранный продукт
            var NewEditWindow = new EditWindow(ProductListView.SelectedItem as Product);
            if ((bool)NewEditWindow.ShowDialog())
            {
                // при успешном сохранении продукта перечитываем список продукции
                ProductList = Globals.DataProvider.GetProducts();
            }
        }
        ```

    * для создания нового продукта в разметке главного окна создайте кнопку "Добавить продукцию" (либо в верхней панели, либо в левой) и в её обработчике создайте новый экземпляр продукта

        ```cs
        var NewEditWindow = new EditWindow(new Product());
        ...
        ```
9. Проверки перед сохранением продукта

    Все проверки вставляем в обработчик кнопки "Сохранить" окна редактирования, т.к. это относится к бизнес-логике, до вызова метода сохранения продукта

    * Стоимость продукции не может быть отрицательной

        ```cs
        if (ChangedProduct.MinCostForAgent < 0)
            throw new Exception("Цена продукта не может быть отрицательной");
        ```

    * Стоимость продукции записывается только с точностью до сотых

    * Реализована проверка артикула на уникальность

        Тут по идее надо делать запрос к базе, но у нас есть метод получения списка продукции и мы можем искать в нём используя LINQ-запросы

<table style="width: 100%;"><tr><td style="width: 40%;">
<a href="../articles/cs_coloring.md">Подсветка элементов по условию. Дополнительные выборки.Массовая смена цены продукции.
</a></td><td style="width: 20%;">
<a href="../readme.md">Содержание
</a></td><td style="width: 40%;">
<a href="../articles/kotlin.md">Основы языка Kotlin
</a></td><tr></table>