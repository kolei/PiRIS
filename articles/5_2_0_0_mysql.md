# Наметки интерфейса для MySQL

"Тупой" вариант с выборкой всей таблицы

```cs
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;

namespace oap_labs
{
    class SomeTable
    {
        public int id { get; set; }
        public string value { get; set; }
    }

    interface IDataProvider
    {
        IEnumerable<SomeTable> GetSomeTables();
    }

    class MockProvider : IDataProvider
    {
        private static IEnumerable<SomeTable> DummyData = new List<SomeTable> {
            new SomeTable { id = 3, value = "333" },
            new SomeTable { id = 4, value = "444" },
        };

        public IEnumerable<SomeTable> GetSomeTables()
        {
            return DummyData;
        }
    }

    class MySQLProvider : IDataProvider
    {
        private MySqlConnection conn;

        public MySQLProvider() 
        {
            try
            {
                conn = new MySqlConnection("Server=kolei.ru;Database=test;port=3306;User Id=test;password=piris253;");
                conn.Open();
            } catch(Exception e)
            {
                Console.WriteLine($"Conn open error: {e.Message}");
            }
        }

        ~MySQLProvider()
        {
            conn?.Close();
        }

        public IEnumerable<SomeTable> GetSomeTables()
        {
            var res = new List<SomeTable>();
            MySqlCommand command = new MySqlCommand("SELECT id,value FROM test WHERE id=@id", conn);
            //command.Parameters.Add( new MySqlParameter("@id", MySqlDbType.Int32) { Value = 1 } );
            command.Parameters.Add("@id", MySqlDbType.Int32).Value = 1;
            MySqlDataReader reader = command.ExecuteReader();

            //int rowCount = command.ExecuteNonQuery(); - если ответ не нужен (insert, delete, update)

            try
            {
                while (reader.Read())
                    res.Add(new SomeTable { id = reader.GetInt32(0), value = reader.GetString(1) });
            }
            finally
            {
                reader.Close();
            }
            return res;
        }
    }

    class Globals
    {
        public static IDataProvider DataProvider;
    }

    class Program
    {
        static void Main(string[] args)
        {
            Globals.DataProvider = new MySQLProvider();
            //Globals.DataProvider = new MockProvider();

            var Items = Globals.DataProvider.GetSomeTables();
            foreach (var Item in Items)
                Console.WriteLine($"{Item.id}, {Item.value}");

            Console.ReadKey();
        }
    }
}
```


Продвинутый вариант с билдером и универсальным селектом

```cs
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;

namespace oap_labs
{
    class Test
    {
        public int id { get; set; }
        public string value { get; set; }
    }

    interface IDataProvider
    {
        IDataProvider From(string TableName);
        IDataProvider Where(Dictionary<string, string> Params);
        IEnumerable<Object> Select(Type type, params string[] Fields);
    }

    /*class MockProvider : IDataProvider
    {
        private static IEnumerable<SomeTable> DummyData = new List<SomeTable> {
            new SomeTable { id = 3, value = "333" },
            new SomeTable { id = 4, value = "444" },
        };

        public IEnumerable<SomeTable> GetSomeTables()
        {
            return DummyData;
        }
    }*/

    class MySQLProvider : IDataProvider
    {
        private MySqlConnection conn;

        private string WhereString = "";
        private string TableName = "";

        public MySQLProvider() 
        {
            try
            {
                conn = new MySqlConnection("Server=kolei.ru;Database=test;port=3306;User Id=test;password=piris253;");
                conn.Open();
            } catch(Exception e)
            {
                Console.WriteLine($"Conn open error: {e.Message}");
            }
        }

        ~MySQLProvider()
        {
            conn?.Close();
        }

        public IDataProvider From(string TableName)
        {
            this.TableName = TableName;
            WhereString = "";
            return this;
        }

        public IEnumerable<Object> Select(Type type, params string[] Fields)
        {
            var res = new List<Object>();

            string query = "";

            if (Fields.Length == 0)
                query = "SELECT *";
            else
            {
                foreach (string Field in Fields)
                    query += (query == "" ? "" : ",") + Field;

                query = $"SELECT {query}";
            }

            query = $"{query} FROM {TableName}";

            if (WhereString != "")
                query = $"{query} WHERE {WhereString}";

            MySqlCommand command = new MySqlCommand(query, conn);
            MySqlDataReader reader = command.ExecuteReader();

            try
            {
                while (reader.Read()) {
                    var newItem = Activator.CreateInstance(type);
                    for (var i = 0; i < Fields.Length; i++)
                        newItem.GetType().GetProperty(Fields[i]).SetValue(newItem, reader.GetValue(i));
                    res.Add(newItem);
                }
            }
            finally
            {
                reader.Close();
            }

            return res;
        }

        public IDataProvider Where(Dictionary<string, string> Params)
        {
            WhereString = "";
            foreach (KeyValuePair<string, string> keyValue in Params)
            {
                WhereString += (WhereString == "" ? "" : " and ") + $"{keyValue.Key}=\"{keyValue.Value}\"";
            }

            WhereString = $"({WhereString})";
            return this;
        }
    }

    class Globals
    {
        public static IDataProvider DataProvider;
    }

    class Program
    {
        static void Main(string[] args)
        {
            Globals.DataProvider = new MySQLProvider();
            //Globals.DataProvider = new MockProvider();

            var Items = Globals.DataProvider
                .From("test")
                .Where(new Dictionary<string, string> {
                    ["value"] = "one"
                })
                .Select(typeof(Test), "value", "id");

            foreach (Test Item in Items)
                Console.WriteLine($"{Item.id}, {Item.value}");

            Console.ReadKey();
        }
    }
}
```