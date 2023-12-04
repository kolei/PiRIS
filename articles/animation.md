Предыдущая лекция | &nbsp; | Следующая лекция
:----------------:|:----------:|:----------------:
[Android Navigation.](./android_bottom_navigation.md) | [Содержание](../readme.md#практика-разработка-мобильных-приложений) | [Проект "каршеринг"](./android_auth.md)


# Анимация

Базовые анимации. Взято [отсюда](https://habr.com/ru/post/347918/)

## [Кадр за кадром](https://developer.android.com/develop/ui/views/animations/drawable-animation)

![](../img/mad_40.gif)

Всё что нужно сделать это создать xml со ссылками на каждый кадр:

```xml
<?xml version="1.0" encoding="utf-8"?>
<animation-list 
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:oneshot="true">
    <item android:drawable="@drawable/explosion_1" android:duration="15" />
    <item android:drawable="@drawable/explosion_2" android:duration="15" />
    <item android:drawable="@drawable/explosion_3" android:duration="15" />
    ...
</animation-list>
```

И запустить анимацию:

```kt
val animation = image.drawable as AnimationDrawable
animation.start()
```

* Применение:

    Сложные по графике анимации, небольших размеров и подготовленные во внешнем редакторе.

* Достоинства:

    Возможность достичь любой сложности эффектов

* Недостатки:

    Большое потребление ресурсов и, как следствие, довольно затратный импорт в приложение с возможностью получить OutOfMemory. Если по каким-то причинам вам нужно показывать большое количество кадров, то придётся писать свою реализацию с постепенной подгрузкой изображений в память. Но если так пришлось делать, возможно проще прибегнуть к видео?


## [Анимация свойств объекта (aka Property Animator)](https://developer.android.com/develop/ui/views/animations/prop-animation)

![](../img/mad_41.gif)

Если нам нужно всего-лишь передвинуть что-нибудь на несколько пикселей в сторону или изменить прозрачность, чтобы не плодить миллион очень похожих друг на друга кадров на помощь приходит **Animator**. Фактически с помощью него можно анимировать любое свойство любых объектов.

Базовый абстрактный класс называется **Animator**, у него есть несколько наследников, нам важны:

- **ValueAnimator** — позволяет анимировать любое свойство
- **ObjectAnimator** — наследуется от **ValueAnimator** и имеет упрощённый интерфейс для анимации свойств View.
- **ViewPropertyAnimator** — Предоставляет ещё один удобный интерфейс для анимации **View**. Не унаследован от **Animator** и используется в методе *View::animate()*

Анимацию выше можно описать как в коде:

```kt
val animationX = ObjectAnimator.ofFloat(card, "scaleX", 1F)
val animationY = ObjectAnimator.ofFloat(card, "scaleY", 1F)
val set = AnimatorSet()
set.play(animationX)
    .with(animationY)
set.duration = DURATION
set.interpolator = DecelerateInterpolator()
set.start()
```

так и в XML (animator/open_animator.xml):

```xml
<?xml version="1.0" encoding="utf-8"?>
<set 
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:ordering="together"
>
    <objectAnimator
        android:duration="250"
        android:propertyName="scaleX"
        android:valueTo="1"
        android:valueType="floatType"
        android:interpolator="@android:anim/decelerate_interpolator"/>

    <objectAnimator
        android:duration="250"
        android:propertyName="scaleY"
        android:valueTo="1"
        android:valueType="floatType"
        android:interpolator="@android:anim/decelerate_interpolator"/>
</set>
```

```kt
val set = AnimatorInflater.loadAnimator(context, R.animator.open_animator) as AnimatorSet
set.setTarget(card)
set.start()
```

Так-же есть возможность описать нашу анимацию переходов между стейтами **View**, что соответсвенно, с лёгкостью позволит создать анимированные переходы между стейтами у любых **View**. Описанная в XML анимация будет автоматически запущена при смене состояния **View**.

`animator/state_animator.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<selector 
    xmlns:android="http://schemas.android.com/apk/res/android"
>
    <item android:state_enabled="true">
        <set android:ordering="together">
            <objectAnimator
                android:duration="250"
                android:interpolator="@android:anim/decelerate_interpolator"
                android:propertyName="scaleX"
                android:valueTo="1"
                android:valueType="floatType"/>

            <objectAnimator
                android:duration="250"
                android:interpolator="@android:anim/decelerate_interpolator"
                android:propertyName="scaleY"
                android:valueTo="1"
                android:valueType="floatType"/>
        </set>
    </item>
    <item
        android:state_enabled="false">
        <set android:ordering="together">
            <objectAnimator
                android:duration="250"
                android:interpolator="@android:anim/accelerate_interpolator"
                android:propertyName="scaleX"
                android:valueTo="0"
                android:valueType="floatType"/>

            <objectAnimator
                android:duration="250"
                android:interpolator="@android:anim/accelerate_interpolator"
                android:propertyName="scaleY"
                android:valueTo="0"
                android:valueType="floatType"/>
        </set>
    </item>
</selector>
```

```xml
<View
    ...
    android:stateListAnimator="@animator/state_animator">
</View>
```

* Применение:

    Анимация View объектов и любых их параметров

    Анимация любых других параметров

* Достоинства:

    Абсолютно универсален

* Недостатки:

    В некоторой степени требовательны к ресурсам

### [Анимация View (aka View animation)](https://developer.android.com/develop/ui/views/animations/view-animation)

До появления **Animator** в Android были только **Animations**. Основной недостаток которых был в том что они анимировали только представление вида и никак на самом деле не изменяли его свойства. Поэтому если хочется анимировать перемещение какого-либо элемента, то дополнительно по окончанию анимации нужно изменить ещё его свойства. Такой подход так или иначе не очень удобен, если вам нужна чуть более сложная анимация или нужно отлавливать нажатия в момент анимации.

Анимацию можно запустить как в коде:

```kt
val anim = ScaleAnimation(0F, 1F, 0F, 1F,
                0F, card.measuredHeight.toFloat())
anim.duration = DURATION
anim.interpolator = DecelerateInterpolator()
anim.fillAfter = true
card.startAnimation(anim)
```

так и в XML (обратите внимание, что синтаксис отличается от xml для Animator):

`anim/open_animation.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<scale 
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:duration="250"
    android:fillAfter="true"
    android:fromXScale="0"
    android:fromYScale="0"
    android:interpolator="@android:anim/decelerate_interpolator"
    android:pivotX="0"
    android:pivotY="100%"
    android:toXScale="1"
    android:toYScale="1"/>
```

```kt
val animation = AnimationUtils.loadAnimation(context, R.anim.open_animation)
card.startAnimation(animation)
```

* Применение:

    Там, где API не позволяет использовать Animator.

* Достоинства:

    Отсутсвуют

* Недостатки:

    Устаревший API, меняет только представление вида.

### [Анимация векторных ресурсов (aka AnimatedVectorDrawable)](https://developer.android.com/reference/android/graphics/drawable/AnimatedVectorDrawable.html)

![](../img/mad_42.gif)

На мой взгляд самая интересная часть в Android анимациях. Можно относительно малыми силами добиваться сложных и интересных эффектов. Трансформации иконок в Android сделаны именно так.

VectorDrawable состоит из Path и Group элементов. Создание анимации сводится к тому, чтобы прописать движение к этим элементам. Андроид на картинке выше, в коде будет выглядеть так:

<details>
<summary>Много кода</summary>

`drawable/hello_android.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<animated-selector 
    xmlns:android="http://schemas.android.com/apk/res/android"
>
    <item
        android:id="@+id/enabled"
        android:drawable="@drawable/hello_android_enabled"
        android:state_enabled="true"/>

    <item
        android:id="@+id/disabled"
        android:drawable="@drawable/hello_android_disabled"/>

    <transition
        android:drawable="@drawable/hello_android_waving"
        android:fromId="@id/enabled"
        android:toId="@id/disabled"/>

    <transition
        android:drawable="@drawable/hello_android_stay_calm"
        android:fromId="@id/disabled"
        android:toId="@id/enabled"/>
</animated-selector>
```

`drawable/hello_android_enabled.xml`

```xml
<vector
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:name="vector"
    android:width="32dp"
    android:height="32dp"
    android:viewportWidth="32"
    android:viewportHeight="32">
    <path
        android:name="path_1"
        android:pathData="M 15 13 L 14 13 L 14 12 L 15 12 M 10 13 L 9 13 L 9 12 L 10 12 M 15.53 10.16 L 16.84 8.85 C 17.03 8.66 17.03 8.34 16.84 8.14 C 16.64 7.95 16.32 7.95 16.13 8.14 L 14.65 9.62 C 13.85 9.23 12.95 9 12 9 C 11.04 9 10.14 9.23 9.34 9.63 L 7.85 8.14 C 7.66 7.95 7.34 7.95 7.15 8.14 C 6.95 8.34 6.95 8.66 7.15 8.85 L 8.46 10.16 C 6.97 11.26 6 13 6 15 L 18 15 C 18 13 17 11.25 15.53 10.16 M 3.5 16 C 2.672 16 2 16.672 2 17.5 L 2 24.5 C 2 25.328 2.672 26 3.5 26 C 4.328 26 5 25.328 5 24.5 L 5 17.5 C 5 16.672 4.328 16 3.5 16 M 6 26 C 6 26.552 6.448 27 7 27 L 8 27 L 8 30.5 C 8 31.328 8.672 32 9.5 32 C 10.328 32 11 31.328 11 30.5 L 11 27 L 13 27 L 13 30.5 C 13 31.328 13.672 32 14.5 32 C 15.328 32 16 31.328 16 30.5 L 16 27 L 17 27 C 17.552 27 18 26.552 18 26 L 18 16 L 6 16 L 6 26 Z"
        android:fillColor="#000000"/>
    <group
        android:name="group"
        android:rotation="-160"
        android:pivotX="20.5"
        android:pivotY="17">
        <path
            android:name="path"
            android:pathData="M 20.5 16 C 19.672 16 19 16.672 19 17.5 L 19 24.5 C 19 25.328 19.672 26 20.5 26 C 21.328 26 22 25.328 22 24.5 L 22 17.5 C 22 16.672 21.328 16 20.5 16"
            android:fillColor="#000"/>
    </group>
</vector>
```

`drawable/hello_android_disabled.xml`

```xml
<vector
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:name="vector"
    android:width="32dp"
    android:height="32dp"
    android:viewportWidth="32"
    android:viewportHeight="32">
    <path
        android:name="path_1"
        android:pathData="M 15 13 L 14 13 L 14 12 L 15 12 M 10 13 L 9 13 L 9 12 L 10 12 M 15.53 10.16 L 16.84 8.85 C 17.03 8.66 17.03 8.34 16.84 8.14 C 16.64 7.95 16.32 7.95 16.13 8.14 L 14.65 9.62 C 13.85 9.23 12.95 9 12 9 C 11.04 9 10.14 9.23 9.34 9.63 L 7.85 8.14 C 7.66 7.95 7.34 7.95 7.15 8.14 C 6.95 8.34 6.95 8.66 7.15 8.85 L 8.46 10.16 C 6.97 11.26 6 13 6 15 L 18 15 C 18 13 17 11.25 15.53 10.16 M 3.5 16 C 2.672 16 2 16.672 2 17.5 L 2 24.5 C 2 25.328 2.672 26 3.5 26 C 4.328 26 5 25.328 5 24.5 L 5 17.5 C 5 16.672 4.328 16 3.5 16 M 6 26 C 6 26.552 6.448 27 7 27 L 8 27 L 8 30.5 C 8 31.328 8.672 32 9.5 32 C 10.328 32 11 31.328 11 30.5 L 11 27 L 13 27 L 13 30.5 C 13 31.328 13.672 32 14.5 32 C 15.328 32 16 31.328 16 30.5 L 16 27 L 17 27 C 17.552 27 18 26.552 18 26 L 18 16 L 6 16 L 6 26 Z"
        android:fillColor="#000000"/>
    <group
        android:name="group"
        android:pivotX="20.5"
        android:pivotY="17">
        <path
            android:name="path"
            android:pathData="M 20.5 16 C 19.672 16 19 16.672 19 17.5 L 19 24.5 C 19 25.328 19.672 26 20.5 26 C 21.328 26 22 25.328 22 24.5 L 22 17.5 C 22 16.672 21.328 16 20.5 16"
            android:fillColor="#000"/>
    </group>
</vector>
```

`drawable/hello_android_waving.xml`

```xml
<animated-vector
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:aapt="http://schemas.android.com/aapt">
    <aapt:attr name="android:drawable">
        <vector
            android:name="vector"
            android:width="32dp"
            android:height="32dp"
            android:viewportWidth="32"
            android:viewportHeight="32">
            <path
                android:name="path_1"
                android:pathData="M 15 13 L 14 13 L 14 12 L 15 12 M 10 13 L 9 13 L 9 12 L 10 12 M 15.53 10.16 L 16.84 8.85 C 17.03 8.66 17.03 8.34 16.84 8.14 C 16.64 7.95 16.32 7.95 16.13 8.14 L 14.65 9.62 C 13.85 9.23 12.95 9 12 9 C 11.04 9 10.14 9.23 9.34 9.63 L 7.85 8.14 C 7.66 7.95 7.34 7.95 7.15 8.14 C 6.95 8.34 6.95 8.66 7.15 8.85 L 8.46 10.16 C 6.97 11.26 6 13 6 15 L 18 15 C 18 13 17 11.25 15.53 10.16 M 3.5 16 C 2.672 16 2 16.672 2 17.5 L 2 24.5 C 2 25.328 2.672 26 3.5 26 C 4.328 26 5 25.328 5 24.5 L 5 17.5 C 5 16.672 4.328 16 3.5 16 M 6 26 C 6 26.552 6.448 27 7 27 L 8 27 L 8 30.5 C 8 31.328 8.672 32 9.5 32 C 10.328 32 11 31.328 11 30.5 L 11 27 L 13 27 L 13 30.5 C 13 31.328 13.672 32 14.5 32 C 15.328 32 16 31.328 16 30.5 L 16 27 L 17 27 C 17.552 27 18 26.552 18 26 L 18 16 L 6 16 L 6 26 Z"
                android:fillColor="#000000"/>
            <group
                android:name="group"
                android:pivotX="20.5"
                android:pivotY="17">
                <path
                    android:name="path"
                    android:pathData="M 20.5 16 C 19.672 16 19 16.672 19 17.5 L 19 24.5 C 19 25.328 19.672 26 20.5 26 C 21.328 26 22 25.328 22 24.5 L 22 17.5 C 22 16.672 21.328 16 20.5 16"
                    android:fillColor="#000"/>
            </group>
        </vector>
    </aapt:attr>
    <target android:name="group">
        <aapt:attr name="android:animation">
            <set>
                <objectAnimator
                    android:propertyName="rotation"
                    android:duration="300"
                    android:valueFrom="0"
                    android:valueTo="-170"
                    android:valueType="floatType"
                    android:interpolator="@android:anim/decelerate_interpolator"/>
                <objectAnimator
                    android:propertyName="rotation"
                    android:startOffset="300"
                    android:duration="200"
                    android:valueFrom="-170"
                    android:valueTo="-160"
                    android:valueType="floatType"
                    android:interpolator="@android:interpolator/fast_out_slow_in"/>
                <objectAnimator
                    android:propertyName="rotation"
                    android:startOffset="500"
                    android:duration="200"
                    android:valueFrom="-160"
                    android:valueTo="-170"
                    android:valueType="floatType"
                    android:interpolator="@android:interpolator/fast_out_slow_in"/>
                <objectAnimator
                    android:propertyName="rotation"
                    android:startOffset="700"
                    android:duration="200"
                    android:valueFrom="-170"
                    android:valueTo="-160"
                    android:valueType="floatType"
                    android:interpolator="@android:interpolator/fast_out_slow_in"/>
            </set>
        </aapt:attr>
    </target>
</animated-vector>
```

`drawable/hello_android_stay_calm.xml`

```xml
<animated-vector
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:aapt="http://schemas.android.com/aapt">
    <aapt:attr name="android:drawable">
        <vector
            android:name="vector"
            android:width="32dp"
            android:height="32dp"
            android:viewportHeight="32"
            android:viewportWidth="32">
            <path
                android:fillColor="#000000"
                android:pathData="M 15 13 L 14 13 L 14 12 L 15 12 M 10 13 L 9 13 L 9 12 L 10 12 M 15.53 10.16 L 16.84 8.85 C 17.03 8.66 17.03 8.34 16.84 8.14 C 16.64 7.95 16.32 7.95 16.13 8.14 L 14.65 9.62 C 13.85 9.23 12.95 9 12 9 C 11.04 9 10.14 9.23 9.34 9.63 L 7.85 8.14 C 7.66 7.95 7.34 7.95 7.15 8.14 C 6.95 8.34 6.95 8.66 7.15 8.85 L 8.46 10.16 C 6.97 11.26 6 13 6 15 L 18 15 C 18 13 17 11.25 15.53 10.16 M 3.5 16 C 2.672 16 2 16.672 2 17.5 L 2 24.5 C 2 25.328 2.672 26 3.5 26 C 4.328 26 5 25.328 5 24.5 L 5 17.5 C 5 16.672 4.328 16 3.5 16 M 6 26 C 6 26.552 6.448 27 7 27 L 8 27 L 8 30.5 C 8 31.328 8.672 32 9.5 32 C 10.328 32 11 31.328 11 30.5 L 11 27 L 13 27 L 13 30.5 C 13 31.328 13.672 32 14.5 32 C 15.328 32 16 31.328 16 30.5 L 16 27 L 17 27 C 17.552 27 18 26.552 18 26 L 18 16 L 6 16 L 6 26 Z"/>
            <group
                android:name="arm"
                android:pivotX="20.5"
                android:pivotY="17"
                android:rotation="-160">
                <path
                    android:name="path"
                    android:fillColor="#000"
                    android:pathData="M 20.5 16 C 19.672 16 19 16.672 19 17.5 L 19 24.5 C 19 25.328 19.672 26 20.5 26 C 21.328 26 22 25.328 22 24.5 L 22 17.5 C 22 16.672 21.328 16 20.5 16"/>
            </group>
        </vector>
    </aapt:attr>
    <target android:name="arm">
        <aapt:attr name="android:animation">
            <set>
                <objectAnimator
                    android:duration="300"
                    android:interpolator="@android:anim/decelerate_interpolator"
                    android:propertyName="rotation"
                    android:valueFrom="-160"
                    android:valueTo="0"
                    android:valueType="floatType"/>
            </set>
        </aapt:attr>
    </target>
</animated-vector>
```

</details>

Чтобы не писать XML вручную можно воспользоваться [онлайн инструментом](https://shapeshifter.design/).

Начиная с API 25 векторные анимации отрисовываются в RenderThread, поэтому, даже если мы загрузим чем-то наш UI Thread (но мы же никогда так не делаем, да?), анимации всё равно будут проигрываться плавно.

* Применение:

    Иконки

    Анимационные эффекты

* Достоинства:

    Производительность

* Недостатки:

    Нет возможности вручную управлять точкой анимации во времени (т.е. фактически отсутствует какой-либо метод, вроде setCurrentTime)

Все примеры можно посмотреть и изучить [здесь](https://github.com/JuzTosS/AnimationsDemo).

Предыдущая лекция | &nbsp; | Следующая лекция
:----------------:|:----------:|:----------------:
[Android Navigation.](./android_bottom_navigation.md) | [Содержание](../readme.md#практика-разработка-мобильных-приложений) | [Проект "каршеринг"](./android_auth.md)

