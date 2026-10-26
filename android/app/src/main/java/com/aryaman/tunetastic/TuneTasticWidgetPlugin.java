package com.aryaman.tunetastic;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.Executors;
import java.util.Calendar;
import java.util.HashSet;
import java.util.Set;

@CapacitorPlugin(name = "TuneTasticWidget")
public class TuneTasticWidgetPlugin extends Plugin {
    @PluginMethod
    public void updateNowPlaying(PluginCall call) {
        String title = call.getString("title", "TuneTastic");
        String artist = call.getString("artist", "Choose a song to start listening");
        String artwork = call.getString("artwork", "");
        String songId = call.getString("songId", "");
        boolean isPlaying = call.getBoolean("isPlaying", false);

        getContext().getSharedPreferences(TuneTasticWidgetProvider.PREFERENCES, Context.MODE_PRIVATE)
            .edit()
            .putString(TuneTasticWidgetProvider.TITLE, title)
            .putString(TuneTasticWidgetProvider.ARTIST, artist)
            .putBoolean(TuneTasticWidgetProvider.IS_PLAYING, isPlaying)
            .apply();
        recordWeeklyActivity(songId);
        TuneTasticWidgetProvider.updateAllWidgets(getContext());
        TuneTasticWeeklyWidgetProvider.updateAllWidgets(getContext());
        if (artwork.startsWith("http")) downloadArtwork(artwork);
        call.resolve();
    }

    private void recordWeeklyActivity(String songId) {
        android.content.SharedPreferences preferences = getContext().getSharedPreferences(TuneTasticWidgetProvider.PREFERENCES, Context.MODE_PRIVATE);
        Calendar now = Calendar.getInstance();
        String week = now.get(Calendar.YEAR) + "-" + now.get(Calendar.WEEK_OF_YEAR);
        String day = now.get(Calendar.YEAR) + "-" + now.get(Calendar.DAY_OF_YEAR);
        Set<String> songs = new HashSet<>(preferences.getStringSet(TuneTasticWeeklyWidgetProvider.WEEKLY_SONGS, new HashSet<>()));
        Set<String> days = new HashSet<>(preferences.getStringSet(TuneTasticWeeklyWidgetProvider.WEEKLY_DAYS, new HashSet<>()));

        if (!week.equals(preferences.getString(TuneTasticWeeklyWidgetProvider.WEEK_KEY, ""))) {
            songs.clear();
            days.clear();
        }
        if (!songId.isEmpty()) songs.add(songId);
        days.add(day);
        preferences.edit()
            .putString(TuneTasticWeeklyWidgetProvider.WEEK_KEY, week)
            .putStringSet(TuneTasticWeeklyWidgetProvider.WEEKLY_SONGS, songs)
            .putStringSet(TuneTasticWeeklyWidgetProvider.WEEKLY_DAYS, days)
            .apply();
    }

    private void downloadArtwork(String artworkUrl) {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                HttpURLConnection connection = (HttpURLConnection) new URL(artworkUrl).openConnection();
                connection.setConnectTimeout(10000);
                connection.setReadTimeout(10000);
                try (InputStream stream = connection.getInputStream()) {
                    Bitmap bitmap = BitmapFactory.decodeStream(stream);
                    if (bitmap == null) return;
                    File artworkFile = new File(getContext().getFilesDir(), TuneTasticWidgetProvider.ARTWORK_FILE);
                    try (FileOutputStream output = new FileOutputStream(artworkFile)) {
                        bitmap.compress(Bitmap.CompressFormat.PNG, 90, output);
                    }
                    TuneTasticWidgetProvider.updateAllWidgets(getContext());
                }
            } catch (Exception ignored) {
            }
        });
    }
}
