[содержание](/readme.md)

* [Введение](#Введение)
* [ОПРЕДЕЛЕНИЕ И КЛАССИФИКАЦИЯ ИНФОРМАЦИОННЫХ СИСТЕМ](#ОПРЕДЕЛЕНИЕ-И-КЛАССИФИКАЦИЯ-ИНФОРМАЦИОННЫХ-СИСТЕМ)
    * [ИНФОРМАЦИОННАЯ СИСТЕМА И ЕЕ ФУНКЦИИ](#ИНФОРМАЦИОННАЯ-СИСТЕМА-И-ЕЕ-ФУНКЦИИ)
    * [КЛАССИФИКАЦИЯ ИНФОРМАЦИОННЫХ СИСТЕМ](#КЛАССИФИКАЦИЯ-ИНФОРМАЦИОННЫХ-СИСТЕМ)
    * [СТРУКТУРА ИНФОРМАЦИОННОЙ СИСТЕМЫ](#СТРУКТУРА-ИНФОРМАЦИОННОЙ-СИСТЕМЫ)
* [КОНТРОЛЬНЫЕ ВОПРОСЫ](#КОНТРОЛЬНЫЕ-ВОПРОСЫ)

# Введение

Программное обеспечение в составе информационных систем (ИС) является одним из наиболее гибких видов продукции, которое нередко подвергается изменениям в течение всего времени его использования. Иногда достаточно при корректировке внести одну-две ошибки, чтобы резко снизилась надежность программного обеспечения (ПО) или его корректность при некоторых входных данных.

Для сохранения и повышения качества систем необходимо регламентировать процесс модификаций и поддерживать его соответствующим тестированием и контролем качества. В результате информационная система со временем чаще всего улучшается и по функциональным возможностям, и по качеству решения отдельных задач.

Работы, обеспечивающие контроль и повышение качества, а также развитие функциональных возможностей информационных систем, составляют процесс сопровождения, который обычно включает в себя:
* **исправление ошибок** — корректировка программ, выдающих неверные результаты в условиях, ограниченных техническим заданием и документацией;
* **регламентированная документами адаптация** к условиям конкретного использования, обусловленным характеристиками внешней среды или конфигурацией аппаратных средств, на которой предстоит функционировать программам (около 20% общих затрат);
* **модернизация** — расширение функциональных возможностей или улучшение характеристик решения отдельных задач в соответствии с новым или дополненным техническим заданием на информационную систему (до 60 % общих затрат).

В настоящее время при проектировании информационных систем используют одну из двух методологий: структурная или объектно-ориентированная. Первая рекомендует декомпозировать систему на подсистемы, решающие отдельные подзадачи. Вторая использует подход, при котором в предметной области выделяют отдельно функционирующие элементы. Поведение этих объектов
моделируется с использованием специальных средств, а затем уже из готовых объектов собирается сложная система. В основе второй методологии лежит объектная декомпозиция.

Жизненный цикл ИС практически в каждый момент времени имеет отношение к некоторому технологическому процессу, к некоторому инструментальному средству проектирования. Поэтому необходимо не только знание каждого из этих направлений, но и понимание теснейших связей и зависимостей между ними.

В современных условиях динамично развивается рынок комплексных интегрированных систем автоматизации предприятий и учреждений самого различного профиля (финансовых, промышленных, офисных) и самых различных размеров с разнообразными схемами иерархии, начиная от малых предприятий в несколько десятков человек и заканчивая крупными корпорациями с десятками тысяч сотрудников. Такие системы предназначены для решения задач как предприятия в целом (управление финансовыми ресурсами, управление запасами, планирование и производство, сбыт и снабжение и т.д.), так и уровня его производственных подразделений, цехов и участков.

Главная особенность индустрии систем автоматизации различных предприятий и учреждений, характеризующихся широкой номенклатурой входных данных с различными маршрутами обработки этих данных, состоит в концентрации сложности на начальных этапах анализа требований и проектирования спецификаций системы при относительно невысокой сложности и трудоемкости последующих этапов. Фактически здесь и происходит понимание того, что будет делать будущая система и каким образом она будет работать, чтобы удовлетворить предъявленные к ней требования. Нечеткость и неполнота системных требований, нерешенные во-просы и ошибки, допущенные на этапах анализа и проектирования, порождают на последующих этапах трудные, зачастую неразрешимые проблемы и, в конечном счете, приводят к неуспеху всей работы в целом.

С другой стороны, не существует двух одинаковых организаций. Следовательно, простое тиражирование даже очень хорошей системы управления предприятием никогда не устроит заказчика полностью, поскольку не может учесть его специфики. Кроме того, в данном случае возникает проблема выбора именно той системы, которая наиболее подходит для конкретного предприятия. Эта проблема осложняется еще и тем, что ключевые слова, характеризующие различные информационные системы, практически одни и те же:
* единая информационная среда предприятия;
* режим реального времени;
* независимость от законодательства;
* интеграция с другими приложениями (в том числе с уже работающими на предприятии системами);
* поэтапное внедрение и т. д.

Проблема комплексной автоматизации актуальна для каждого предприятия. Чтобы заниматься комплексной автоматизацией, необходимы структурированные знания в этой области.

Постоянное усложнение производственно-технических и организационно-экономических систем (фирм, предприятий, производств и других субъектов производственно-хозяйственной деятельности) и необходимость их анализа в целях совершенствования функционирования и повышения эффективности обусловливают необходимость применения специальных средств описания и анализа таких систем. Эта проблема приобретает особую актуальность в связи с появлением интегрированных компьютеризированных производств и автоматизированных предприятий.

Все эти особенности приводят к необходимости моделирования структуры и процесса функционирования программных систем до начала написания соответствующего кода. При этом непременным условием успешного завершения проекта становится построение предварительной модели программной системы.

# ОПРЕДЕЛЕНИЕ И КЛАССИФИКАЦИЯ ИНФОРМАЦИОННЫХ СИСТЕМ

## ИНФОРМАЦИОННАЯ СИСТЕМА И ЕЕ ФУНКЦИИ

Определение информационной системы. Система (от греч. *__system__* — целое, составленное из частей) — это совокупность элементов, взаимодействующих друг с другом, образующих определенную целостность, единство. Любая система имеет определенное назначение, функцию, а не просто набор каких-то элементов. Между элементами должны быть определенные связи, способствующие функционированию системы.

**Архитектура системы** — совокупность свойств системы существенных для пользователя.

Архитектура программной системы охватывает не только ее структурные и поведенческие аспекты, но и правила ее использования и интеграции с другими системами, функциональность, производительность, гибкость, надежность, возможность повторного применения, полноту, экономические и технологические ограничения, а также вопрос пользовательского интерфейса.

**Элемент системы** — часть системы, имеющая определенное функциональное назначение. Элементы, состоящие из простых взаимосвязанных элементов, зачастую называют подсистемами. Отличительным (главным) свойством системы является то, что ни один из ее элементов не имеет присущих ей свойств, не может выполнять ту функцию, которую она осуществляет.

**Организация системы** — внутренняя упорядоченность, согласованность взаимодействия элементов системы, проявляющаяся, в частности, в ограничении разнообразия состояния элементов в рамках системы.

**Структура системы** — совокупность элементов системы и связей между ними в виде множества. Структура системы означает строение, расположение, порядок и отражает определенные взаимосвязи, взаимоположение составных частей системы, т. е. ее устройства, и не учитывает множества свойств (состояний) ее элементов.

Система может быть представлена простым перечислением элементов. Однако чаще всего при исследовании объекта такого представления недостаточно, так как требуется выяснить, что представляет собой объект и что обеспечивает достижение поставленных целей.

Если отдельные элементы системы разнесены по разным уровням и характеризуются внутренними связями, то говорят об **иерархической структуре системы**.

<a id="qwestion1"></a>

**Информационная система** — это взаимосвязанная совокупность средств, методов и персонала, используемых для хранения данных, обработки и выдачи информации в интересах достижения поставленной цели.

<a id="qwestion3"></a>

Информационные системы обеспечивают сбор, хранение и обработку данных, поиск и выдачу информации, необходимой в процессе решения управленческих и других задач из любой области. Они помогают анализировать проблемы и создавать новые информационные продукты.

Современное понимание информационной системы предполагает использование в качестве основного технического средства переработки информации компьютера. Техническое воплощение информационной системы само по себе ничего не будет значить, если не учтена роль человека, для которого предназначена производимая информация и без которого невозможно ее получение и представление.

Компьютеры, оснащенные специализированными программными средствами, являются технической базой и инструментом для информационных систем. Информационная система немыслима без персонала, взаимодействующего с компьютерами и телекоммуникациями.

В нормативно-правовом смысле информационная система определяется как «организационно упорядоченная совокупность документов (массив документов) и информационных технологий, в том числе и с использованием средств вычислительной техники и связи, реализующих информационные процессы» (Федеральный закон «Об информации, информационных технологиях и о защите информации» от 27.07.2006 г. № 149-ФЗ).

Процессы, протекающие в информационных системах. Рассмотрим основные процессы.

**Информационный процесс** — процесс создания, сбора, обработки, накопления, хранения, поиска, распространения и потребления информации.

<a id="qwestion4"></a>

В нормативно-правовом аспекте документ определяется как зафиксированная на материальном носителе информация с реквизитами, позволяющими ее идентифицировать.

Процесс документирования превращает информацию в информационные ресурсы.

<a id="qwestion2"></a>

Процессы, обеспечивающие работу информационной системы любого назначения, условно можно представить состоящими из следующих блоков:
* ввод информации из внешних или внутренних источников;
* обработка входной информации и представление ее в удобном виде;
* вывод информации для представления потребителям или передачи в другую систему;
* обратная связь — информация, переработанная людьми данной организации для коррекции входной информации. 

Информационные процессы реализуются с помощью информационных процедур, воплощающих тот или иной механизм переработки входной информации в конкретный результат.

<a id="qwestion5"></a>

Различают следующие типы информационных процедур:
1) полностью формализуемые, при выполнении которых алгоритм переработки информации остается неизменным и полностью определен (поиск, учет, хранение, передача информации, печать документов, расчет на моделях);
2)	неформализуемые информационные процедуры, при выполнении которых создается новая уникальная информация, причем алгоритм переработки исходной информации неизвестен (формирование множества альтернатив выбора, выбор одного варианта из полученного множества);
3)	плохо формализованные информационные процедуры, при выполнении которых алгоритм переработки информации может изменяться и полностью не определен (задача планирования, оценка эффективности вариантов экономической политики).

К функциям информационных подразделений, создающих и поддерживающих информационные системы (служба администратора), относятся: оповещение и обработка запросов; поддержание целостности и сохранности информации; периодическая ревизия информации; автоматизация индексирования информации.

<a id="qwestion6"></a>

В целом информационные системы определяются следующими свойствами:
* любая информационная система может быть подвергнута анализу, построена и управляема на основе общих принципов построения систем;
* информационная система является динамичной и развивающейся;
* при построении информационной системы необходимо использовать системный подход;
* выходной продукцией информационной системы является информация, на основе которой принимаются решения; информационную систему следует воспринимать как человеко-машинную систему обработки информации.

Внедрение информационных систем может способствовать: 
* получению более рациональных вариантов решения управленческих задач за счет внедрения математических методов; освобождению работников от рутинной работы за счет ее автоматизации;
* обеспечению достоверности информации;
* совершенствованию структуры информационных потоков (включая систему документооборота); 
* предоставлению потребителям уникальных услуг; уменьшению затрат на производство продуктов и услуг (включая информационные).

Первые информационные системы появились в 1950-х гг. Они были предназначены для обработки счетов и расчета зарплаты, а реализовывались на электромеханических бухгалтерских счетных машинах. Это приводило к некоторому сокращению затрат и времени на подготовку бумажных документов.

Этапы развития информационных систем и цели их использования представлены в табл. 1.1.

1960-е гг. знаменуются изменением отношения к информационным системам. Информация стала применяться для периодической отчетности по многим параметрам. Для этого организациям требовалось компьютерное оборудование широкого назначения, способное обслуживать множество функций, а не только обрабатывать счета и считать зарплату.

В 1970-х — начале 1980-х гг. информационные системы начинают широко использоваться в качестве средства управленческого контроля, поддерживающего и ускоряющего процесс принятия решений.

К концу 1980-х гг. концепция использования информационных систем вновь изменяется. Они становятся стратегическим источ-ником информации и используются на всех уровнях организа¬ции любого профиля. Информационные системы этого периода, предоставляя вовремя нужную информацию, помогают организации достичь успеха в своей деятельности, создавать новые товары и услуги, находить новые рынки сбыта, обеспечивать себе достойных партнеров, организовывать выпуск продукции по низкой цене и многое другое.

<a id="qwestion7"></a>

Таблица 1.1. Этапы развития информационных систем

Период времени | Концепция использования информации | Вид информационных систем | Цель использования
---------------|------------------------------------|---------------------------|--------
1950—1960-е годы | Бумажный поток расчетных документов | Электромеханические бухгалтерские машины | Упрощение процедуры обработки счетов и расчета зарплаты
1960—1970-е годы | Помощь в подготовке отчетов | Управленческие информационные системы для производственной информации | Ускорение процесса подготовки отчетности
1970—1980-е годы | Управленческий контроль процессов | Системы поддержки принятия решений | Выработка рациональных решений
с 1980 г. по настоящее время | Информация — стратегический ресурс, обеспечивающий конкурентное преимущество | Стратегические информационные системы. Автоматизированные офисы | Выживание и процветание организации

## КЛАССИФИКАЦИЯ ИНФОРМАЦИОННЫХ СИСТЕМ

<a id="qwestion8"></a>

Тип информационной системы зависит от того, чьи интересы и на каком уровне управления она обслуживает. По характеру представления и логической организации хранимой информации информационные системы подразделяются на фактографические, документальные и геоинформационные.

Фактографические информационные системы. Накапливают и хранят данные в виде множества экземпляров одного или нескольких типов структурных элементов (информационных объектов). Каждый из таких экземпляров или некоторая их совокупность отражают сведения по какому-либо факту, событию отдельно от всех прочих сведений и фактов.

Структура информационного объекта каждого типа информационного объекта состоит из конечного набора реквизитов, отражающих основные аспекты и характеристики объектов данной предметной области. Комплектование информационной базы в фактографических информационных системах включает в себя, как правило, обязательный процесс структуризации входной информации.

Фактографические информационные системы предполагают удовлетворение информационных потребностей путем представления потребителям самих сведений (данных, фактов, концепций).

Документальные (документированные) информационные системы. В них единичным элементом информации является нерасчлененный на более мелкие элементы документ и информация при вводе (входной документ), как правило, не структурируется или структурируется в ограниченном виде. Для вводимого документа могут устанавливаться некоторые формализованные позиции (дата изготовления, исполнитель, тематика).

Некоторые виды документальных информационных систем обеспечивают установление логической взаимосвязи вводимых документов: соподчиненность по смысловому содержанию, взаимные отсылки по каким-либо критериям и т. д.

Определение и установление такой взаимосвязи представляет собой сложную многокритериальную и многоаспектную аналитическую задачу, которая не может быть формализована в полной мере.

Геоинформационные системы. В них данные организованы в виде отдельных информационных объектов (с определенным набором реквизитов), привязанных к общей электронной топографической основе (электронной карте). Геоинформационные системы применяются для информационного обеспечения в тех предметных областях, структура информационных объектов и процессов которых имеет пространственно-географический компонент (маршруты транспорта, коммунальное хозяйство).

Информационные системы можно классифицировать по функциональному признаку.

**Функциональный признак** определяет назначение системы, а также ее основные цели, задачи и функции.

В хозяйственной практике производственных и коммерческих объектов типовыми видами деятельности, которые определяют функциональный признак классификации информационных систем, являются производственная, маркетинговая, финансовая, кадровая деятельность.

По **уровням управления** выделяют:
* информационные системы оперативного (операционного) уровня — бухгалтерская, банковских депозитов, обработки заказов, регистрации билетов, выплаты зарплаты;
* информационные системы специалистов — офисная автоматизация, обработка знаний (включая экспертные системы);
* информационные системы тактического уровня (среднее звено) — мониторинг, администрирование, контроль, принятие решений;
* стратегические информационные системы — формулирование целей, стратегическое планирование.

**Информационная система оперативного уровня** поддерживает специалистов-исполнителей, обрабатывая данные о сделках и событиях (счета, накладные, зарплата, кредиты, поток сырья и материалов). Назначение информационной системы на этом уровне — отвечать на запросы о текущем состоянии и отслеживать поток сделок в фирме, что соответствует оперативному управлению. Чтобы с этим справляться, информационная система должна быть легко доступной, непрерывно действующей и предоставлять точную информацию.

Задачи, цели и источники информации на оперативном уровне заранее определены и в высокой степени структурированы. Решение запрограммировано в соответствии с заданным алгоритмом.

Информационная система оперативного уровня является связующим звеном между фирмой и внешней средой. Если система работает плохо, то организация либо не получает информации извне, либо не выдает информацию. Кроме того, система — это основной поставщик информации для остальных типов информационных систем в организации, так как содержит и оперативную, и архивную информацию.

**Информационные системы специалистов** помогают специалистам, работающим с данными, повышать продуктивность и производительность работы инженеров и проектировщиков. Задача подобных информационных систем — интеграция новых сведений в организацию и помощь в обработке бумажных документов.

По мере того как индустриальное общество трансформируется в информационное, производительность экономики все больше будет зависеть от уровня развития этих систем. Такие системы, особенно в виде рабочих станций и офисных систем, наиболее быстро развиваются в бизнесе в настоящее время.

**Информационные системы офисной автоматизации** вследствие своей простоты и многопрофильное™ активно используются работниками любого организационного уровня. Наиболее часто их используют работники средней квалификации: бухгалтеры, секретари, клерки. Основная цель — обработка данных, повышение эффективности их работы и упрощение канцелярского труда. Информационные системы офисной автоматизации связывают воедино работников информационной сферы в разных регионах и помогают поддерживать связь с покупателями, заказчиками и другими организациями. Их деятельность в основном охватывает управление документацией, коммуникации, составление расписаний и т.д.

Эти системы выполняют следующие функции:
* обработка текстов на компьютерах с помощью различных текстовых процессоров;
* производство высококачественной печатной продукции;
* архивация документов;
* электронные календари и записные книжки для ведения деловой информации;
* электронная и аудиопочта;
* видео- и телеконференции.

**Информационные системы обработки знаний**, в том числе и экспертные системы, вбирают в себя знания, необходимые ин-женерам, юристам, ученым при разработке или создании нового продукта. Их работа заключается в создании новой информации и нового знания.

Основные функции **информационных систем тактического уровня** (среднее звено):
* сравнение текущих показателей с прошлыми показателями;
* составление периодических отчетов за определенное время (а не выдача отчетов по текущим событиям, как на оперативном уровне);
* обеспечение доступа к архивной информации и т. д.

**Системы поддержки принятия решений** обслуживают частично структурированные задачи, результаты которых трудно спрогнозировать заранее (имеют более мощный аналитический аппарат с несколькими моделями). Информацию получают из управленче-ских и операционных информационных систем. Используют эти системы все, кому необходимо принимать решение: менеджеры, специалисты, аналитики. Например, их рекомендации могут пригодиться при принятии решения покупать или взять оборудование в аренду.

Характеристика систем поддержки принятия решений:
* обеспечивают решение проблем, развитие которых трудно прогнозировать;
* оснащены сложными инструментальными средствами моделирования и анализа;
позволяют легко менять постановки решаемых задач и входные данные;
* отличаются гибкостью и легко адаптируются к изменению условий функционирования;
* имеют технологию, максимально ориентированную на пользователя.

Стратегические информационные системы. Развитие и успех любой организации (фирмы) во многом определяются принятой в ней стратегией. Под стратегией понимается набор методов и средств решения перспективных долгосрочных задач. В этом контексте можно воспринимать и понятия «стратегический метод», «стратегическое средство», «стратегическая система».

В настоящее время в связи с переходом к рыночным отношениям вопросу стратегии развития и поведения фирмы стали уделять большое внимание, что способствовало коренному изменению во взглядах на информационные системы. Они стали расцениваться как стратегически важные системы, которые влияют на изменение выбора целей фирмы, ее задач, методов, продуктов, услуг, позволяя опередить конкурентов, а также наладить более тесное взаимодействие потребителей с поставщиками. Появился новый тип информационных систем — стратегический.

**Стратегическая информационная система** — компьютерная информационная система, обеспечивающая поддержку принятия решений по реализации перспективных стратегических целей развития организации. Известны ситуации, когда новое качество информационных систем заставляло изменять не только структуру, но и профиль фирм, содействуя их процветанию. Однако при этом возможно возникновение нежелательной психологической обстановки, связанное с автоматизацией некоторых функций и видов работ, так как это может поставить некоторую часть работающих в затруднительное положение.

В зависимости **от степени автоматизации** информационных процессов в системе управления фирмой информационные системы определяются как ручные, автоматические, автоматизированные.

*Ручные информационные системы* характеризуются отсутствием современных технических средств переработки информации и выполнением всех операций человеком. Например, о деятельности менеджера в фирме, где отсутствуют компьютеры, можно говорить, что он работает с ручной информационной системой.

*Автоматические информационные системы* выполняют все операции по переработке информации без участия человека.

*Автоматизированные информационные системы* предполагают участие в процессе обработки информации и человека, и технических средств, причем главная роль отводится компьютеру. В современном толковании в термин «информационная система» обязательно вкладывается понятие автоматизируемой системы. Автоматизированные информационные системы, учитывая их широкое использование в организации процессов управления, имеют различные модификации и могут быть классифицированы, например, по характеру использования информации и по сфере применения.

По **характеру использования информации** различают:
* информационно-поисковые системы — производят ввод, систематизацию, хранение, выдачу информации по запросу пользователя без сложных преобразований данных (информационно-поисковая система в библиотеке, в железнодорожных и авиа-кассах);
* информационно-решающие системы — осуществляют все операции переработки информации по определенному алгоритму. Среди них можно провести классификацию по степени воздействия выработанной результатной информации на процесс принятия решений и выделить два класса: управляющие и советующие системы;
* управляющие информационные системы — вырабатывают информацию, на основании которой человек принимает решение. Для этих систем характерен тип задач расчетного характера и обработка больших объемов данных. Примером могут служить система оперативного планирования выпуска продукции и система бухгалтерского учета;
* советующие информационные системы — вырабатывают информацию, которая принимается человеком к сведению и не превращается немедленно в серию конкретных действий. Эти системы обладают более высокой степенью интеллекта, так как для них характерна обработка знаний, а не данных.

По **сфере применения** можно выделить следующие классы информационных систем: 
* организационного управления — предназначены для автоматизации функций управленческого персонала. Учитывая наиболее широкое применение и разнообразие этого класса систем, любые информационные системы нередко понимают именно в данном толковании. К этому классу относятся информационные системы управления как промышленными фирмами, так и непромышленными объектами (гостиницами, банками, торговыми фирмами и др.);
* управления технологическими процессами — служат для автоматизации функций производственного персонала. Они широко используются при организации поточных линий, изготовлении микросхем, на сборке, для поддержания технологического процесса в металлургической и машиностроительной промышленности;
* автоматизированного проектирования — предназначены для автоматизации функций инженеров-проектировщиков, конструкторов, архитекторов, дизайнеров при создании новой техники или технологии. Основными функциями подобных систем являются инженерные расчеты, создание графической документации (чертежей, схем, планов), создание проектной документации, моделирование проектируемых объектов;


* интегрированные (корпоративные) информационные системы — используются для автоматизации всех функций фирмы и охватывают весь цикл работ от проектирования до сбыта продукции. Создание таких систем весьма затруднительно, поскольку требует системного подхода с позиций главной цели (например, получения прибыли, завоевания рынка сбыта и т.д.). Такой подход способен привести к существенным изменениям в самой структуре фирмы, на что может решиться не каждый управляющий.

По **способу организации** групповые и корпоративные информационные системы подразделяются на следующие классы на основе:
* архитектуры файл-сервер;
* архитектуры клиент-сервер;
* многоуровневой архитектуры;
* интернет/интранет-технологий.

По **направлению деятельности** различают системы:
* производственные;
* административные (человеческих ресурсов);
* финансовые и учетные;
* системы маркетинга.

Производственные системы, в свою очередь, подразделяются:
* на автоматизированные системы управления производством;
* автоматизированные системы управления технологическими процессами;
* автоматизированные системы управления техническими средствами.

## СТРУКТУРА ИНФОРМАЦИОННОЙ СИСТЕМЫ

<a id="qwestion9"></a>

Структуру информационной системы составляет совокупность отдельных ее частей, называемых подсистемами.

**Подсистема** — это часть системы, выделенная по какому-либо признаку.

Общую структуру информационной системы можно рассматривать как совокупность подсистем независимо от сферы применения. В этом случае говорят о структурном признаке классификации, а подсистемы называют **_обеспечивающими_**. Таким образом, структура любой информационной системы может быть представлена совокупностью обеспечивающих подсистем, среди которых обычно выделяют информационное, техническое, математическое, программное (иногда математическое и программное обеспечение объединяют), организационное и правовое обеспечение.

Различают:
* программно-техническое обеспечение (платформа);
* информационное обеспечение;
* математическое обеспечение (иногда — алгоритмическое);
* организационно-методическое обеспечение.

Иногда выделяют лингвистическое обеспечение. 

<a id="qwestion10"></a>

Информационное обеспечение. Это совокупность единой системы классификации и кодирования информации, унифицированных систем документации, схем информационных потоков, циркулирующих в организации, а также методологии построения баз данных.

Назначение подсистемы информационного обеспечения состоит в своевременном формировании и выдаче достоверной информации для принятия управленческих решений.

Схема базовых понятий информационной системы представлена на рис. 1.1.

Рис. 1.1. Схема базовых понятий информационного обеспечения

**Автоматизированная система** — система, состоящая из персонала и комплекса средств автоматизации его деятельности, реализующая информационную технологию установленных функций.

Технологическое и организационное воплощение информационного обеспечения осуществляется в следующих формах: 
* служба документационного управления;
* информационная служба;
* экспертно-аналитическая служба.

Для создания информационного обеспечения необходимо:
* ясное понимание целей, задач и функций всей системы управления организацией;
* выявление движения информации от момента возникновения до ее использования на различных уровнях управления, представленной для анализа в виде схем информационных потоков;
* совершенствование системы документооборота;
* наличие и использование системы классификации и кодирования;
* владение методологией создания концептуальных информационно-логических моделей, отражающих взаимосвязь информации;
* создание массивов информации на машинных носителях, что требует наличия современного технического обеспечения.

<a id="qwestion11"></a>

**Техническое обеспечение**. Это комплекс технических средств, предназначенных для работы информационной системы, а также соответствующая документация на эти средства и технологические процессы. 

Комплекс технических средств составляют: 
- компьютеры любых моделей;
- устройства сбора, накопления, обработки, передачи и вывода информации;
- устройства передачи данных и линий связи;
- оргтехника и устройства автоматического сбора информации;
- эксплуатационные материалы и др.

К настоящему времени сложились две основные формы организации технического обеспечения (формы использования технических средств): централизованная и частично или полностью децентрализованная.

**Централизованное** техническое обеспечение базируется на использовании в информационной системе больших компьютеров и вычислительных центров.

**Децентрализация** технических средств предполагает реализацию функциональных подсистем на персональных компьютерах непосредственно на рабочих местах.

Перспективным подходом следует считать, по-видимому, **частично децентрализованный** подход — организацию технического обеспечения на базе распределенных сетей, состоящих из персональных и больших компьютеров для хранения баз данных, общих для любых функциональных подсистем.

Математическое и программное обеспечение. Это совокупность математических методов, моделей, алгоритмов и программ для реализации целей и задач информационной системы, а также нормального функционирования комплекса технических средств.

К средствам математического обеспечения относятся:
- средства моделирования процессов управления;
- типовые алгоритмы управления;
- методы математического программирования, математической статистики, теории массового обслуживания и др.

В состав программного обеспечения входят общесистемные и специальные программные продукты, а также техническая документация.

К общесистемному программному обеспечению относятся комплексы программ, ориентированных на пользователей и предназначенных для решения типовых задач обработки информации. Они служат для расширения функциональных возможностей компьютеров, контроля и управления процессом обработки данных.

Специальное программное обеспечение представляет собой совокупность программ, разработанных при создании конкретной информационной системы. В его состав входят пакеты прикладных программ, реализующие разработанные модели разной степени адекватности, отражающие функционирование реального объекта.

Техническая документация на разработку программных средств должна содержать описание задач, задание на алгоритмизацию, экономико-математическую модель задачи и контрольные примеры.

Организационное обеспечение. Это совокупность методов и средств, регламентирующих взаимодействие работников с техническими средствами и между собой в процессе разработки и эксплуатации информационной системы. Организационное обеспечение создается по результатам предпроектного обследования организации.

Организационное обеспечение реализует следующие функции:
- анализ существующей системы управления организацией, где будет использоваться информационная система, и выявление задач, подлежащих автоматизации;
- подготовка задач к решению на компьютере, включая техническое задание на проектирование информационной системы и технико-экономическое обоснование эффективности;
- разработка управленческих решений по составу и структуре организации, методологии решения задач, направленных на повышение эффективности системы управления.

Правовое обеспечение. Это совокупность правовых норм, определяющих создание, юридический статус и функционирование информационных систем, регламентирующих порядок получения, преобразования и использования информации.

Главной целью правового обеспечения является укрепление законности. В состав правового обеспечения входят законы, указы, постановления государственных органов власти, приказы, инструкции и другие нормативные документы министерств, ведомств, организаций и местных органов власти.

В правовом обеспечении можно выделить общую часть, регулирующую функционирование любой информационной системы, и локальную часть, регулирующую функционирование конкретной системы.

Правовое обеспечение этапов разработки информационной системы включает в себя типовые акты, связанные с договорными отношениями разработчика и заказчика и правовым регулированием отклонений от договора.

Правовое обеспечение функционирования информационной системы включает в себя:
- статус информационной системы;
- права, обязанности и ответственность персонала;
- правовые положения отдельных видов процесса управления;
- порядок создания и использования информации и др. 

# КОНТРОЛЬНЫЕ ВОПРОСЫ
1. [Что такое ИС?](#qwestion1)
2. [Какие процессы обеспечивают работу любой ИС?](#qwestion2)
3. [Какие функции выполняет любая ИС?](#qwestion3)
4. [Дайте определение понятию «информационный ресурс».](#qwestion4)
5. [Назовите типы информационных процедур.](#qwestion5)
6. [Перечислите основные свойства ИС.](#qwestion6)
7. [Перечислите основные этапы развития ИС.](#qwestion7)
8. [Перечислите типы ИС и охарактеризуйте их.](#qwestion8)
9. [Какие подсистемы обеспечивают функционирование ИС?](#qwestion9)
10. [Что относится к информационному обеспечению ИС?](#qwestion10)
11.	[К какому обеспечению ИС можно отнести копировальную технику?](#qwestion11)
12.	К какому виду ИС относятся системы поддержки принятия решений?
13.	Какие системы автоматизируют функции управленческого персонала?
14.	Какие виды ИС можно выделить по масштабу?
