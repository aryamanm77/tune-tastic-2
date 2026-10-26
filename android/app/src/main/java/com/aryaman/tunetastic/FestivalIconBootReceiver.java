package com.aryaman.tunetastic;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class FestivalIconBootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        FestivalIconScheduler.update(context);
    }
}
