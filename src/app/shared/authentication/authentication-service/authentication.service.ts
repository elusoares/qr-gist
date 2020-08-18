import { Injectable } from '@angular/core';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { take, map, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, from, of, Subscription, Subject } from 'rxjs';
import { File } from '@ionic-native/file/ngx';  

import UserData from '../user-data';
import ServerData from '../server-data';
import { LoaderService } from '../../loader-service/loader.service';

const TOKEN_KEY = 'oauth-token';
const USER_KEY = 'oauth-user';
const AVATAR_KEY = 'oauth-avatar';
const SERVER = 'http://192.168.0.104:3000';

@Injectable({
  providedIn: 'root'
})
// segui esse tutorial: https://devdactic.com/ionic-4-jwt-login/
// sei que tem muita coisa embolada aqui, eu realmente estou aprendendo enquanto faço
export class AuthenticationService {
  private code: Subject<any>;
  private token: Observable<any>;
  private user: Observable<UserData>;
  private tokenData = new BehaviorSubject(null);
  private userData = new BehaviorSubject(null);
  codeurl: string;
  constructor(
    private inAppBrowser: InAppBrowser,
    private httpClient: HttpClient,
    private storage: Storage, 
    private platform: Platform,
    private file: File,
    private router: Router,
    private loaderService: LoaderService
  ) {
    // aqui cria uma especie de observable onde dados podem ser injetados depois, pelo que entendi
    this.code = new Subject();
    // aqui inicializa os observables de token e de user
    this.loadStoredToken();  
    this.loadStoredUser();
  }

  loadStoredToken() {
    // from converte promise para observable
    const platformObs = from(this.platform.ready()); 
    this.token = platformObs.pipe(
      switchMap(() => {
        return from(this.storage.get(TOKEN_KEY));
      }),
      map(data => {
        if (data) {
          console.log(data);
          console.log('tem token');
          this.tokenData.next(data);
          return true;
        } else {
          console.log('nao tem token');
          return null;
        }
      })
    );
  }

  loadStoredUser() {
    const platformObs = from(this.platform.ready()); 
    this.user = platformObs.pipe(
      switchMap(() => {
        return from(this.storage.get(USER_KEY));
      }),
      map(data => {
        if (data) {
          console.log(data);
          console.log('tem userdata');
          this.userData.next(data);
          return data;
        } else {
          console.log('nao tem token');
          return null;
        }
      })
    );
  }


  authenticationGithub() {
    // usa o inapp browser pra abrir o link de autenticaçao da api
    // nao me parece certo enviar o client_id da aplicaçao cliente, mas é o que consegui fazer funcionar
    const browser = this.inAppBrowser.create('https://github.com/login/oauth/authorize?client_id=044c62189110d6c5765b&scope=user%20gist'); 
    // a url de call back da api é a pagina de login 
    // entao fica esperando a url mudar pra localhost pra pegar o code
    const listener = browser.on('loadstart')
    /* .pipe(
      map(event => {
        return event.url;
      }),
      switchMap(url => {
        if (url.includes('localhost')) {
          console.log('é localhost');
          const codeData = url.split('=')[1];
          console.log(codeData);
          this.code.next(codeData);
          this.code.complete();
          browser.close();
          // return this.storage.set('code', url);
          // return codeData;
          // return this.code;
        }
      })
    ); */
    
    // return listener;
      .subscribe((event) => {
        console.log(event);
        const url = event.url;
        console.log(url);
        // se a url mudar e se tratar do callback
        if (url.includes('localhost')) {
          // ai coloca o code la na variavel que eh um observable
          const c = url.split('=')[1];
          console.log(c);
          this.code.next(c);
          this.code.complete();
          listener.unsubscribe();
          // fecha a janela
          browser.close();
        } 
      });

    
  }

  // retorna o observable de code
  getCode() {
    return this.code;
    // return this.storage.get('code');
  }

  // busca o token por intermedio do servidor node
  getGithubToken(code: string): Observable<UserData> {
    // mostra o loader
    this.loaderService.showLoader('Please wait...');
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('code', code);
    const options = {headers, params};

    return this.httpClient.get(`${SERVER}/get-token`, options).pipe(
      take(1),
      map<ServerData, ServerData>(data => {
        // Extract data
        return data;
      }),
      // aqui a ideia seria armazenar os dados antes de retornar o observable. 
      // acho que a forma que to armazenando nao ta correta, mas é o que funciona hehe
      switchMap(data => {
        this.tokenData.next(data.token);
        this.userData.next(data.user);
        // queria armazenar separado
        const storageObs = from(
          this.storage.set(TOKEN_KEY, data.token)
          .then((value) => {
            return this.storage.set(USER_KEY, data.user);
          })
        );
        return storageObs;
      })
    );
  }

  // acessar a profile picture com o link que a api retorna as vezes demora
  // entao resolvi armazenar o proprio arquivo localmente
  downloadUserProfilePicture(url: string) {
    return this.httpClient.get(url, {responseType: 'blob'})
      .pipe(
        take(1),
        map(image => {
          return image;
        }),
        switchMap(image => {
          // aqui apenas para fim de testar
          // quando executo no browser, nao consigo salvar usando o plugin file pois dá um erro de:
          // it was determined that certain files are unsafe for access within a web application...
          // entao no browser salvo usando o plugin storage
          // ja no android, nao consegui recuperar a imagem usando o storage, mas com o file sim
          if (this.platform.is('android')) {
            return this.storage.set(AVATAR_KEY, image);  
            // return this.file.writeFile(this.file.dataDirectory, 'avatar', image, {replace: true});      
          } else {
            return this.storage.set(AVATAR_KEY, image);    
          }
        })
      );
  }

  // retorna o arquivo blob da imagem
  getAvatar() {
    return this.storage.get('avatar');
  }
  
  // retorna o observable do token
  tokenGuard() {
    return this.token;
  }

  // retorna o observable do usuario (nome e link do avatar)
  userGuard() {
    return this.user;
  }

  tokenValue() {
    return this.tokenData;
  }
 
  // desloga
  logout() {
    this.storage.remove(TOKEN_KEY)
      .then((value) => {
        this.tokenData.next(null);
        return this.storage.remove(USER_KEY);
      })
      .then((value) => {
        this.userData.next(null);
        if (this.platform.is('android')) {
          return this.storage.remove(AVATAR_KEY);
          // return this.file.removeFile(this.file.dataDirectory, 'avatar');
        } else {
          return this.storage.remove(AVATAR_KEY);
        }
      })
      .then((value) => {
        // depois de remover os dados, vai pra login
        this.router.navigateByUrl('/login');
      });
  }
}
