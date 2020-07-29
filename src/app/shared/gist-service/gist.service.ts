import { AuthenticationService } from 'src/app/shared/authentication/authentication-service/authentication.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';

const SERVER = 'http://192.168.0.103:3000';
@Injectable({
  providedIn: 'root'
})
export class GistService {
  private token: string;
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  getToken() {
    this.authenticationService.tokenGuard()
      .subscribe((token) => {
        console.log('token from gistservice');
        console.log(token);
        this.token = token;
      });
  }

  getGist(gistId: string) {
    return this.authenticationService.tokenValue()
    .pipe(
      map((token) => {
        return token;
      }),
      switchMap((token) => {
        console.log('token from gistservice');
        console.log(token);
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const params = new HttpParams().set('token', token).set('git_id', gistId);
        const options = {headers, params};
        return this.httpClient.get(`${SERVER}/get-gist`, options);
      })
    );
    
  }
}
