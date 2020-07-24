import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { take, map, switchMap, flatMap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable, from, of, Subscription, Subject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import UserData from '../user-data';

const TOKEN_KEY = 'oauth-token';
const USER_KEY = 'oauth-user';
const SERVER = 'http://192.168.0.103:3000';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private code: Subject<any>;
  private token: Observable<any>;
  private user: Observable<UserData>;
  private tokenData = new BehaviorSubject(null);
  private userData = new BehaviorSubject(null);
  constructor(
    private inAppBrowser: InAppBrowser,
    private httpClient: HttpClient,
    private angularFireAuth: AngularFireAuth,
    private storage: Storage, 
    private platform: Platform,
    private router: Router 
  ) {
    /* firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then((token) => {
          console.log(token);

        });
      }
    }); */
    this.code = new Subject();
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
          this.tokenData.next(data);
          return true;
        } else {
          return null;
        }
      })
    );
  }

  loadStoredUser() {
    // from converte promise para observable
    const platformObs = from(this.platform.ready());
 
    this.user = platformObs.pipe(
      switchMap(() => {
        return from(this.storage.get(USER_KEY));
      }),
      map(data => {
        if (data) {
          this.userData.next(data);
          return data;
        } else {
          return null;
        }
      })
    );
  }


  authenticationGithub() {
    let browser = this.inAppBrowser.create('https://github.com/login/oauth/authorize?client_id=044c62189110d6c5765b'); 
    let listener = browser.on('loadstart')
      .subscribe((event) => {
        const url = event.url;
        console.log(url);
        if (url.includes('localhost')) {
          console.log('é localhost');
          this.code.next(url.split('=')[1]);
          this.code.complete();
          listener.unsubscribe();
          browser.close();
        } else {
          console.log('n eh localhost');
        }
      });
  }

  getCode() {
    return this.code;
  }

  getGithubToken(code: string) {
    console.log('cheguei aqui');
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('code', code);
    const options = {headers, params};

    return this.httpClient.get(`${SERVER}/get-token`, options).pipe(
      take(1),
      map(res => {
        // Extract data
        console.log(res);
        const storageObs = from(this.storage.set(TOKEN_KEY, res['token']));
        return res;
      }),
      // aqui a ideia seria armazenar os dados antes de retornar o observable. 
      // acho que a forma que to armazenando nao ta correta, mas é o que funciona
      switchMap(data => {
        console.log(data);
        this.tokenData.next(data['token']);
        this.userData.next(data['data']);
        // queria armazenar separado
        const storageObs = from(
          this.storage.set(TOKEN_KEY, data['token'])
          .then((value) => {
            return this.storage.set(USER_KEY, data['data']);
          }));
        return storageObs;
      })
    );
  }

  
  getTokenData() {
    return this.tokenData.getValue();
  }

  getUserData(): UserData {
    return this.userData.getValue();
  }

  tokenGuard() {
    return this.token;
  }

  userGuard() {
    return this.user;
  }
 
  logout() {
    this.storage.remove(TOKEN_KEY)
      .then((value) => {
        return this.storage.remove(USER_KEY);
      })
      .then((value) => {
        this.router.navigateByUrl('/login');
        this.tokenData.next(null);
      });
  }

  authenticationGithubOld() { // autentica no github com escopo gist
    // eu estava usando o código comentado abaixo, mas o then de signInWithRedirect nunca executava
    // entao getRedirectResult nunca era lido, não consegui descobrir porquê
    return this.angularFireAuth.signInWithRedirect(new firebase.auth.GithubAuthProvider().addScope('gist'));
    /* return new Promise((resolve, reject) => {
      this.angularFireAuth.signInWithRedirect(new firebase.auth.GithubAuthProvider().addScope('gist'))
        .then(() => {
          this.angularFireAuth.getRedirectResult()
            .then((result) => {
              console.log('user true');
              resolve(result);
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            });
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    }); */


  }

  userState() { // retorna um observable pra verificar se tem usuário logado ou não
    return this.angularFireAuth.authState;
  }

  /* userData() { // retorna os dados do usuário logado
    return this.angularFireAuth.currentUser;
  } */

  signOut() { // desloga
    return this.angularFireAuth.signOut();
  }
}
