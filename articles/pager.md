# ViewPager, Fragments, Tabs

В разметку окна добавляем **ViewPager**

```xml
<androidx.viewpager.widget.ViewPager
    android:id="@+id/pager"
    android:layout_width="match_parent"
    android:layout_height="match_parent"/>
```            

Создаем разметку и класс фрагмента (`fragment_main.xml`):

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="main"/>
</LinearLayout>
```

```kt
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment

class MainFragment : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater!!.inflate(R.layout.fragment_main, container, false)
    }
}
```

Добавляем аналогично ещё пару фрагментов

В классе главной activity создаём адаптер и привязываем его к ViewPager:

```kt
val fragmentAdapter = MyPageAdapter(supportFragmentManager)
val viewpager = findViewById<androidx.viewpager.widget.ViewPager>(R.id.pager)
viewpager.adapter = fragmentAdapter
```

Реализуем **MyPageAdapter** (пример на две страницы)

```kt
package ru.yotc.tabbed

import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentPagerAdapter

class MyPageAdapter (fm: FragmentManager) : FragmentPagerAdapter(fm) {

    override fun getItem(position: Int): Fragment {
        return when (position) {
            0 -> {
                MainFragment()
            }
            else -> SecondFragment()
        }
    }

    override fun getCount(): Int {
        return 2
    }

    override fun getPageTitle(position: Int): CharSequence {
        return when (position) {
            0 -> "First Tab"
            else -> "Second Tab"
        }
    }
}
```

Для отображения названия текущей страницы нужно добавить над **ViewPager** элемент **TabLayout**

```xml
<com.google.android.material.tabs.TabLayout
    android:id="@+id/tabLayout"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"/>
```

и в классе activity привязать его к ранее созданному **viewpager**

```kt
val tabs = findViewById<com.google.android.material.tabs.TabLayout>(R.id.tabLayout)
tabs.setupWithViewPager(viewpager)
```

Надо монимать, что у фрагментов свой жизненный цикл и всю логику надо переносить в класс соответсвующего фрагмента.