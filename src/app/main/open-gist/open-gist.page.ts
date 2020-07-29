import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanResult } from '@ionic-native/barcode-scanner/ngx';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/shared/authentication/authentication-service/authentication.service';
import { GistService } from 'src/app/shared/gist-service/gist.service';

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
    private gistService: GistService
  ) { }

  ngOnInit() {
    console.log(this.gistId);
  }

  ionViewWillEnter() {
    this.gistService.getGist(this.gistId)
      .subscribe((gist) => {
        console.log(gist);
      });
  }

  close() {
    this.modalController.dismiss();
  }

}
