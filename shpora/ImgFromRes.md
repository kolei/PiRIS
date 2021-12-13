Если графические ресурсы (иконки валют) предоставлены *.png файлами, то их надо закинуть в каталог drawable проекта, при отображении элемента в RecyclerView найти этот элемент в ресурсах и установить изображение из ресурса по его id: 

```kt
val icoId = resources
    .getIdentifier(
        "ic_launcher_background",   // название ресурса
        "drawable",                 // раздел, в котором находится ресурс
        this.packageName            // пакет
    )
// дальше как обычно    
val ico = findViewById<ImageView>(R.id.ico)
ico.setImageResource(icoId)
```