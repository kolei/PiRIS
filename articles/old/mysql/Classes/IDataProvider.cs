using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using mysql.Model;

namespace mysql.Classes
{
    interface IDataProvider
    {
        IEnumerable<Product> GetProducts();
        IEnumerable<ProductType> GetProductTypes();
        void SetAverageCostForAgent(List<int> ProductIds, decimal NewCost);
        void SaveProduct(Product ChangedProduct);
    }
}
