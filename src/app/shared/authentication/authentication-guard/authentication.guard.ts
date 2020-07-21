import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication-service/authentication.service';
import * as firebase from 'firebase/app';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  loggedIn: boolean;
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private navController: NavController
  ){
    this.loggedIn = false;
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Promise((resolve, reject) => {
        // funciona:
        this.authenticationService.userState()
        .subscribe((user) => {
          if (user) {
            console.log('from authentication: logado');
            resolve(true);
          } else {
            this.loggedIn = false;
            console.log('from authentication: User is not logged in');
            this.router.navigate(['/login']);
            resolve(false);
          }
        }, (error) => {
          console.log(error);
          reject(error);
        });

        /* firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            console.log('logado');
            resolve(true);
          } else {
            resolve(false);
            console.log('User is not logged in');
            this.router.navigate(['/login']);
          }
        }); */

        /* firebase.auth().getRedirectResult().then((result) => {
          console.log(result);
          if (!result) {
            // User not logged in, start login.
            resolve(false);
            console.log('User not logged in, start login');
            this.router.navigate(['/login']);
          } else {
            // user logged in, go to home page.
            console.log('user logged in, go to home page.');
            resolve(true);
          }
        }).catch((error) => {
          // Handle Errors here.
          console.log(error);
          // ...
        }); */
      });
  }

  public getGuardAuthentication(): boolean {
    return this.loggedIn;
  }
}
