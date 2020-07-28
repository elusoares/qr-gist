import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanResult } from '@ionic-native/barcode-scanner/ngx';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/shared/authentication/authentication-service/authentication.service';

@Component({
  selector: 'open-gist',
  templateUrl: './open-gist.page.html',
  styleUrls: ['./open-gist.page.scss'],
})
export class OpenGistPage implements OnInit {
  @Input() gistId: string;
  constructor(
    public modalController: ModalController,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    console.log(this.gistId);
  }

  close() {
    this.modalController.dismiss();
  }

}
