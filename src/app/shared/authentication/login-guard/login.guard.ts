import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { AuthenticationGuard } from '../authentication-guard/authentication.guard';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private authenticationGuard: AuthenticationGuard,
    private router: Router
  ){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Promise((resolve, reject) => {
        // funciona:
        this.router.events.subscribe((res) => {
            console.log(this.router.url);
            if (this.router.url === '/login') {
              console.log('estamos em login');
              resolve(true);
            } else {
              resolve(false);
            }
            
          },
          (error) => {
            reject(error);
          });
      });

      /* if (this.authenticationGuard.getGuardAuthentication()) {
        this.router.navigate(['/home']);
      }
      return true; */
  }
  
}
