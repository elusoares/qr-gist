import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { map, switchMap } from 'rxjs/operators';
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
    this.getUrlParams();
    
    
  }
  
  githubLogin() {
    // aqui chama o metodo que vai abrir o inapp browser e pegar o codigo quando ele vier
    this.authenticationService.authenticationGithub();
    
    // aqui vai se inscrever nesse observer pra receber o valor do codigo
    this.authenticationService.getCode()
      .subscribe((code) => {
        console.log(code);
        
        this.getTokenandUserData(code);
      });
  }

  getUrlParams() {
    // se inscreve pra receber parametros na url, que no caso
    // é o codigo do callback do github 
    this.activatedRoute.queryParams.subscribe((param) => {
      // ai depois que recebe o codigo, vai fazer uma requisiçao
      // pro servidor enviando o codigo, e ai ele faz a requisiçao pro
      // github pra receber o token e mandar de volta pra ca
      // tudo isso pq acessando a api do github direto tenho erro de cors policy 
      // e nao sei lidar com isso agora
      if (Object.keys(param).length > 0) {
        this.code = param.code;
        // requisiçao pro servidor para obter token e tambem user data
        this.getTokenandUserData(this.code);        
      } else {
      }
    });
  }

  getTokenandUserData(code: string) {
    this.authenticationService.getGithubToken(code)
    .pipe(
      map(user => {
        return user;
      }),
      switchMap(user => {
        // quando receber os dados do servidor, vai armazenar a foto do usuario
        return this.authenticationService.downloadUserProfilePicture(user.avatar_url);
      })
    )
      .subscribe((value) => {
        // ai esconde o loader e vai pra home
        this.loaderService.hideLoader();
        this.router.navigate(['/root/home']);
      },
      (error) => {
        console.log(error);
        // testa se ha um erro da api
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
