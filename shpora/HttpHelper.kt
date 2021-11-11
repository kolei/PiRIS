package ru.yotc.myapplication

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import org.json.JSONObject
import java.io.*
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import javax.net.ssl.HttpsURLConnection

/*
Перед использованием не забудьте добавить в манифест

разрешение
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

И атрибут в тег application
android:usesCleartextTraffic="true"
*/

object HTTP
{
    private const val GET : String = "GET"
    private const val POST : String = "POST"
    /*
    @Throws(IOException::class)
    fun requestPOST(r_url: String, postDataParams: JSONObject): String? {
        val url = URL(r_url)
        val conn: HttpURLConnection = if(r_url.startsWith("https:", true))
            url.openConnection() as HttpsURLConnection
        else
            url.openConnection() as HttpURLConnection

        conn.readTimeout = 3000
        conn.connectTimeout = 3000
        conn.requestMethod = POST
        conn.doInput = true
        conn.doOutput = true
        val os: OutputStream = conn.outputStream
        val writer = BufferedWriter(OutputStreamWriter(os, "UTF-8"))
        writer.write(encodeParams(postDataParams))
        writer.flush()
        writer.close()
        os.close()
        val responseCode: Int = conn.responseCode // To Check for 200
        if (responseCode == HttpsURLConnection.HTTP_OK) {
            val `in` = BufferedReader(InputStreamReader(conn.inputStream))
            val sb = StringBuffer("")
            var line: String? = ""
            while (`in`.readLine().also { line = it } != null) {
                sb.append(line)
                break
            }
            `in`.close()
            return sb.toString()
        }
        return null
    }
    */

    fun getImage(url: String, callback: (result: Bitmap?, error: String)->Unit){
        Thread( Runnable {
            var image: Bitmap? = null
            var error = ""
            try {
                val `in` = URL(url).openStream()
                image = BitmapFactory.decodeStream(`in`)
            }
            catch (e: Exception) {
                error = e.message.toString()
            }
            callback.invoke(image, error)
        }).start()
    }

    fun requestGET(r_url: String, callback: (result: String?, error: String)->Unit) {
        Thread( Runnable {
            var error = ""
            var result: String? = null
            try {
                val obj = URL(r_url)

                val con: HttpURLConnection = if(r_url.startsWith("https:", true))
                    obj.openConnection() as HttpsURLConnection
                else
                    obj.openConnection() as HttpURLConnection

                con.requestMethod = GET
                val responseCode = con.responseCode

                result = if (responseCode == HttpURLConnection.HTTP_OK) { // connection ok
                    val `in` =
                        BufferedReader(InputStreamReader(con.inputStream))
                    var inputLine: String?
                    val response = StringBuffer()
                    while (`in`.readLine().also { inputLine = it } != null) {
                        response.append(inputLine)
                    }
                    `in`.close()
                    response.toString()
                } else {
                    null
                }
            }
            catch (e: Exception){
                error = e.message.toString()
            }

            callback.invoke(result, error)
        }).start()
    }

    @Throws(IOException::class)
    private fun encodeParams(params: JSONObject): String? {
        val result = StringBuilder()
        var first = true
        val itr = params.keys()
        while (itr.hasNext()) {
            val key = itr.next()
            val value = params[key]
            if (first) first = false else result.append("&")
            result.append(URLEncoder.encode(key, "UTF-8"))
            result.append("=")
            result.append(URLEncoder.encode(value.toString(), "UTF-8"))
        }
        return result.toString()
    }
}