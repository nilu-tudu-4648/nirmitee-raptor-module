package com.awesomemodule

import android.os.SystemClock
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SystemUptimeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "SystemUptimeModule"
    }

    @ReactMethod
    fun getSystemUptime(callback: Callback) {
        val uptime = SystemClock.elapsedRealtime() // Get uptime in milliseconds
        callback.invoke(uptime.toDouble()) // Convert to Double for JavaScript compatibility
    }
}
