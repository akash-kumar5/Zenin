package com.zeninv3

import android.content.Intent
import android.os.Bundle
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments

class NotificationTask : NotificationListenerService() {
    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        val extras = sbn?.notification?.extras
        val title = extras?.getString("android.title") ?: ""
        val text = extras?.getCharSequence("android.text")?.toString() ?: ""
        val packageName = sbn?.packageName

        Log.d("ZeninNotif", "Title: $title, Text: $text")

        val bundle = Bundle().apply {
            putString("title", title)
            putString("text", text)
            putString("packageName", packageName)
        }

        val serviceIntent = Intent(applicationContext, NotificationService::class.java)
        serviceIntent.putExtras(bundle)
        try {
            applicationContext.startService(serviceIntent)
            HeadlessJsTaskService.acquireWakeLockNow(applicationContext)
        }catch (e: Exception){
            Log.e("Zeninnoti","error ${e.message}")
        }
    }
}