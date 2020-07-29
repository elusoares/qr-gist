import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/authentication/authentication-service/authentication.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { File, FileReader } from '@ionic-native/file/ngx';  
import { Platform } from '@ionic/angular';

@Component({
  selector: 'profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userPhoto: string;
  userName: string;
  constructor(
    private authenticationService: AuthenticationService,
    private file: File,
    private platform: Platform,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {    
  }

  ionViewWillEnter() {
    this.getUserData();
    this.getUserAvatar();
  }

  getUserData() {
    this.authenticationService.userGuard()
      .subscribe((user) => {
        this.userName = user.name;
      });
  }

  getUserAvatar() {
    // se for android, usa o plugin file pra ler a foto
    if (this.platform.is('android')) {
      /* this.file.readAsDataURL(this.file.dataDirectory, 'avatar')
        .then((url) => {
          this.userPhoto = url;
        }); */
      this.authenticationService.getAvatar()
      .then((avatar) => {
        const blob = new Blob([avatar], { type: 'image/jpeg' });
        this.userPhoto =  URL.createObjectURL(blob);
      })
      .catch((error) => {
        console.log(error);
      });
    } else {
     // se nao, entao é o browser que to usando pra testar e o file nao ta funcionando la nao 
      this.authenticationService.getAvatar()
        .then((avatar) => {
          const blob = new Blob([avatar], { type: 'image/jpeg' });
          this.userPhoto =  URL.createObjectURL(blob);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  logout() {
      this.authenticationService.logout();
  }
}
