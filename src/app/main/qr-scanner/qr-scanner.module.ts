import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrScannerPageRoutingModule } from './qr-scanner-routing.module';

import { QrScannerPage } from './qr-scanner.page';
import { OpenGistPageModule } from '../open-gist/open-gist.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // OpenGistPageModule,
    QrScannerPageRoutingModule
  ],
  declarations: [QrScannerPage]
})
export class QrScannerPageModule {}
