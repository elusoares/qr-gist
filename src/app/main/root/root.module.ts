import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RootComponent } from './root.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    RootComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    RootComponent
  ]
})
export class RootModule { }
