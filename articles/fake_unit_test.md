<table style="width: 100%;"><tr><td style="width: 40%;">
<a href="../articles/5_3_1_10_unit_test.md">Создание UNIT-тестов
</a></td><td style="width: 20%;">
<a href="../readme.md">Содержание
</a></td><td style="width: 40%;">
<a href="../articles/fake_unit_test.md">Fake data. Тестирование методов получающих внешние данные из удалённых источников.
</a></td><tr></table>

# Fake data. Тестирование методов получающих внешние данные из удалённых источников.

На прошлой лекции мы тестировали простые локальные методы, которые далают какие-то вычислительные задачи. Но нам нужно тестировать наше приложение, которое общается с внешним миром - получает данные от SQL-сервера или через АПИ. 

В экосистеме Microsoft есть возможность создавать поддельное (fake) окружение, но эта фича доступна только в Enterprise версии и нам недоступна. Поэтому окружение мы будем симулировать данными поддельного провайдера данных.

Чтобы поддельные данные можно было использовать не только при тестировании, но и в основном приложении, слой данных выделим в библиотеку классов

1. Вынесите все классы модели, а также класс **Global** и интерфейс **IDataProvider** в библиотеку классов **DataProviderLib** (проект создавайте в этом же решении)

2. В основной проект добавьте ссылку на созданную библиотеку.

3. Бизнес-логику удаления/добавления записей перенестие в классы моделей.

4. Добавьте в решение ещё одну библиотеку классов **FakeDataProviderLib**, в которой реализуйте класс FakeDataProvider, наследующий интерфейс **IDataProvider** (соответственно, в неё тоже нужно добавить ссылку на **DataProviderLib**)

5. В решение добавьте проект UNIT-тестов и добавьте в него ссылки на библиотеки **DataProviderLib** и **FakeDataProviderLib**. Напишите тесты для добавления и удаления продукции. При инициализации тестов Globals.DataProvider присваиваем наш FakeDateProvider.