# Использование регулярных выражений для разбора данных в любом формате

Данные от АПИ могут приходить в разных форматах, и не всегда удобно парсить тот же XML штатными средствами. 

Но так как от АПИ мы получаем строку, то можно сделать разбор этой строки с помощью регулярных выражений (Потренироваться в написании "регулярок" можно [тут](https://regex101.com/)). 

Например, ответ от банка с курсом валют:

```xml
<ValCurs Date="08.12.2021" name="Foreign Currency Market">
    <Valute ID="R01010">
        <NumCode>036</NumCode>
        <CharCode>AUD</CharCode>
        <Nominal>1</Nominal>
        <Name>Австралийский доллар</Name>
        <Value>52,6319</Value>
    </Valute>
    <Valute ID="R01020A">
        <NumCode>944</NumCode>
        <CharCode>AZN</CharCode>
        <Nominal>1</Nominal>
        <Name>Азербайджанский манат</Name>
        <Value>43,6374</Value>
    </Valute>
    <Valute ID="R01035">
        <NumCode>826</NumCode>
        <CharCode>GBP</CharCode>
        <Nominal>1</Nominal>
        <Name>Фунт стерлингов Соединенного королевства</Name>
        <Value>98,4578</Value>
    </Valute>
    <Valute ID="R01060">
        <NumCode>051</NumCode>
        <CharCode>AMD</CharCode>
        <Nominal>100</Nominal>
        <Name>Армянских драмов</Name>
        <Value>15,0921</Value>
    </Valute>
</ValCurs>
```

Нам из всего этого, допустим, нужны **CharCode**, **Nominal**, **Value** (на самом деле нам нужен и **Name**, но я специально его пропустил)

Пишем регулярное выражение

```regexp
<CharCode>(.*?)</CharCode>.*?<Nominal>(.*?)</Nominal>.*?<Value>(.*?)</Value>
```

* **()** - группа, т.е. значение того что внутри скобок мы сможем получить после поиска
* **.*?** - означает всё что угодно в не "жадном" режиме 

В коде создаем экземпляр регулярного выражения и вытаскиваем из исходной строки все совпадения:

```kt
val re = """<CharCode>(.*?)</CharCode>.*?<Nominal>(.*?)</Nominal>.*?<Value>(.*?)</Value>""".
            toRegex(RegexOption.DOT_MATCHES_ALL)
val seq = re.findAll(result)
seq.forEach {
    Log.d("KEILOG", it.groupValues[1]+" "+it.groupValues[2]+" "+it.groupValues[3])
}
```

* в параметрах "регулярки" обязательно добавляем опцию `RegexOption.DOT_MATCHES_ALL`, иначе переносы строки не воспринимаются как "любой" символ и поиск закончится на первой строке
* **result** тут та строка, котрую вы получили в ответ на HTTP-запрос
* **findAll** позвращает sequence (последовательность) результатов поиска
* последовательность можно перебрать в цикле **forEach** и достать в нём значения (*groupValues*), которые нам нужны

Естественно в реальном приложении нужно не выводить в лог, а вставить в массив валют.

То же самое можно сделать и с JSON.

Например, распарсим данные о погоде:

```json
{"cod":"200","message":0,"cnt":40,"list":[{"dt":1638964800,"main":{"temp":-0.63,"feels_like":-5.67,"temp_min":-0.63,"temp_max":1.28,"pressure":1021,"sea_level":1021,"grnd_level":1009,"humidity":98,"temp_kf":-1.91},"weather":[{"id":500,"main":"Rain","description":"небольшой дождь","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":4.95,"deg":193,"gust":12.54},"visibility":10000,"pop":1,"rain":{"3h":0.87},"sys":{"pod":"d"},"dt_txt":"2021-12-08 12:00:00"}
```

Мне лень писать всю строку, но уже должно быть понятно

```regexp
\{\"dt\":(.*?),\"main\":\{\"temp\":(.*?),
```