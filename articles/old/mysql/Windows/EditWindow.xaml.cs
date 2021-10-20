using Microsoft.Win32;
using mysql.Classes;
using mysql.Model;
using System;
using System.Collections.Generic;
using System.ComponentModel;
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
using System.Windows.Shapes;

namespace mysql.Windows
{
    /// <summary>
    /// Логика взаимодействия для EditWindow.xaml
    /// </summary>
    public partial class EditWindow : Window, INotifyPropertyChanged
    {
        public Product CurrentProduct { get; set; }
        public IEnumerable<ProductType> ProductTypes { get; set; }

        public EditWindow(Product EditProduct)
        {
            InitializeComponent();
            DataContext = this;
            CurrentProduct = EditProduct;
            ProductTypes = Globals.DataProvider.GetProductTypes();
        }

        public string WindowName
        {
            get
            {
                return CurrentProduct.ID == 0 ? "Новый продукт" : "Редактирование продукта";
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;

        private void ChangeImage_Click(object sender, RoutedEventArgs e)
        {
            OpenFileDialog GetImageDialog = new OpenFileDialog();
            // задаем фильтр для выбираемых файлов
            // до символа "|" идет произвольный текст, а после него шаблоны файлов раздеренные точкой с запятой
            GetImageDialog.Filter = "Файлы изображений: (*.png, *.jpg)|*.png;*.jpg";
            // чтобы не искать по всему диску задаем начальный каталог
            GetImageDialog.InitialDirectory = Environment.CurrentDirectory;
            if (GetImageDialog.ShowDialog() == true)
            {
                // перед присвоением пути к картинке обрезаем начало строки, т.к. диалог возвращает полный путь
                // (тут конечно еще надо проверить есть ли в начале Environment.CurrentDirectory)
                CurrentProduct.Image = GetImageDialog.FileName.Substring(Environment.CurrentDirectory.Length);
                Invalidate();
            }
        }

        private void Invalidate(string ComponentName = "CurrentProduct")
        {
            if (PropertyChanged != null)
                PropertyChanged(this, new PropertyChangedEventArgs(ComponentName));
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                Globals.DataProvider.SaveProduct(CurrentProduct);
                DialogResult = true;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }
    }
}
