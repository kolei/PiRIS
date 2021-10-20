using mysql.Model;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace mysql.Classes
{
    class MySQLDataProvider: IDataProvider
    {
        private MySqlConnection Connection;
        private List<ProductType> ProductTypes = null;

        public MySQLDataProvider()
        {
            try
            {
                Connection = new MySqlConnection("Server=kolei.ru;Database=i31;port=3306;UserId=i31;password=qzesc;");
            }
            catch (Exception)
            {
            }
        }

        public IEnumerable<Product> GetProducts()
        {
            List<Product> ProductList = new List<Product>();
            string Query = @"SELECT 
                p.*,
                pt.Title AS ProductTypeTitle,
                pp.MaterialList, pp.Total,Sales.DaysFromLastSale
            FROM
                Product p
            LEFT JOIN
                ProductType pt ON p.ProductTypeID = pt.ID
            LEFT JOIN
                (
                SELECT
                    pm.ProductID,
                    GROUP_CONCAT(m.Title SEPARATOR ', ') as MaterialList, 
                    SUM(pm.Count * m.Cost / m.CountInPack) as Total
                FROM
                    Material m,
		            ProductMaterial pm
                WHERE m.ID = pm.MaterialID
                GROUP BY ProductID
                ) pp ON pp.ProductID = p.ID
            LEFT JOIN 
            (
                select 
                    ProductID, 
                    DATEDIFF(NOW(), max(SaleDate)) as DaysFromLastSale
                from 
                    ProductSale
                group by ProductID
            ) Sales on Sales.ProductID = p.ID";

            try
            {
                Connection.Open();
                try
                {
                    MySqlCommand Command = new MySqlCommand(Query, Connection);
                    MySqlDataReader Reader = Command.ExecuteReader();

                    while (Reader.Read())
                    {
                        Product NewProduct = new Product();
                        NewProduct.ID = Reader.GetInt32("ID");
                        NewProduct.Title = Reader.GetString("Title");
                        NewProduct.ArticleNumber = Reader.GetString("ArticleNumber");
                        NewProduct.ProductionPersonCount = Reader.GetInt32("ProductionPersonCount");
                        NewProduct.ProductionWorkshopNumber = Reader.GetInt32("ProductionWorkshopNumber");
                        NewProduct.MinCostForAgent = Reader.GetInt32("MinCostForAgent");

                        // Методы Get<T> не поддерживают работу с NULL
                        // для полей, в которых может встретиться NULL (а лучше для всех)
                        // используйте следующий синтаксис
                        NewProduct.Description = Reader["Description"].ToString();
                        NewProduct.Image = Reader["Image"].ToString();

                        // NewProduct.ProductTypeID = Reader.GetInt32("ProductTypeID");
                        // NewProduct.ProductTypeTitle = Reader["ProductTypeTitle"].ToString();
                        NewProduct.CurrentProductType = GetProductType(Reader.GetInt32("ProductTypeID"));

                        NewProduct.MaterialString = Reader["MaterialList"].ToString();
                        NewProduct.Total = Reader["Total"].ToString();

                        NewProduct.DaysFromLastSale = (Reader["DaysFromLastSale"] as int?) ?? 999;

                        ProductList.Add(NewProduct);
                    }
                }
                finally
                {
                    Connection.Close();
                }
            }
            catch (Exception)
            {
            }

            return ProductList;
        }

        private ProductType GetProductType(int Id)
        {
            GetProductTypes();
            return ProductTypes.Find(pt => pt.ID == Id);
        }

        public IEnumerable<ProductType> GetProductTypes()
        {
            if (ProductTypes == null)
            {
                ProductTypes = new List<ProductType>();
                string Query = "SELECT * FROM ProductType";

                try
                {
                    Connection.Open();
                    try
                    {
                        MySqlCommand Command = new MySqlCommand(Query, Connection);
                        MySqlDataReader Reader = Command.ExecuteReader();

                        while (Reader.Read())
                        {
                            ProductType NewProductType = new ProductType();
                            NewProductType.ID = Reader.GetInt32("ID");
                            NewProductType.Title = Reader.GetString("Title");

                            ProductTypes.Add(NewProductType);
                        }
                    }
                    finally
                    {
                        Connection.Close();
                    }
                }
                catch (Exception)
                {
                }

            }
            return ProductTypes;
        }

        public void SetAverageCostForAgent(List<int> ProductIds, decimal NewCost)
        {
            try
            {
                Connection.Open();
                try
                {
                    string Query = "UPDATE Product SET MinCostForAgent=@MinCostForAgent WHERE ID=@ID";

                    foreach (int item in ProductIds)
                    {
                        MySqlCommand Command = new MySqlCommand(Query, Connection);
                        Command.Parameters.AddWithValue("@MinCostForAgent", NewCost);
                        Command.Parameters.AddWithValue("@ID", item);
                        Command.ExecuteNonQuery();
                    }
                }
                finally
                {
                    Connection.Close();
                }
            }
            catch (Exception)
            {
            }
        }

        public void SaveProduct(Product ChangedProduct)
        {
                Connection.Open();
                try
                {
                    if (ChangedProduct.MinCostForAgent < 0)
                        throw new Exception("Цена продукта не может быть отрицательной");


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
    }

}
