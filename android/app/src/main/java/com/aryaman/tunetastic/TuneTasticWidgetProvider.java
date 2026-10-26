package com.aryaman.tunetastic;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.widget.RemoteViews;

import java.io.File;
import java.util.Calendar;
import java.util.TimeZone;

public class TuneTasticWidgetProvider extends AppWidgetProvider {
    static final String PREFERENCES = "tunetastic_widget";
    static final String TITLE = "title";
    static final String ARTIST = "artist";
    static final String IS_PLAYING = "is_playing";
    static final String ARTWORK_FILE = "tunetastic_widget_artwork.png";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId);
        }
    }

    static void updateAllWidgets(Context context) {
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        ComponentName provider = new ComponentName(context, TuneTasticWidgetProvider.class);
        int[] appWidgetIds = appWidgetManager.getAppWidgetIds(provider);
        for (int appWidgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId);
        }
    }

    private static void updateWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        SharedPreferences preferences = context.getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE);
        String title = preferences.getString(TITLE, "TuneTastic");
        String artist = preferences.getString(ARTIST, "Choose a song to start listening");
        boolean isPlaying = preferences.getBoolean(IS_PLAYING, false);

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.tunetastic_widget);
        views.setTextViewText(R.id.widget_title, title);
        views.setTextViewText(R.id.widget_artist, artist);
        views.setTextViewText(R.id.widget_status, isPlaying ? "NOW PLAYING" : "READY TO PLAY");
        File artworkFile = new File(context.getFilesDir(), ARTWORK_FILE);
        Bitmap artwork = BitmapFactory.decodeFile(artworkFile.getAbsolutePath());
        if (artwork != null) views.setImageViewBitmap(R.id.widget_artwork, artwork);
        else views.setImageViewResource(R.id.widget_artwork, getWidgetIcon());

        Intent openAppIntent = new Intent(context, MainActivity.class);
        openAppIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent openApp = PendingIntent.getActivity(
            context,
            2001,
            openAppIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_open, openApp);
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    private static int getWidgetIcon() {
        Calendar now = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
        int month = now.get(Calendar.MONTH) + 1;
        int day = now.get(Calendar.DAY_OF_MONTH);

        if ((month == 1 && day <= 2) || (month == 12 && day == 31)) return R.drawable.icon_newyear;
        if (month == 1 && day >= 26 && day <= 27) return R.drawable.icon_independence;
        if (month == 3 && day >= 1 && day <= 3) return R.drawable.icon_holi;
        if (month == 8 && day >= 14 && day <= 16) return R.drawable.icon_independence;
        if (month == 10 && day >= 15 && day <= 27) return R.drawable.icon_diwali;
        if (month == 12 && day >= 24 && day <= 26) return R.drawable.icon_christmas;
        return R.drawable.icon_default;
    }
}
