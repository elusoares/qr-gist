import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent implements OnInit {

  constructor(
    // private menu: MenuController,
    private router: Router
  ) { 
    
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.goToHome();
  }
  /* openMenu() {
    console.log('cliquei open menu');
    this.menu.enable(true, 'main-menu');
    this.menu.open('main-menu');
  } */

  goToHome() {
    // this.router.navigate(['/home']);
  }
}
