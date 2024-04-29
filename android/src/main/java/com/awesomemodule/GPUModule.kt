package com.awesomemodule

import android.opengl.EGL14
import android.opengl.EGLDisplay

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap

class GPUModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "GPUModule"
    }

    @ReactMethod
    fun getGPUDetails(callback: Callback) {
        try {
            val display: EGLDisplay = EGL14.eglGetDisplay(EGL14.EGL_DEFAULT_DISPLAY)

            val gpuInfo = WritableNativeMap()
            gpuInfo.putString("vendor", EGL14.eglQueryString(display, EGL14.EGL_VENDOR))
            gpuInfo.putString("version", EGL14.eglQueryString(display, EGL14.EGL_VERSION))
            gpuInfo.putString("renderer", EGL14.eglQueryString(display, 12373)) // EGL_RENDERER value

            callback.invoke(null, gpuInfo)
        } catch (e: Exception) {
            val error = WritableNativeMap()
            error.putString("message", "Error getting GPU details: " + e.message)
            callback.invoke(error, null)
        }
    }
}
