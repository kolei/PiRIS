Рисует градиент слева направо от **startColor** до **endColor** с возможностью перехода через **centerColor**. Для смены направления использовать **angle**

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <gradient
        android:startColor="color"
        android:endColor="color"
        android:centerColor="integer"
        android:angle="integer"

        android:centerX="float"
        android:centerY="float"
        android:gradientRadius="integer"
        android:type=["linear" | "radial" | "sweep"]
        android:useLevel=["true" | "false"] />
</shape>
```