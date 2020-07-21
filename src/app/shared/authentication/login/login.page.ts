import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication-service/authentication.service';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }
    ionViewWillEnter() {
      /* firebase.auth().getRedirectResult().then((result) => {
        console.log(result);
        if (!result) {
          // User not logged in, start login.
          console.log('from login page User not logged in, start login');
        } else {
          // user logged in, go to home page.
          console.log('from login page user logged in, go to home page.');
        }
      }).catch((error) => {
        // Handle Errors here.
        console.log(error);
        // ...
      }); */

      this.authenticationService.userState().subscribe((res) => {
        console.log(res);
        if (res) {
          this.router.navigate(['/home']);
        }
      });
    }
  ngOnInit() {
    /* this.authenticationService.userState().subscribe((res) => {
      console.log(res);
      if (res) {
        this.router.navigate(['/home']);
      }
    }); */
     // This gives you a GitHub Access Token.
  //  var token = result.credential.accessToken;
   // The signed-in user info.
  //  var user = result.user;
  }

  githubLogin() {
    // funciona com sign in with popup:
    this.authenticationService.authenticationGithub()
      .then((result) => {
        console.log(result);
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.log(error);
      });

      /* let provider = new firebase.auth.GithubAuthProvider();
      provider.addScope('gist'); */
      /* firebase.auth().getRedirectResult().then((result) => {
        if (!result) {
          // User not logged in, start login.
          console.log('User not logged in, start login');
        } else {
          // user logged in, go to home page.
          console.log('user logged in, go to home page.');
        }
      }).catch((error) => {
        // Handle Errors here.
        console.log(error);
        // ...
      });
 */
      // retorna user null: 
      /* firebase.auth().signInWithPopup(provider)
        .then(() => {
          firebase.auth().getRedirectResult()
            .then((result) => {
              console.log(result);
              this.router.navigate(['/home']);
            })
            .catch((error) => {
              console.log(error);
            });
          }); */

      /* firebase.auth().signInWithRedirect(provider)
        .then(() => {
          firebase.auth().getRedirectResult()
            .then((result) => {
              console.log(result);
              this.router.navigate(['/home']);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        }); */
        

  }

}
