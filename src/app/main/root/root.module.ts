import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RootComponent } from './root.component';




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
