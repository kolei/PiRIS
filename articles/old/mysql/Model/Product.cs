using mysql.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace mysql.Model
{
    public class Product
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string ArticleNumber { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public int ProductionPersonCount { get; set; }
        public int ProductionWorkshopNumber { get; set; }
        public decimal MinCostForAgent { get; set; }

        // public string ProductTypeTitle { get; set; }
        // public int ProductTypeID { get; set; }
        public ProductType CurrentProductType { get; set; }

        public string MaterialString { get; set; }
        public string Total { get; set; }
        public int DaysFromLastSale { get; set; }

        public string LinqTitle {
            get {
                return Globals.ProductTypeList
                    .Where(t=>t.ID== CurrentProductType.ID)
                    .Select(t=>t.Title)
                    .FirstOrDefault();
            }
        }

        public Uri ImagePreview {
            get {
                var imageName = Environment.CurrentDirectory + (Image ?? "");
                return System.IO.File.Exists(imageName) ? new Uri(imageName) : null;
            }
        }

        public string TypeAndName {
            get {
                return CurrentProductType.Title+" | "+Title;
            }
        }

        public string BackgroundColor
        {
            get
            {
                if (DaysFromLastSale > 30) return "#fee";
                return "#fff";
            }
        }

    }
}
