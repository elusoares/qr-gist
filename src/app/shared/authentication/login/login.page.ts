import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication-service/authentication.service';
import * as firebase from 'firebase/app';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

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
    private storage: Storage, 
    private alertController: AlertController
  ) { }
  
  ngOnInit() {
  }

  ionViewWillEnter() {
    /* this.authenticationService.userState().subscribe((res) => {
      console.log(res);
      if (res) {
        this.router.navigate(['/home']);
      }
    }); */

    // this.getUrlParams();
  }
  

  githubLogin() {
    /* this.authenticationService.authenticationGithub()
      .then((result) => {
        // por algum motivo que não descobri, esse then não é executado, embora o usuário logue
        // então tive que verificar o login em ionViewWillEnter
        console.log(result);
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.log(error);
      }); */
      this.authenticationService.authenticationGithub();
      this.authenticationService.getCode()
        .subscribe((code) => {
          console.log('code');
          console.log(code);
          this.getTokenandUserData(code);
        });

      /* this.httpClient.get('http://localhost:3000/authorize').subscribe((result) => {
        console.log(result);
      },
      (error) => {
        console.log(error);
      }); */

      /* const headers = new HttpHeaders();
      headers.set('client_id', '044c62189110d6c5765b');
      this.httpClient.get('https://github.com/login/oauth/authorize', { headers: headers})
        .subscribe((result) => {
          console.log(result);
        },
        (error) => {
          console.log(error);
        }); */
  }

  getUrlParams() {
    // se inscreve pra receber parametros na url, que no caso
    // é o code do callback do github 
    this.activatedRoute.queryParams.subscribe((param) => {
      // ai depois que recebe o code, vai fazer uma requisiçao
      // pro servidor enviando o code, e ai ele faz a requisiçao pro
      // github pra receber o token e mandar de volta pra ca
      // tudo isso pq acessando a api do github direto tenho erro de cors policy 
      // e nao sei lidar com isso agora
      if (Object.keys(param).length > 0) {
        this.code = param.code;
        console.log('tem param');
        // requisiçao pro servidor para obter token e tambem user data
        this.getTokenandUserData(this.code);
        // console.log(this.code);
      /* 
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const params = new HttpParams().set('code', this.code);
        const options = {headers, params}; */

        /* this.httpClient.get('http://localhost:3000/get-token', options)
          .subscribe((response) => {
            console.log(response);
            
          },
          (error) => {
            console.log(error);
            if (error.status === 401) {
              this.presentAlert('Ops...', 'Your credentials are not valid.');
            }
          }); */
        
      } else {
        console.log('nao tem param');
      }
    });
  }

  getTokenandUserData(code: string) {
    this.authenticationService.getGithubToken(code)
      .subscribe((value) => {
        console.log(value);
        this.router.navigate(['/root/home']);
      },
      (error) => {
        console.log(error);
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
