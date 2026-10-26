package com.aryaman.tunetastic;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;

import java.util.Calendar;
import java.util.TimeZone;

final class FestivalIconScheduler {
    private static final String[] LAUNCHERS = {
        "DefaultLauncher",
        "NewYearLauncher",
        "HoliLauncher",
        "IndependenceLauncher",
        "DiwaliLauncher",
        "ChristmasLauncher"
    };

    private FestivalIconScheduler() {}

    static void update(Context context) {
        String activeLauncher = getActiveLauncher();
        PackageManager packageManager = context.getPackageManager();

        for (String launcher : LAUNCHERS) {
            ComponentName component = new ComponentName(context, context.getPackageName() + "." + launcher);
            int state = launcher.equals(activeLauncher)
                ? PackageManager.COMPONENT_ENABLED_STATE_ENABLED
                : PackageManager.COMPONENT_ENABLED_STATE_DISABLED;
            packageManager.setComponentEnabledSetting(component, state, PackageManager.DONT_KILL_APP);
        }

        scheduleNextUpdate(context);
    }

    private static String getActiveLauncher() {
        Calendar now = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
        int month = now.get(Calendar.MONTH) + 1;
        int day = now.get(Calendar.DAY_OF_MONTH);

        if ((month == 1 && day <= 2) || (month == 12 && day == 31)) return "NewYearLauncher";
        if (month == 1 && day >= 26 && day <= 27) return "IndependenceLauncher";
        if (month == 3 && day >= 1 && day <= 3) return "HoliLauncher";
        if (month == 8 && day >= 14 && day <= 16) return "IndependenceLauncher";
        if (month == 10 && day >= 15 && day <= 27) return "DiwaliLauncher";
        if (month == 12 && day >= 24 && day <= 26) return "ChristmasLauncher";
        return "DefaultLauncher";
    }

    private static void scheduleNextUpdate(Context context) {
        Calendar midnight = Calendar.getInstance();
        midnight.add(Calendar.DAY_OF_YEAR, 1);
        midnight.set(Calendar.HOUR_OF_DAY, 0);
        midnight.set(Calendar.MINUTE, 5);
        midnight.set(Calendar.SECOND, 0);
        midnight.set(Calendar.MILLISECOND, 0);

        Intent intent = new Intent(context, FestivalIconReceiver.class);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(
            context,
            1001,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, midnight.getTimeInMillis(), pendingIntent);
    }
}
