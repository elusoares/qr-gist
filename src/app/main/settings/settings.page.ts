import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/authentication/authentication-service/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  userPhoto: string;
  userName: string;
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    // this.userPhoto = this.authenticationService.getUserData().avatar_url;
    // this.userName = this.authenticationService.getUserData().name;
    this.authenticationService.userGuard()
      .subscribe((user) => {
        console.log(user);
        this.userPhoto = user.avatar_url;
        this.userName = user.name;
      });
  }

  logout() {
    /* this.authenticationService.signOut()
      .then(() => {
        console.log('logged out');
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.log(error);
      }); */
      this.authenticationService.logout();
  }
}
