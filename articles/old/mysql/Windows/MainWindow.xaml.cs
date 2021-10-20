using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using mysql.Classes;
using mysql.Model;
using mysql.Windows;
using MySql.Data.MySqlClient;

namespace mysql
{
    /// <summary>
    /// Логика взаимодействия для MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window, INotifyPropertyChanged
    {
        private IEnumerable<Product> _ProductList;
        private int _CurrentPage = 0;
        private int ProductTypeFilterId = 0;

        public List<ProductType> ProductTypeList { get; set; }

        public string[] SortList { get; set; } = {
            "Без сортировки",
            "название по убыванию",
            "название по возрастанию",
            "номер цеха по убыванию",
            "номер цеха по возрастанию",
            "цена по убыванию",
            "цена по возрастанию" };

        public event PropertyChangedEventHandler PropertyChanged;

        private int CurrentPage {
            get {
                return _CurrentPage;
            }
            set {
                _CurrentPage = value;
                Invalidate();
            }
        }

        private int SortType = 0;

        public IEnumerable<Product> ProductList {
            get {
                var Result = _ProductList;

                if (ProductTypeFilterId > 0)
                    Result = Result.Where(i => i.CurrentProductType.ID == ProductTypeFilterId);

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

                // ищем вхождение строки фильтра в названии и описании объекта без учета регистра
                if (SearchFilter != "")
                    Result = Result.Where(
                        p => p.Title.IndexOf(SearchFilter, StringComparison.OrdinalIgnoreCase) >= 0 ||
                             p.Description.IndexOf(SearchFilter, StringComparison.OrdinalIgnoreCase) >= 0
                    );

                Paginator.Children.Clear();

                Paginator.Children.Add(new TextBlock { Text = " < " });
                for (int i = 1; i <= (Result.Count() / 20)+1; i++)
                    Paginator.Children.Add(new TextBlock { Text = " " + i.ToString() + " " });
                Paginator.Children.Add(new TextBlock { Text = " > " });
                foreach (TextBlock tb in Paginator.Children)
                    tb.PreviewMouseDown += PrevPage_PreviewMouseDown;

                if (CurrentPage > Result.Count() / 20)
                    CurrentPage = Result.Count() / 20;

                return Result.Skip(20 * CurrentPage).Take(20);
            } 
            set {
                _ProductList = value;
                Invalidate();
            }
        }

        private void Invalidate(string ComponentName = "ProductList") {
            if (PropertyChanged != null)
                PropertyChanged(this, new PropertyChangedEventArgs(ComponentName));
        }

        public MainWindow()
        {
            InitializeComponent();
            DataContext = this;

            Globals.DataProvider = new MySQLDataProvider();
            Globals.ProductTypeList = Globals.DataProvider.GetProductTypes();
            ProductList = Globals.DataProvider.GetProducts();
            ProductTypeList = Globals.DataProvider.GetProductTypes().ToList();
            ProductTypeList.Insert(0, new ProductType { Title = "Все типы" });
        }

        private void PrevPage_PreviewMouseDown(object sender, MouseButtonEventArgs e)
        {
            switch ((sender as TextBlock).Text)
            {
                case " < ":
                    if (CurrentPage > 0) CurrentPage--;
                    return;
                case " > ":
                    if (CurrentPage < _ProductList.Count() / 20) CurrentPage++;
                    return;
                default:
                    CurrentPage = Convert.ToInt32((sender as TextBlock).Text.Trim())-1;
                    return;
            }   
        }

        private void SortTypeComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            SortType = SortTypeComboBox.SelectedIndex;
            Invalidate();
        }

        private void ProductTypeFilter_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            ProductTypeFilterId = (ProductTypeFilter.SelectedItem as ProductType).ID;
            Invalidate();
        }

        private string SearchFilter="";
        private void SearchFilterTextBox_KeyUp(object sender, KeyEventArgs e)
        {
            SearchFilter = SearchFilterTextBox.Text;
            Invalidate();
        }


        public string CostChangeButtonVisible {
            get {
                if (ProductsSelectedCount > 1) return "Visible";
                return "Collapsed";
            }
        }

        public int ProductsSelectedCount = 0;
        private void ListView_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            ProductsSelectedCount = ProductListView.SelectedItems.Count;
            Invalidate("CostChangeButtonVisible");
        }

        private void CostChangeButton_Click(object sender, RoutedEventArgs e)
        {
            decimal AvgSum = 0;
            List<int> idList = new List<int>();
            foreach (Product item in ProductListView.SelectedItems)
            {
                AvgSum += item.MinCostForAgent;
                idList.Add(item.ID);
            }

            var ww = new EnterMinCostForAgentWindow(AvgSum / ProductListView.SelectedItems.Count);

            if((bool)ww.ShowDialog())
            {
                Globals.DataProvider.SetAverageCostForAgent(idList, ww.Result);
                ProductList = Globals.DataProvider.GetProducts();
            }
        }

        private void ProductListView_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            var NewEditWindow = new EditWindow(ProductListView.SelectedItem as Product);
            if ((bool)NewEditWindow.ShowDialog())
            {
                ProductList = Globals.DataProvider.GetProducts();
            }
        }
    }
}
