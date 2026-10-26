package com.aryaman.tunetastic;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(TuneTasticWidgetPlugin.class);
        registerPlugin(NativeSpeechPlugin.class);
        registerPlugin(TuneTasticCameraPlugin.class);
        super.onCreate(savedInstanceState);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
            && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, 3001);
        }
    }

    @Override
    public void onStart() {
        super.onStart();
        FestivalIconScheduler.update(this);
    }
}
