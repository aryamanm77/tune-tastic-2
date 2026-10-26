package com.aryaman.tunetastic;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

import java.util.Collections;

public class TuneTasticWeeklyWidgetProvider extends AppWidgetProvider {
    static final String WEEK_KEY = "weekly_key";
    static final String WEEKLY_SONGS = "weekly_songs";
    static final String WEEKLY_DAYS = "weekly_days";

    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] ids) {
        for (int id : ids) updateWidget(context, manager, id);
    }

    static void updateAllWidgets(Context context) {
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        int[] ids = manager.getAppWidgetIds(new ComponentName(context, TuneTasticWeeklyWidgetProvider.class));
        for (int id : ids) updateWidget(context, manager, id);
    }

    private static void updateWidget(Context context, AppWidgetManager manager, int id) {
        SharedPreferences preferences = context.getSharedPreferences(TuneTasticWidgetProvider.PREFERENCES, Context.MODE_PRIVATE);
        int songs = preferences.getStringSet(WEEKLY_SONGS, Collections.emptySet()).size();
        int days = preferences.getStringSet(WEEKLY_DAYS, Collections.emptySet()).size();
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.tunetastic_weekly_widget);
        views.setTextViewText(R.id.weekly_songs, String.valueOf(songs));
        views.setTextViewText(R.id.weekly_days, String.valueOf(days));
        Intent intent = new Intent(context, MainActivity.class);
        PendingIntent openApp = PendingIntent.getActivity(context, 2002, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.weekly_open, openApp);
        manager.updateAppWidget(id, views);
    }
}
