1. Добавить в зависимости

    ```txt
    implementation 'com.github.bumptech.glide:glide:4.14.2'
    annotationProcessor 'com.github.bumptech.glide:compiler:4.14.2'
    ```

1. Загрузка и отображение картинки

    ```kt
    Glide.with(this)
        .load(car.photoUrl)
        .into(carPhotoImageView)
    ```

    где

    * *this* - контекст (активность)
    * *car.photoUrl* - полный путь к изображению
    * *carPhotoImageView* - как должно быть понятно из названия, указатель на визуальный элемент
