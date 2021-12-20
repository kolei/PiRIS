Запуск activity

```kt
val mainIntent = Intent(this, MainActivity::class.java)

// если надо что-то передать в активность
mainIntent.putExtra("city_name", cityName)

// запуск активности
startActivity( mainIntent )

// возврат из запущенной активности
finish()

// получение переданных параметров (intent создавать не надо, он есть у activity)
intent.getStringExtra("city_name")
```

Если надо получить результат

```kt
// запуск
startActivityForResult( 
    Intent(this, CityListActivity::class.java), 
    1 // идентификатор окна
)

// получение результата
// здесь requestCode = <идентификатор окна> (ответы от всех запущенных activity приходят в одно место)
// resultCode задается при ответе
// data необязательные данные из newIntent
@SuppressLint("MissingSuperCall")
override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    if (data == null) {
        return
    }
    val name = data.getStringExtra("cityName")
}

// в запущенном перед закрытием установить результат
// запоминаем выбранное название города в параметрах
val newIntent = Intent()
newIntent.putExtra("cityName", cityName)
setResult(RESULT_OK, newIntent)
finish()
```

Таймер обратного отсчёта и переход на другое activity

```kt
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)
    object : CountDownTimer(3000,1000){
        override fun onTick(millisUntilFinished: Long) {
            // заставляем пялиться на нашу заставку как минимум 3 секунды
        }

        override fun onFinish(){
            switchToSecond()
        }
    }.start()
}

fun switchToSecond(){
    runOnUiThread {
        startActivity(
            Intent(this, SecondActivity::class.java)
        )
    }
}
```
