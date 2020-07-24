import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrScannerPage } from './qr-scanner.page';

const routes: Routes = [
  {
    path: '',
    component: QrScannerPage,
    /* children: [
      {
        path: 'open-gist',
        loadChildren: () => import('../open-gist/open-gist.module').then( m => m.OpenGistPageModule)
      },
    ] */
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrScannerPageRoutingModule {}
