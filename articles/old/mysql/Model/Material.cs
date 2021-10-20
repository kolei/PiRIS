using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace mysql.Model
{
    public class Material
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public int CountInPack { get; set; }
        public string Unit { get; set; }
        public double CountInStock { get; set; }
        public double MinCount { get; set; }
        public string Description { get; set; }
        public decimal Cost { get; set; }
        public string Image { get; set; }
        public int MaterialTypeID { get; set; }
    }
}
