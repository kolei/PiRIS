Литерал | Значение
:------:|---------
y       | Год (2021, 21)
M       | Номер месяца (1..12)
d       | День месяца (1..31)
H       | Часы
m       | Минуты
s       | Секунды
''      | Любой литерал

// разбор простой MySQL даты, тут практически нет подводных камней
tempDate = LocalDateTime.parse(
    "2021-11-16 10:12:13", 
    DateTimeFormatter.ofPattern("y-M-d H:m:s")
)

// разбор ISO даты, нужно экранировать символ "Т" и обрезать лишнюю часть строки 
tempDate = LocalDateTime.parse(
    "2021-11-16T10:12:13Z".substring(0,19), 
    DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")
)

// текущее дата/время
LocalDateTime.now()

// преобразование даты в строку нужного формата
DateTimeFormatter.ofPattern("dd.MM.yyyyy").format(date)