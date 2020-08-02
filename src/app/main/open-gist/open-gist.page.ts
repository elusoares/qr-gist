import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

import { GistService } from 'src/app/shared/gist-service/gist.service';
import GistData from '../gist-data';

@Component({
  selector: 'open-gist',
  templateUrl: './open-gist.page.html',
  styleUrls: ['./open-gist.page.scss'],
})
export class OpenGistPage implements OnInit {
  gistData: GistData;
  dataIsLoaded: boolean;
  constructor(
    private gistService: GistService,
    private router: ActivatedRoute
  ) {
    this.gistData = new GistData();
    this.dataIsLoaded = false;
   }


  ngOnInit() {
  }

  ionViewWillEnter() {
    // primeiro extraio o gist_id de route parameters
    this.router.paramMap.pipe(
      // ai retorna o gist_id para o proximo switchmap
      map(params => {
        return params.get('gist_id');
      }),
      // esse switchmap vai pegar o gist_id e passar para a funçao getGist
      // de gistService, e ai retorna o observable
      switchMap(gist_id => {
        return this.gistService.getGist(gist_id);
      })
      // subscribe to the observable retornado pelo switchmap
    ).subscribe((gist: any) => {
      console.log(gist);
      this.gistData = gist;
      this.dataIsLoaded = true;
    });
  }
}
