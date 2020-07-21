import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication-service/authentication.service';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  userName: string;
  userEmail: string;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getUserData();
  }

  ionViewWillEnter() {
  }

  getUserData() {
    this.authenticationService.userData()
      .then((user) => {
        console.log(user);
        this.userEmail = user.email;
        this.userName = user.displayName;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  logout() {
    this.authenticationService.signOut()
      .then(() => {
        console.log('logged out');
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
