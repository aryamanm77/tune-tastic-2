package com.aryaman.tunetastic;

import android.speech.tts.TextToSpeech;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.Locale;

@CapacitorPlugin(name = "NativeSpeech")
public class NativeSpeechPlugin extends Plugin implements TextToSpeech.OnInitListener {
    private TextToSpeech textToSpeech;
    private boolean ready;

    @Override
    public void load() {
        textToSpeech = new TextToSpeech(getContext(), this);
    }

    @Override
    public void onInit(int status) {
        ready = status == TextToSpeech.SUCCESS;
        if (ready) textToSpeech.setLanguage(Locale.getDefault());
    }

    @PluginMethod
    public void speak(PluginCall call) {
        if (!ready || textToSpeech == null) {
            call.reject("Text-to-speech is not ready");
            return;
        }

        String text = call.getString("text", "");
        textToSpeech.setPitch(call.getDouble("pitch", 1.0).floatValue());
        textToSpeech.setSpeechRate(call.getDouble("rate", 1.0).floatValue());
        textToSpeech.speak(text, TextToSpeech.QUEUE_FLUSH, null, "tunetastic-affirmation");
        call.resolve();
    }

    @PluginMethod
    public void stop(PluginCall call) {
        if (textToSpeech != null) textToSpeech.stop();
        call.resolve();
    }

    @Override
    protected void handleOnDestroy() {
        if (textToSpeech != null) {
            textToSpeech.stop();
            textToSpeech.shutdown();
        }
    }
}
