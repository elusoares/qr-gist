import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpenGistPage } from './open-gist.page';

const routes: Routes = [
  {
    path: '',
    component: OpenGistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpenGistPageRoutingModule {}
