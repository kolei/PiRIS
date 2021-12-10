**android:adjustViewBounds** - Установите это значение в true, если вы хотите, чтобы ImageView изменил свои границы, чтобы сохранить соотношение сторон для его рисования.

---

У вас есть ImageView , который вы хотите иметь шириной fill_parent и высотой, масштабируемой пропорционально:

Добавьте эти два атрибута в свой ImageView :

```
android:adjustViewBounds="true"
android:scaleType="centerCrop"
```

И установите ширину ImageView на fill_parent , а высоту на wrap_content .

Кроме того, если вы не хотите, чтобы ваше изображение было обрезано, попробуйте это:

```
android:adjustViewBounds="true"
android:layout_centerInParent="true"
```

```
android:adjustViewBounds="true"
android:scaleType="fitCenter"
```

```
android:adjustViewBounds="true"
android:scaleType="fitXY"
```