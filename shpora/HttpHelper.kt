// тут не забыть установить свой пакет
package ru.yotc.baza

import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import okio.IOException

/*
В манифест добавьте разрешение на работу с интернетом
<uses-permission android:name="android.permission.INTERNET" />

И, если на сайте нет сертификата, атрибут в тег **application**:
android:usesCleartextTraffic="true"

В зависимости проекта добавить билиотеку:
implementation 'com.squareup.okhttp3:okhttp:4.10.0'
*/

/*
Использование для GET-запросов:
Http.call("урл строка"){ response, error ->
    try {
        // если в запросе получено исключение, то "выбрасываем" его
        if (error != null) throw error

        // если ответ получен, но код не 200, то тоже "выбрасываем" исключение
        if (!response!!.isSuccessful) throw Exception(response.message)

        // тут обработка результата:
        // тело ответа как строка: response.body!!.string()
        // тело ответа как изображение: BitmapFactory.decodeStream(response.body!!.byteStream())

    } catch (e: Exception) {
        // любую ошибку показываем на экране
        runOnUiThread {
            AlertDialog.Builder(this)
                .setTitle("Ошибка")
                .setMessage(e.message)
                .setPositiveButton("OK", null)
                .create()
                .show()
            }
        }
    }
}
*/

/*
Использование для POST-запросов

val json = JSONObject()
json.put("username", userName)
json.put("password", password)

Http.call(
    Http.buildRequest(
        "http://s4a.kolei.ru/login",
        json.toString()
    )
) { response, error -> ... }
*/

/*
Использование для запросов с заголовками 
(обратите внимение, позиционного параметра data нет, 
поэтому используем именованный параметр headers)
Http.call(
    Http.buildRequest(
        "http://s4a.kolei.ru/Product",
        headers = mapOf("token" to token)
    )
) { response, error -> ... }
*/

object Http {
    private val client = OkHttpClient()

    fun buildRequest(
        url: String, 
        data: String? = null, 
        headers: Map<String, String>? = null): Request 
    {
        val request = Request.Builder().url(url)
        if (data != null) {
            val json = "application/json; charset=utf-8".toMediaTypeOrNull()
            request.post(data.toRequestBody(json))
        }

        if(headers!=null){
            for((key, value) in headers){
                request.addHeader(key, value)
            }
        }
        return request.build()
    }

    fun call(url: Any, callback: (response: Response?, error: Exception?)->Unit) {
        var request: Request = when (url) {
            is String -> Request.Builder()
                .url(url)
                .build()
            is Request -> url as Request
            else -> {
                callback.invoke(null, Exception("Не верный тип параметра \"url\""))
                return
            }
        }
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                callback.invoke(null, Exception(e.message!!))
            }

            override fun onResponse(call: Call, response: Response) {
                response.use {
                    callback.invoke(response, null)
                }
            }
        })
    }
}