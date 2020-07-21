import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { MainModule } from './main/main.module';
import { firebaseConfig } from 'src/environments/environment';
import { AuthenticationGuard } from './shared/authentication/authentication-guard/authentication.guard';
import { LoginGuard } from './shared/authentication/login-guard/login.guard';

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    HttpClientModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AppRoutingModule,
    MainModule,
    SharedModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    AuthenticationGuard,
    LoginGuard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
