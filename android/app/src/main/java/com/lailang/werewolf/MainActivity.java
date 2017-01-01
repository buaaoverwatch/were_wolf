package com.lailang.werewolf;

import com.facebook.react.ReactActivity;
import com.github.yamill.orientation.OrientationPackage;
import android.content.Intent;
import android.content.res.Configuration;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

import com.zmxv.RNSound.RNSoundPackage;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "were_wolf";
    }
    @Override
    public void onConfigurationChanged(Configuration newConfig) {
            super.onConfigurationChanged(newConfig);
            Intent intent = new Intent("onConfigurationChanged");
            intent.putExtra("newConfig", newConfig);
            this.sendBroadcast(intent);
    }

    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNSoundPackage() // <-- New
        );
    }
}
