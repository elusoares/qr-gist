import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { map, switchMap } from 'rxjs/operators';

import { AuthenticationService } from '../authentication-service/authentication.service';
import { LoaderService } from '../../loader-service/loader.service';
import { AlertService } from '../../alert-service/alert.service';

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
    private alertService: AlertService,
    private loaderService: LoaderService
  ) { }
  
  ngOnInit() {
  }

  ionViewWillEnter() {
    // nao era pra ter esse metodo, mas aconteceu um acidente com o repositorio git e bagunçou muita coisa por aqui
    this.getUrlParams();
    
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
        console.log(param.code);
        this.code = param.code;
        console.log('tem param');
        // requisiçao pro servidor para obter token e tambem user data
        this.getTokenandUserData(this.code);
     } else {
        console.log('nao tem param');
      }
    });
  }
  
  githubLogin() {
    // aqui chama o metodo que vai abrir o inapp browser e pegar o codigo quando ele vier
    this.authenticationService.authenticationGithub();
   /*  .subscribe((res) => {
      console.log(res);
    },
    (error) => {
      console.log(error);
    }); */
    /* .subscribe((code) => {
      console.log('code loginpage');
      console.log(code);
      this.getTokenandUserData(code);
    }); */
    
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
          this.alertService.presentAlert('Ops...', 'Your credentials are not valid.');
        }
      });
    }
    
  

}
