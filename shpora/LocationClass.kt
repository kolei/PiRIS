/*
В манифест добавить разрешеня на геолокацию

<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

Пример использования класса

// в классе главного окна объявляете переменную
private lateinit val locationClass: LocationClass

// в конструкторе основного класса создайте экземпляр этого класса
locationClass = LocationClass(this) { lat, lon ->
    if(lat != null && lon != null) {
        Toast.makeText(this, "$lat/$lon", Toast.LENGTH_SHORT).show()
    }
}

// в классе главного окна реализуйте метод 
override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<String>,
                                        grantResults: IntArray) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults)
    locationClass.onRequestPermissionsResult(requestCode, grantResults)
}
*/

// package тут не забыть установить свой пакет

import android.Manifest
import android.app.Activity
import android.content.pm.PackageManager
import android.os.Looper
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.google.android.gms.location.*

typealias MyLocationCallback = (Double?, Double?) -> Unit

@Suppress("DEPRECATION", "DEPRECATED_IDENTITY_EQUALS")
class LocationClass(
    private val activity: Activity,
    private val callback: MyLocationCallback
){
    private var fusedLocationClient: FusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(activity)
    private lateinit var mLocationRequest: LocationRequest
    private var mLocationCallback: LocationCallback

    init {
        mLocationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                if (locationResult.locations.isNotEmpty()) {
                    val locIndex = locationResult.locations.size - 1
                    val lon = locationResult.locations[locIndex].longitude
                    val lat = locationResult.locations[locIndex].latitude
                    onGetCoordinates(lat, lon)
                }
            }
        }
        checkPermission()
    }

    fun onRequestPermissionsResult(
        requestCode: Int,
        grantResults: IntArray)
    {
        when (requestCode) {
            1 -> {
                if (grantResults.isNotEmpty() && grantResults[0] ==
                    PackageManager.PERMISSION_GRANTED) {
                    if ((ContextCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_FINE_LOCATION) === PackageManager.PERMISSION_GRANTED))
                    {
                        checkPermission()
                    }
                } else {
                    callback.invoke(null, null)
                }
                return
            }
        }
    }

    private fun checkPermission(){
        if (ActivityCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
            ActivityCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED)
        {
            // нет разрешений - запрашиваем
            val permissions = arrayOf(
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION
            )
            ActivityCompat.requestPermissions(activity, permissions, 1)
        } else {
            // есть разрешения - запускаем периодический опрос геолокации
            mLocationRequest = LocationRequest()
            mLocationRequest.interval = 10000
            mLocationRequest.fastestInterval = 1000
            mLocationRequest.priority = LocationRequest.PRIORITY_HIGH_ACCURACY
            fusedLocationClient.requestLocationUpdates(mLocationRequest, mLocationCallback, Looper.myLooper())
        }
    }


    fun onGetCoordinates(lat: Double, lon: Double) {
        fusedLocationClient.removeLocationUpdates(mLocationCallback)
        callback.invoke(lat, lon)
    }
}