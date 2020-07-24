import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult } from '@ionic-native/barcode-scanner/ngx';
import { Router, NavigationExtras } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { QrScannerService } from 'src/app/shared/qr-scanner.service';
import { OpenGistPage } from '../open-gist/open-gist.page';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.scss'],
})
export class QrScannerPage implements OnInit {
  options: BarcodeScannerOptions;
  navigationExtras: NavigationExtras;
  gotUrl: boolean;
  gistId: string;
  constructor(
    // usei BarcodeScanner porque o QRScanner tava muito chato de configurar
    // ficava se escondendo atras da pagina, tinha que usar window pra aplicar uma class css
    private barcodeScanner: BarcodeScanner,
    private qrScannerService: QrScannerService,
    public modalController: ModalController,
    private alertController: AlertController,
    private router: Router
  ) { 
    this.options = {
      prompt: 'Place a QR Code inside the viewfinder rectangle',
      formats: 'QR_CODE'
    };
    
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.scan();
  }

  scan() {
    // this.gotUrl = false;
    this.barcodeScanner.scan(this.options).then(qrCodeData => {
      console.log('Barcode data', qrCodeData);
      const url = qrCodeData.text;
      // maneira bem boba e nada eficiente de testar se o link é do github
      if (url !== '') {
        if (qrCodeData.text.includes('gist.github.com')) {
          const urlSplit = qrCodeData.text.split('/');
          // se for, pega a ultima parte do link que é o id
          this.gistId = urlSplit[urlSplit.length - 1];
          this.presentModal();
        } else {
          // se nao, dá um recadinho pro usuario
          this.presentAlert('Ops...', 'This is not a valid link.');
        }
      }
     }).catch(err => {
         console.log('Error', err);
     });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: OpenGistPage,
      cssClass: 'my-modal',
      componentProps: {
        gistId: this.gistId,
      }
    });
    return await modal.present();
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      header: header,
      // subHeader: 'Subtitle',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
