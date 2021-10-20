using System;
using System.Collections.Generic;
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
    /// Логика взаимодействия для EnterMinCostForAgentWindow.xaml
    /// </summary>
    public partial class EnterMinCostForAgentWindow : Window
    {
        public decimal Result;

        public EnterMinCostForAgentWindow(decimal AvgCost)
        {
            InitializeComponent();
            CostTextBox.Text = AvgCost.ToString();
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                Result = Convert.ToDecimal(CostTextBox.Text);
                DialogResult = true;
            }
            catch (Exception)
            {
                MessageBox.Show("Стоимость должна быть числом");
            }
        }
    }
}
