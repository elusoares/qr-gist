import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/shared/authentication/authentication-service/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  userName: string;
  constructor(
    private menu: MenuController,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.getUserData();
  }

  openMenu() {
    console.log('cliquei open menu');
    this.menu.enable(true, 'main-menu');
    this.menu.open('main-menu');
  }

  getUserData() {
    /* this.authenticationService.userData()
      .then((user) => {
        this.userName = user.displayName;
      })
      .catch((error) => {
        console.log(error);
      }); */
      // this.userName = this.authenticationService.getUserData().name;
      this.authenticationService.userGuard()
        .subscribe((user) => {
          console.log(user.name);
          this.userName = user.name;
        });
  }

  goToQrScanner() {
    this.router.navigate(['/qr-scanner']);
  }
}
