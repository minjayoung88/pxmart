import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy, LoadingController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, NgxDatatableModule, HttpClientModule],
  providers: [
    StatusBar,
    SplashScreen,
    FileChooser,
    GoogleMaps,
    Geolocation,
    FilePath,
    File,
    FileOpener,
    HTTP,
    LoadingController,
    CallNumber,
    NativeStorage,
    AlertController,
    
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
