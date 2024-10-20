Предыдущая лекция | &nbsp; | Следующая лекция
:----------------:|:----------:|:----------------:
&nbsp; | [Содержание](../readme.md#мдк-0503-тестирование-информационных-систем) | [Жизненный цикл тестирования](./5_3_1_2_lifecycle.md)

>[Содрано отсюда](https://svyatoslav.biz/software_testing_book/)

# Тестирование и тестировщики

## Что такое тестирование и откуда оно появилось

В первую очередь дадим определение тестирования ПО, чтобы чётче понимать, о чём пойдёт речь.

***Тестирование программного обеспечения*** — процесс анализа программного средства и сопутствующей документации с целью выявления дефектов и повышения качества продукта.

На протяжении десятилетий развития разработки ПО к вопросам тестирования и обеспечения качества подходили очень и очень по-разному. Можно выделить несколько основных «эпох тестирования».

**В 50–60-х годах** прошлого века процесс тестирования был предельно формализован, отделён от процесса непосредственной разработки ПО и «математизирован». Фактически тестирование представляло собой скорее отладку программ (*debugging*). Существовала концепция т.н. «исчерпывающего тестирования (*exhaustive testing*)» — проверки всех возможных путей выполнения кода со всеми возможными входными данными. Но очень скоро было выяснено, что исчерпывающее тестирование невозможно, т.к. количество возможных путей и входных данных очень велико, а также при таком подходе сложно найти проблемы в документации.

**В 70-х годах** фактически родились две фундаментальные идеи тестирования: тестирование сначала рассматривалось как процесс доказательства работоспособности программы в некоторых заданных условиях (*positive testing*), а затем — строго наоборот: как процесс доказательства неработоспособности программы в некоторых заданных условиях (*negative testing*). Это внутреннее противоречие не только не исчезло со временем, но и в наши дни многими авторами совершенно справедливо отмечается как две взаимодополняющие цели тестирования.

Отметим, что «процесс доказательства неработоспособности программы» ценится чуть больше, т.к. не позволяет закрывать глаза на обнаруженные проблемы.

>Внимание! Скорее всего, именно из этих рассуждений проистекает неверное понимание того, что негативные тест-кейсы должны заканчиваться возникновением сбоев и отказов в приложении. Нет, это не так. Негативные тест-кейсы пытаются вызвать сбои и отказы, но корректно работающее приложение выдерживает это испытание и продолжает работать верно. Также отметим, что ожидаемым результатом негативных тест-кейсов является именно корректное поведение приложения, а сами негативные тест-кейсы считаются пройденными успешно, если им не удалось «поломать» приложение.

Итак, ещё раз самое важное, что тестирование «приобрело» в 70-е годы:

* тестирование позволяет удостовериться, что программа соответствует требованиям;
* тестирование позволяет определить условия, при которых программа ведёт себя некорректно.

**В 80-х годах** произошло ключевое изменение места тестирования в разработке ПО: вместо одной из финальных стадий создания проекта тестирование стало применяться на протяжении всего цикла разработки (*software lifecycle*) (также см. описание итерационной инкрементальной модели разработки ПО в лекции «Модели разработки ПО»), что позволило в очень многих случаях не только быстро обнаруживать и устранять проблемы, но даже предсказывать и предотвращать их появление.
В этот же период времени отмечено бурное развитие и формализация методологий тестирования и появление первых элементарных попыток автоматизировать тестирование.

**В 90-х годах** произошёл переход от тестирования как такового к более всеобъемлющему процессу, который называется «обеспечение качества (*quality assurance*)», охватывает весь цикл разработки ПО и затрагивает процессы планирования, проектирования, создания и выполнения тест-кейсов, поддержку имеющихся тест-кейсов и тестовых окружений. Тестирование вышло на качественно новый уровень, который естественным образом привёл к дальнейшему развитию методологий, появлению достаточно мощных инструментов управления процессом тестирования и инструментальных средств автоматизации тестирования, уже вполне похожих на своих нынешних потомков.

**В нулевые** годы нынешнего века развитие тестирования продолжалось в контексте поиска всё новых и новых путей, методологий, техник и подходов к обеспечению качества. Серьёзное влияние на понимание тестирования оказало появление гибких методологий разработки и таких подходов, как «разработка под управлением тестированием (*test-driven development, TDD*)». Автоматизация тестирования уже воспринималась как обычная неотъемлемая часть большинства проектов, а также стали популярны идеи о том, что во главу процесса тестирования следует ставить не соответствие программы требованиям, а её способность предоставить конечному пользователю возможность эффективно решать свои задачи.

О **современном** этапе развития тестирования мы будем говорить на протяжении всего остального материала. Если же отметить вкратце основные характеристики, то получится примерно такой список: гибкие методологии и гибкое тестирование, глубокая интеграция с процессом разработки, широкое использование автоматизации, колоссальный набор технологий и инструментальных средств, кросс-функциональность команды (когда тестировщик и программист во многом могут выполнять работу друг друга).

## Кто такой тестировщик и что он делает

Если поискать информацию по ключевым фразам из названия этой главы, можно найти уйму совершенно противоречивых ответов. И дело здесь в первую очередь в том, что авторы большинства «должностных обязанностей» приписывают всей профессии некий утрированный набор характеристик отдельных её представителей.

В то же время даже в ЕКСД разделены должности «специалиста по тестированию программного обеспечения» и «тестировщика программного обеспечения».

Теперь вернёмся к исходному вопросу и посмотрим на него с двух точек зрения: какова квалификация тестировщика, и где он работает.

Упрощённо отразим это в таблице.

Квалификация | Небольшие фирмы | Большие фирмы
:--:|----|-----
**Низкая** | Подмастерье, часто предоставленный сам себе в решении задач. | Рядовой участник проектов, одновременно проходящий интенсивное повышение квалификации.
**Высокая** | Мастер на все руки с богатым, но не всегда структурированным опытом. |Эксперт в одной или нескольких областях, консультант, руководитель направления. 

Поскольку чем выше квалификация специалиста, тем шире его выбор мест работы (даже в рамках одной крупной фирмы), основное внимание уделим именно квалификационным особенностям работы тестировщика.

В начале карьеры любой специалист (и тестировщик не является исключением) является исполнителем и учеником. Достаточно хорошо понимать, что такое тест-кейсы, отчёты о дефектах, уметь читать требования, пользоваться парой инструментальных средств и хорошо уживаться в команде.

Постепенно тестировщик начинает погружаться во все стадии разработки проекта, понимая их всё полнее и полнее, начинает не только активно использовать, но и разрабатывать проектную документацию, принимать всё более ответственные решения.

Если выразить образно главную цель тестировщика, то она будет звучать так: «понимать, что в настоящий момент необходимо проекту, получает ли проект это необходимое в должной мере, и, если нет, как изменить ситуацию к лучшему». Звучит похоже на цель руководителя проекта, верно? Верно. Начиная с некоторого уровня развития, IT-специалисты, по большому счёту, различаются лишь наборами технических навыков и основной областью приложения этих навыков.

Так какие же технические навыки нужны, чтобы успешно начать работать тестировщиком?

* Знание иностранных языков. Да, это не технический навык. Можете считать это аксиомой: «нет знания английского — нет карьеры в IT». Другие иностранные языки тоже приветствуются, но английский первичен.
* Уверенное владение компьютером на уровне по-настоящему продвинутого пользователя и желание постоянно развиваться в этой области. Можете ли вы представить себе профессионального повара, который не может пожарить картошку (не «не обязан», а «не умеет в принципе»)? Выглядит странно? Не менее странно выглядит «IT’шник» (именно так, в кавычках), неспособный набрать вменяемо отформатированный текст, скопировать файл по сети, развернуть виртуальную машину или выполнить любое иное повседневное рутинное действие.
* Программирование. Оно на порядки упрощает жизнь любому IT’шнику — и тестировщику в первую очередь. Можно ли тестировать без знания программирования? Да, можно. Можно ли это делать по-настоящему хорошо? Нет.
* Базы данных и язык SQL. Здесь от тестировщика тоже не требуется квалификация на уровне узких специалистов, но минимальные навыки работы с наиболее распространёнными СУБД и умение писать простые запросы можно считать обязательными.
* Понимание принципов работы сетей и операционных систем. Хотя бы на минимальном уровне, позволяющем провести диагностику проблемы и решить её своими силами, если это возможно.
* Понимание принципов работы веб-приложений и мобильных приложений. В наши дни почти всё пишется именно в виде таких приложений, и понимание соответствующих технологий становится обязательным для эффективного тестирования.

Надеюсь, вы обратили внимание на то, что самого тестирования в списке нет. Всё верно, ведь ему посвящён весь этот курс.

В завершение главы также отметим личностные качества, позволяющие тестировщику быстрее стать отличным специалистом:

* повышенная ответственность и исполнительность;
* хорошие коммуникативные навыки, способность ясно, быстро, чётко выражать свои мысли;
* терпение, усидчивость, внимательность к деталям, наблюдательность;
* хорошее абстрактное и аналитическое мышление;
* способность ставить нестандартные эксперименты, склонность к исследовательской деятельности.

Да, сложно найти человека, который бы в равной мере обладал всеми перечисленными качествами, но всегда полезно иметь некий ориентир для саморазвития.

## Что нужно знать и уметь и чему можно научиться

В предыдущей главе мы осознанно не обсуждали конкретный перечень необходимых начинающему тестировщику знаний и умений, т.к. он заслуживает отдельного рассмотрения.

Показанные ниже данные представляют собой адаптированную выжимку из карты компетенций тестировщика. Все навыки здесь условно разделены на три группы:

* Профессиональные — это именно «тестировщицкие», ключевые навыки, отличающие тестировщика от других IT-специалистов.
* Технические — это общие навыки в области IT, которыми тем не менее должен обладать и тестировщик.
* Личностные — в русском языке термин «soft skills» часто переводят как «навыки межличностного общения», но исходный термин несколько шире.

**Профессиональные навыки**

<table>
    <tr>
        <th>Предметная область</th>
        <th>Начальный уровень</th>
        <th>Уровень младшего или среднего специфлиста</th>
    </tr>
    <tr>
        <td colspan="3" style="text-align: center;">Процессы тестирования и разработки программного обеспечения</td>
    </tr>
    <tr>
        <td>Процесс тестирования ПО</td>
        <td rowspan="2">Этому вопросу посвящена глава «Процессы тестирования и разработки ПО</td>
        <td>Глубокое понимание стадий процесса тестирования, их взаимосвязи и взаимовлияния, умение планировать собственную работу в рамках полученного задания в зависимости от стадии тестирования</td>
    </tr>
    <tr>
        <td>Процесс разработки ПО</td>
        <td>Общее понимание моделей разработки ПО, их связи с тестированием, умение расставлять приоритеты в собственной работе в зависимости от стадии развития проекта</td>
    </tr>
    <tr>
        <td colspan="3" style="text-align: center;">Работа с документацией</td>
    </tr>
    <tr>
        <td>Анализ требований</td>
        <td rowspan="2">Этому вопросу посвящена глава «Тестирование документации и требований»</td>
        <td>Умение определять взаимосвязи и взаимозависимость между различными уровнями и формами представления требований, умение формулировать вопросы с целью уточнения неясных моментов</td>
    </tr>
    <tr>
        <td>Тестирование требований</td>
        <td>Знание свойств хороших требований и наборов требований, умение анализировать требования с целью выявления их недостатков, умение устранять недостатки в требованиях, умение применять техники повышения качества требований</td>
    </tr>
    <tr>
        <td>Управление требованиями</td>
        <td rowspan="2">Не требуется</td>
        <td>Общее понимание процессов выявления, документирования, анализа и модификации требований</td>
    </tr>
    <tr>
        <td>Бизнес-анализ</td>
        <td>Общее понимание процессов выявления и документирования различных уровней и форм представления требований</td>
        <td></td>
    </tr>
    <tr>
        <td colspan="3" style="text-align: center;">Оценка и планирование</td>
    </tr>
    <tr>
        <td>Создание плана тестирования</td>
        <td rowspan="3">Эти вопросы частично затронуты в лаве «Оценка трудозатрат, планирование и отчётность», но их лубокое понимание требует отдельного длительного изучения</td>
        <td>Общее понимание принципов планирования в контексте тестирования, умение использовать готовый тест-план для планирования собственной работы</td>
    </tr>
    <tr>
        <td>Создание стратегии тестирования</td>
        <td>Общее понимание принципов построения стратегии тестирования, умение использовать готовую стратегию для планирования собственной работы</td>
    </tr>
    <tr>
        <td>Оценка трудозатрат</td>
        <td>Общее понимание принципов оценки трудозатрат, умение оценивать собственные трудозатраты при планировании собственной работы</td>
        <td></td>
    </tr>
    <tr>
        <td colspan="3" style="text-align: center;">Работа с тест-кейсами</td>
    </tr>
    <tr>
        <td>Создание чек-листов</td>
        <td rowspan="2">Этому вопросу посвящена глава «Чек-листы, тест-кейсы, наборы тест-кейсов»</td>
        <td>Твёрдое умение использовать техники и подходы к проектированию тестовых испытаний, умение декомпозировать тестируемые объекты и поставленные задачи, умение создавать чек-листы</td>
    </tr>
    <tr>
        <td>Создание тест-кейсов</td>
        <td>Твёрдое умение оформлять тест-кейсы согласно принятым шаблонам, умение анализировать готовые тест-кейсы, обнаруживать и устранять имеющиеся в них недостатки</td>
    </tr>
    <tr>
        <td>Управление тест-кейсами</td>
        <td>Не требуется</td>
        <td>Общее понимание процессов создания, модификации и повышения качества тест-кейсов</td>
    </tr>
    <tr>
        <td colspan="3" style="text-align: center;">Методологии тестирования</td>
    </tr>
    <tr>
        <td>Функциональное и доменное тести-рование</td>
        <td>Этому вопросу посвящена глава «Подробная классификация тестирования»</td>
        <td>Знание видов тестирования, твёрдое умение использовать техники и подходы к проектированию тестовых испытаний, умение создавать чек-листы и тест-кейсы, умение создавать отчёты о дефектах</td>
    </tr>
    <tr>
        <td>Тестирование интерфейса пользователя</td>
        <td rowspan="6">Не требуется</td>
        <td>Умение проводить тестирование интерфейса пользователя на основе готовых тестовых сценариев или в рамках исследовательского тестирования</td>
    </tr>
    <tr>
        <td>Исследовательское тестирование</td>
        <td>Общее умение использовать матрицы для быстрого определения сценариев тестирования, общее умение проводить новые тесты на основе результатов только что выполненных</td>
    </tr>
    <tr>
        <td>Интеграционное тестирование</td>
        <td>Умение проводить интеграционное тестирование на основе готовых тестовых сценариев</td>
    </tr>
    <tr>
        <td>Локализационное тестирование</td>
        <td>Умение проводить локализационное тестирование на основе готовых тестовых сценариев</td>
    </tr>
    <tr>
        <td>Инсталляционное тестирование</td>
        <td>Умение проводить инсталляционное тестирование на основе готовых тестовых сценариев</td>
    </tr>
    <tr>
        <td>Регрессионное тестирование</td>
        <td>Общее понимание принципов организации регрессионного тестирования, умение проводить регрессионное тестирование по готовым планам</td>
    </tr>
    <tr>
        <td colspan="3" style="text-align: center;">Работа с отчётами о дефектах</td>
    </tr>
    <tr>
        <td>Создание отчётов о дефектах</td>
        <td>Этому вопросу посвящена глава «Отчёты о дефектах»</td>
        <td>Твёрдое знание жизненного цикла отчёта об ошибке, твёрдое умение создавать отчёты о дефектах согласно принятым шаблонам, умение анализировать готовые отчёты, обнаруживать и устранять имеющиеся в них недостатки</td>
    </tr>
    <tr>
        <td>Анализ причин возникновения ошибки</td>
        <td rowspan="2">Не требуется</td>
        <td>Базовое умение исследовать приложение с целью выявления источника (причины) ошибки, элементарное умение формировать рекомендации по устранению ошибки</td>
    </tr>
    <tr>
        <td>Использование баг-трекинговых систем</td>
        <td>Умение использовать баг-трекинговые системы на всех стадиях жизненного цикла отчётов о дефектах</td>
    </tr>
    <tr>
        <td colspan="3" style="text-align: center;">Работа с отчётами о результатах тестирования</td>
    </tr>
    <tr>
        <td>Создание отчётов о результатах тестирования</td>
        <td>Не требуется, но частично рассмотрено в главе «Оценка трудозатрат, планирование и отчётность»</td>
        <td>Умение предоставлять необходимую информацию для формирования отчёта о результатах тестирования, умение анализировать готовые отчёты о результатах тестирования с целью уточнения планирования собственной работы</td>
    </tr>
</table>

**Технические навыки**

<table>
    <tr>
        <th>Предметная область</th>
        <th>Начальный уровень</th>
        <th>Уровень младшего или среднего специфлиста</th>
    </tr>
    <tr>
        <td colspan="3" style="text-align: center;">Операционные системы</td>
    </tr>
    <tr>
        <td>Windows</td>
        <td>Использование на ровне уверенного пользователя</td>
        <td rowspan="3">Установка, использование и администрирование, решение проблем, конфигурирование с целью настройки тестового окружения и выполнения тест-кейсов</td>
    </tr>
    <tr>
        <td>Linux</td>
        <td>Общее знакомство</td>
    </tr>
    <tr>
        <td>Виртуальные машины</td>
        <td>Использование на уровне начинающего пользователя</td>
    </tr>
    <tr>
        <td>Mac OS</td>
        <td>Не требуется</td>
        <td>Общее знакомство</td>
    </tr>
    <tr>
        <td colspan="3" style="text-align: center;">Базы данных</td>
    </tr>
    <tr>
        <td>Реляционная теория</td>
        <td rowspan="3">Не требуется</td>
        <td>Общее понимание, умение читать и понимать схемы баз данных в общепринятых графических нотациях</td>
    </tr>
    <tr>
        <td>Реляционные СУБД</td>
        <td>Умение устанавливать, настраивать и использовать для настройки тестового окружения и выполнения тест-кейсов</td>
    </tr>
    <tr>
        <td>Язык SQL</td>
        <td>Умение писать и выполнять простые запросы с использованием инструментальных средств работы с БД/СУБД</td>
    </tr>
    <tr>
        <td colspan="3" style="text-align: center;">Компьютерные сети</td>
    </tr>
    <tr>
        <td>Сетевые протоколы</td>
        <td rowspan="2">Не требуется</td>
        <td>Общее понимание принципов работы стека TCP/IP, умение конфигурировать локальные сетевые настройки операционной системы</td>
    </tr>
    <tr>
        <td>Сетевые утилиты</td>
        <td>Общее понимание и умение использовать утилиты диагностики состояния и неполадок в сети</td>
    </tr>
    <tr>
        <td colspan="3" style="text-align: center;">Веб-технологии</td>
    </tr>
    <tr>
        <td>Веб-серверы</td>
        <td rowspan="3">Не требуется</td>
        <td>Общее понимание принципов работы веб-серверов, умение устанавливать и настраивать</td>
    </tr>
    <tr>
        <td>Серверы приложений</td>
        <td>Общее понимание принципов работы серверов приложений, умение устанавливать и настраивать</td>
    </tr>
    <tr>
        <td>Веб-сервисы</td>
        <td>Общее понимание принципов работы веб-сервисов и способов диагностики неполадок в их работе</td>
    </tr>
    <tr>
        <td>Языки разметки</td>
        <td>Общее представление об HTML и CSS</td>
        <td>Умение использовать HTML и CSS для создания простых страниц</td>
    </tr>
    <tr>
        <td>Протоколы передачи данных</td>
        <td rowspan="2">Не требуется</td>
        <td>Общее понимание принципов работы протоколов прикладного уровня OSI-модели, общее понимание принципов диагностики возникших неполадок</td>
    </tr>
    <tr>
        <td>Языки веб-программирования</td>
        <td>Начальные знания хотя бы в одном языке программирования, используемом для создания веб-приложений</td>
    </tr>
    <tr>
        <td colspan="3" style="text-align: center;">Мобильные платформы и технологии</td>
    </tr>
    <tr>
        <td>Android</td>
        <td rowspan="3">Не требуется</td>
        <td rowspan="3">Использование на уровне начинающего пользователя</td>
    </tr>
    <tr>
        <td>iOS</td>
    </tr>
    <tr>
        <td>Windows Phone</td>
    </tr>
</table>

**Личностные навыки**

<table>
    <tr>
        <th>Предметная область</th>
        <th>Начальный уровень</th>
        <th>Уровень младшего или среднего специфлиста</th>
    </tr>
    <tr>
        <td colspan="3" style="text-align: center;">Коммуникативные навыки</td>
    </tr>
    <tr>
        <td>Деловое использование e-mail</td>
        <td rowspan="2">Минимальные навыки</td>
        <td>Понимание и строгое следование правилам делового общения с использованием e-mail и сервисов мгновенных сообщений</td>
    </tr>
    <tr>
        <td>Устное деловое общение</td>
        <td>Понимание и строгое следование правилам устного делового общения</td>
    </tr>
    <tr>
        <td>Прохождение собеседований</td>
        <td>Не требуется</td>
        <td>Начальный опыт прохождения собеседований</td>
    </tr>
    <tr>
        <td colspan="3" style="text-align: center;">Навыки самоорганизации</td>
    </tr>
    <tr>
        <td>Планирование собственного времени</td>
        <td>Минимальные навыки, общие представления</td>
        <td>Развитые навыки планирования собственного времени, умение пользоваться соответствующими инструментами, умение оценивать трудозатраты в рамках полученных заданий</td>
    </tr>
    <tr>
        <td>Отчётность о своей работе</td>
        <td>Начальные навыки</td>
        <td>Развитые навыки отчётности о своей работе, умение пользоваться соответствующими инструментами</td>
    </tr>
</table>

## Мифы и заблуждения о тестировании

### Не надо разбираться в компьютерах

Без комментариев. Нет, возможно, существуют некие ничтожно малые доли процента деятельности тестировщика, которую можно реализовать «на пальцах». Но этой бесконечно малой величиной можно пренебречь.

### Обязательно надо хорошо знать программирование

Очень больно относить эту мысль к мифам. Хорошо, когда тестировщик знает программирование. Ещё лучше, когда он знает его хорошо. Но даже общих отдалённых представлений о программировании хватает для начала карьеры. А дальше уже — по обстоятельствам.

### В тестировании всё просто

Если развить аналогию, то и в кулинарии всё просто, если мы говорим о заваривании чая в пакетике. Но как подобным чаем не заканчивается кулинария, так и тестирование не заканчивается случаями «ой, тут вот картинка не загрузилась». Даже на исключительно практическом уровне задачи тестирования могут быть сопоставимы по сложности с задачами проектирования и разработки программ (хм, почему ж нет мифа «программирование — это просто», ведь «Hello, world» написать не тяжело). А если мы посмотрим на «надёжность программного обеспечения» с научной точки зрения, то перспективы роста сложности вообще ничем не ограничены. Обязательно ли каждому тестировщику «лезть в эти дебри»? Нет. Но если хочется — можно. К тому же это очень интересно.

### В тестировании куча рутины и скуки

Не больше и не меньше, чем в иных IT-профессиях. Остальное зависит от конкретного тестировщика и того, как он организует свою работу.

### Тестировщика должны всему-всему научить

Не должны. И уж тем более «всему-всему». Да, если мы говорим о явно обозначенном учебном процессе, то его организаторы (будь то предмет в университете, учебный курс в некоем тренинговом центре или отдельный тренинг внутри компании) часто берут на себя определённые «педагогические обязательства». Но подобная учебная деятельность никогда не заменит саморазвития (хотя и может в нужный момент помочь в выборе направления пути). IT-отрасль меняется очень интенсивно и непрерывно. Учиться придётся до пенсии.

### В тестировщики идут те, кто не смог стать программистом

А в скрипачи — те, кто не смог стать пианистом? Я думаю, что некий небольшой процент «не ставших программистами» в тестировании есть. Но он теряется на фоне тех, кто шёл в тестирование изначально и сознательно, а также тех, кто пришёл в тестирование из программирования.

### В тестировании сложно построить карьеру

При должном старании карьера в тестировании оказывается едва ли не самой динамичной (по сравнению с другими IT-направлениями). Тестирование само по себе — очень бурно развивающаяся отрасль IT, и здесь всегда можно выбрать что-то, что будет вам очень нравиться и хорошо получаться — а в таких условиях стать профессионалом и достичь успеха легко.

### Тестировщик «виноват во всём», т.е. с него спрос за все ошибки

Только если признать, что в болезни пациента виновен термометр, показывающий высокую температуру. Скорее с тестировщиков будет спрос за те ошибки, что были найдены пользователем, т.е. проявились уже на стадии реальной эксплуатации продукта. Но и здесь нет однозначного вывода — за конечный успех продукта отвечает вся команда, и было бы глупо перекладывать ответственность лишь на одну её часть.

### Тестировщики скоро будут не нужны, т.к. всё будет автоматизировано

Как только по улицам забегают терминаторы — да, этот миф станет правдой: программы научатся обходиться без людей. Но тогда у нас всех будут другие проблемы. А если кроме шуток, человечество уже сотни лет идёт по пути автоматизации, которая накладывает свой отпечаток на всю нашу жизнь и чаще всего позволяет переложить самую простую и не требующую квалификации работу на машины. Но кто же заставляет вас оставаться на уровне исполнителя такой работы? Начиная с некоторого уровня, тестирование превращается в гармоничное сочетание науки и искусства. А многих ли учёных или творцов заменила автоматизация?

[//TODO]: дописать_про_библиотеку_классов

Предыдущая лекция | &nbsp; | Следующая лекция
:----------------:|:----------:|:----------------:
&nbsp; | [Содержание](../readme.md#мдк-0503-тестирование-информационных-систем) | [Жизненный цикл тестирования](./5_3_1_2_lifecycle.md)
