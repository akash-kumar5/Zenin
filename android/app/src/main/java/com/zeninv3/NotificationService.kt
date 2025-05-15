package com.zeninv3

import android.content.Intent
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig

class NotificationService : HeadlessJsTaskService() {
    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig? {
        val extras = intent?.extras ?: return null;
        val data = Arguments.fromBundle(extras);
            return HeadlessJsTaskConfig(
                "NotificationHandler",
                data,
                5000,
                true
            )
    }
}