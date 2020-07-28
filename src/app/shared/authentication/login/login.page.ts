import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { map, switchMap } from 'rxjs/operators';

import { AuthenticationService } from '../authentication-service/authentication.service';
import { LoaderService } from '../../loader-service/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  code: string;
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private loaderService: LoaderService
  ) { }
  
  ngOnInit() {
  }

  ionViewWillEnter() {
    
    
  }
  
  githubLogin() {
    // aqui chama o metodo que vai abrir o inapp browser e pegar o codigo quando ele vier
    this.authenticationService.authenticationGithub();
    
    // aqui vai se inscrever nesse observer pra receber o valor do codigo
    this.authenticationService.getCode()
      .subscribe((code) => {
        console.log('de login page');
        console.log(code);
        this.getTokenandUserData(code);
      },
    (error) => console.log(error));
  }

  getTokenandUserData(code: string) {
    this.authenticationService.getGithubToken(code)
    .pipe(
      map((userData) => {
        return userData.avatar_url;
      }),
      switchMap((avatarUrl) => {
        return this.authenticationService.downloadUserProfilePicture(avatarUrl);
      })
    )
      .subscribe((value) => {
        console.log(value);
        this.loaderService.hideLoader();
        this.router.navigate(['/root/home']);
      },
      (error) => {
        console.log(error);
        this.loaderService.hideLoader();
        if (error.status === 401) {
          this.presentAlert('Ops...', 'Your credentials are not valid.');
        }
      });
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
