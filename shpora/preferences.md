запрашиваем приватное хранилище с названием "settings" (если нет, то создаст автоматически, количество хранилищ не ограничено)

```kt
val myPreferences = getSharedPreferences("settings", MODE_PRIVATE)
```

запрашиваем из хранилища список городов (можно задать значение по-умолчанию)
андроид не позволяет хранить массивы, поэтому список хранится как строка с разделителями

```kt
val oldCityListString = myPreferences.getString("cityList", "Moscow|Kazan|Yoshkar-Ola")
```

Для записи данных в хранилище нужно создать объект "редактор" и после записи сохранить изменения:

```kt
val editor = myPreferences.edit()
try {
    editor.putString("cityList", oldCityListString+"|"+newCityName )
}finally {
    editor.commit()
}
```
