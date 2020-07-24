import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RootComponent } from './root.component';
import { IonicModule } from '@ionic/angular';
import { MenuModule } from 'src/app/shared/menu/menu.module';



@NgModule({
  declarations: [
    RootComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    MenuModule
  ],
  exports: [
    RootComponent
  ]
})
export class RootModule { }
