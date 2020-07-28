import { Injectable } from '@angular/core';
import { BarcodeScanResult } from '@ionic-native/barcode-scanner/ngx';

@Injectable({
  providedIn: 'root'
})
export class QrScannerService {
  gistUrl: BarcodeScanResult;
  constructor() { }

  setGistUrl(gistUrl: BarcodeScanResult) {
    this.gistUrl = gistUrl;
  }

  getGistUrl() {
    return this.gistUrl;
  }
}
