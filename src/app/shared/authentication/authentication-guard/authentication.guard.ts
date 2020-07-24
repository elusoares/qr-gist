import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AuthenticationService } from '../authentication-service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      /* return new Promise((resolve, reject) => {
        
        this.authenticationService.userState()
        .subscribe((user) => {
          if (user) {
            console.log(user);
            console.log('authentication guard: user is logged in');
            resolve(true);
          } else {
            console.log('authentication guard: user is not logged in');
            this.router.navigate(['/login']);
            resolve(false);
          }
        }, (error) => {
          console.log(error);
          reject(error);
        });
      }); */
      return this.authenticationService.tokenGuard().pipe(
        take(1),
        map(token => {
          if (!token) {
            console.log(token);
            console.log('authentication guard: user is not logged in');
            this.router.navigateByUrl('/login');
            return false;
          } else {
            console.log(token);
            console.log('authentication guard: user is logged in');
            return true;
          }
        })
      );
  }
}
