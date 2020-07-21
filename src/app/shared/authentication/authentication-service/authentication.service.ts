import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private angularFireAuth: AngularFireAuth
  ) {
   }

  authenticationGithub() {
    // funciona:
    // return this.angularFireAuth.signInWithPopup(new firebase.auth.GithubAuthProvider().addScope('gist'));
    
    return this.angularFireAuth.signInWithRedirect(new firebase.auth.GithubAuthProvider().addScope('gist'));
    
    /* this.angularFireAuth.signInWithRedirect(new firebase.auth.GithubAuthProvider().addScope('gist'))
      .then((result) => {
        return firebase.auth().getRedirectResult();
      })
      .catch((error) => {
        console.log(error);
      }); */

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

  userState() {
    return this.angularFireAuth.authState;
  }

  userData() {
    return this.angularFireAuth.currentUser;
  }

  signOut() {
    return this.angularFireAuth.signOut();
  }
}
