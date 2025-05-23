# Разработка и тестирование библиотеки расчета списка доступного времени бронирования столика в ресторане

## Техническое задание на разработку библиотеки

* название библиотеки: `RestaurantHelpers.dll`
* Название класса: `Booking`
* Название метода: `CalcTimeList`

В параметрах библиотеке передаются:

* JSON-строка со временем работы ресторана по дням недели, время работы задано строкой в формате "HH:MM-HH:MM", например:

    ```json
    {
        "mon": "11:00-23:00",
        "tue": "11:00-23:00",
        "wed": "11:00-23:00",
        "thu": "11:00-23:00",
        "fri": "11:00-05:00",
        "sat": "12:00-05:00",
        "sun": "12:00-03:00"
    }
    ```

* Дата и время (в формате **DataTime**), для которого нужно рассчитать список доступного времени

    ```cs
    var targetTime = new DateTime(2024, 02, 28, 10, 0, 0);
    ```

Библиотека должна возвращать список дат **IEnumerable<DateTime>** с шагом 30 минут, например:

    ```cs
    return new List<DateTime>() {
        new DateTime(targetYear, targetMonth, targetDay, 11, 0, 0),
        new DateTime(targetYear, targetMonth, targetDay, 11, 30, 0),
        new DateTime(targetYear, targetMonth, targetDay, 12, 0, 0),
        new DateTime(targetYear, targetMonth, targetDay, 12, 30, 0),
        ...
    }
    ```

Итоговая спецификация метода **CalcTimeList**

```cs
public IEnumerable<DateTime> CalcTimeList(string workTime, DateTime targetTime);
```

При расчете нужно учитывать следующие ограничения:

* при попытке заказать расчет на прошедшую дату генерировать исключение
* при заказе расчета на "сегодня" учитывать текущее время и не включать в список прошедшее время
* не включать в список время за `2` часа до завершения работы ресторана
* учитывать "ночной" режим работы. Т.е. при расчете списка на воскресение включать утренние часы, остающиеся от субботы (не конкретно эти дни, а просто проверять время работы предыдущего дня недели)

## Написать тестовые сценарии и модульные тесты для разработанной библиотеки