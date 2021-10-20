using mysql.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace mysql.Classes
{
    class Globals
    {
        public static IDataProvider DataProvider;
        public static IEnumerable<ProductType> ProductTypeList { get; set; }
    }
}
