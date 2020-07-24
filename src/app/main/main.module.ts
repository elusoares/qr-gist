import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { RootModule } from './root/root.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RootModule,
    MainRoutingModule
  ]
})
export class MainModule { }
