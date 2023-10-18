Предыдущая лекция |  | Следующая лекция
:----------------:|:----------:|:----------------:
[Создание, изменение, удаление продукции](./cs_edit_product2.md) | [Содержание](../readme.md#тема-514-c-и-mysql) | [API. REST API. Создание сервера ASP.NET Core.](./api_asp_net_core.md)

# Вывод списка материалов продукта. CRUD материалов продукта

>**CRUD** - аббревиатура от слов **C**reate, **R**ead, **U**pdate, **D**elete - основные операции, которые вы должны уметь реализовывать с любым набором данных.

>**Задание:**
>Необходимо реализовать вывод списка материалов, используемых при производстве продукции, с указанием количества. В список можно добавлять новые позиции и удалять существующие. При добавлении материалы должны выбираться из выпадающего списка с возможностью поиска по наименованию.

Сначала хотел, чтобы этот материал вы сделали самостоятельно, но при реализации возникло несколько новых моментов, поэтому распишу в этой лекции

* [Read](#read-вывод-списка)
* [Delete](#delete-удаление-материала-продукта)

В итоге должно получиться что-то подобное (список материалов продукта под картинкой):

![](../img/cs008.png)

## Read (вывод списка)

Получаем из базы список материалов *редактируемого продукта* и выводим этот список используя **ListView**

1. Получение списка материалов редактируемого продукта. 

    Список формируем в конструкторе окна **EditProductWindow**. 
    
    Материалы продукта (в принципе это очевидно по названию) хранятся в таблице **ProductMaterial**. Это, так называемая, **таблица связей**  - реализация отношения *многие (продукты) - ко - многим (материалам)*. При чтении надо учитывать, что нам нужны материалы только редактируемого продукта, т.е. указать фильтр по редактируемому продукту при выборке: 

    ```cs
    public IEnumerable<ProductMaterial> ProductMaterialList { get; set; }

    public EditProductWindow(Product EditProduct)
    {
        InitializeComponent();
        DataContext = this;
        CurrentProduct = EditProduct;
        using (var context = new dbContext())
        {
            ProductTypeList = context.ProductTypes.ToList();
        }

        // то что выше у вас уже было

        // чтение списка материалов завернём в отдельный метод,
        // т.к. его придётся перечитывать при удалении, редактировании и добавлении   
        LoadProductMaterials();
    }

    private LoadProductMaterials()
    {
        using (var context = new dbContext())
        {
            ProductMaterialList = context.ProductMaterials
                // фильтр по продукту
                .Where(pm => pm.ProductId == CurrentProduct.Id)
                // включая информацию о материалах (нам нужно название)
                .Include(pm => pm.Material)
                .ToList();
        }
        Invalidate("ProductMaterialList");
    }
    ```

2. Вывод списка материалов продукта

    Тут обычный **ListView**, но в качестве одного из элементов мы нарисуем кнопку "Удалить", чтобы удалять элемент списка можно было не заходя в окно редактирования

    ```xml
    <ListView
        ItemsSource="{Binding ProductMaterialList}"
        x:Name="ProductMaterialtListView" 
        MouseDoubleClick="ProductMaterialtListView_MouseDoubleClick"
    >
        <ListView.ItemContainerStyle>
            <Style 
                TargetType="ListViewItem"
            >
                <Setter 
                    Property="HorizontalContentAlignment"
                    Value="Stretch" />
            </Style>
        </ListView.ItemContainerStyle>
        <ListView.ItemTemplate>
            <DataTemplate>
                <Grid >
                    <!-- в списке 3 колонки: название материала, количество и кнопка удаления -->
                    <Grid.ColumnDefinitions>
                        <ColumnDefinition/>
                        <ColumnDefinition Width="auto"/>
                        <ColumnDefinition Width="auto"/>
                    </Grid.ColumnDefinitions>
                    <!-- тут вы уже должны сами сообразить как получить название материала -->
                    <TextBlock 
                        Text="{Binding Material}"/>
                    <!-- этой колонке добавим границы слева и справа -->
                    <TextBlock     
                        Grid.Column="1" 
                        Margin="10,0"
                        Text="{Binding Count}"/>
                    <!-- кнопка "удалить" -->
                    <TextBlock
                        x:Name="DeleteMaterialTextBlock" 
                        Grid.Column="2"
                        Tag="{Binding Path=.}"
                        Text="🗑" 
                        MouseDown="DeleteMaterialTextBlock_MouseDown"/>
                </Grid>
            </DataTemplate>
        </ListView.ItemTemplate>
    </ListView>
    ```

    Рассмотрим подробнее реализацию кнопки "Удалить":

    - вместо элемента **Button** используем элемент **TextBlock** (стандартная кнопка выглядит слишком тяжеловесно в списке)
    - в качестве текста используем UTF символ корзины 
    - для того чтобы знать на каком элементе списка мы кликнули, сохраняем в атрубуте **Tag** ссылку на текущий элемент списка (**Path=.**). Атрибут **Tag** есть у всех визуальных элементов и в нём может храниться любой объект. 

## Delete (удаление материала продукта)

Реализуем обработчик клика по кнопке удаления:

```cs
private void DeleteMaterialTextBlock_MouseDown(object sender, MouseButtonEventArgs e)
{
    // sender (в параметрах метода) содержит указатель на визуальный элемент, по которому мы кликнули
    // (sender as TextBlock) приводит объект к типу TextBlock
    // (sender as TextBlock).Tag as ProductMaterial - атрибут Tag мы приводим к классу ProductMaterial
    var productMaterial = (sender as TextBlock).Tag as ProductMaterial;

    using (var context = new dbContext())
    {
        // при поиске удаляемого материала нужно учитывать, 
        // что у него составной первичный ключ и указывать поля ключа 
        // в том же порядке, в котором они перечислены в первичном ключе
        var deletedProductMaterial = context.ProductMaterials
            .Find(productMaterial.ProductId, productMaterial.MaterialId);

        context.ProductMaterials.Remove(deletedProductMaterial);
        
        if (context.SaveChanges() > 0)
            LoadProductMaterials();
    }
}
```

Составной первичный ключ в таблице **ProductMaterial**

![](../img/cs009.png)

---

Предыдущая лекция |  | Следующая лекция
:----------------:|:----------:|:----------------:
[Создание, изменение, удаление продукции](./cs_edit_product2.md) | [Содержание](../readme.md#тема-514-c-и-mysql) | [API. REST API. Создание сервера ASP.NET Core.](./api_asp_net_core.md)
