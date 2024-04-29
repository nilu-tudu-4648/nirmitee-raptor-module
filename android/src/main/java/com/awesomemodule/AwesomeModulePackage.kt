package com.awesomemodule  // Replace with your actual package name

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.awesomemodule.MyAppPackage  // Assuming MyAppPackage is in the same directory

class AwesomeModulePackage : ReactPackage {

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        val modules = mutableListOf<NativeModule>()

        // Add your existing native modules here (if any)
        modules.add(AwesomeModuleModule(reactContext)) // Assuming this is your existing module

        // Add modules from MyAppPackage (if any)
        modules.addAll(MyAppPackage().createNativeModules(reactContext))

        return modules
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList() // Assuming you don't have any custom view managers
    }
}
