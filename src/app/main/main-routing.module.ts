import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from '../shared/authentication/authentication-guard/authentication.guard';
import { HomePage } from './home/home.page';
import { RootComponent } from './root/root.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/root/home',
    pathMatch: 'full'
  },
  {
    path: 'root',
    component: RootComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
        /* canActivate: [
          AuthenticationGuard
        ] */
      },
      {
        path: 'qr-scanner',
        loadChildren: () => import('./qr-scanner/qr-scanner.module').then( m => m.QrScannerPageModule),
        /* canActivate: [
          AuthenticationGuard
        ] */
      },
      /* {
        path: 'open-gist',
        loadChildren: () => import('./open-gist/open-gist.module').then( m => m.OpenGistPageModule)
      }, */
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
      },
    ],
    canActivate: [
      AuthenticationGuard
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MainRoutingModule { }
