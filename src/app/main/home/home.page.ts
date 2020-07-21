import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/shared/authentication/authentication-service/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private menu: MenuController,
    private authenticationService: AuthenticationService
  ) {}

  openMenu() {
    console.log('cliquei open menu');
    this.menu.enable(true, 'main-menu');
    this.menu.open('main-menu');
  }
}
