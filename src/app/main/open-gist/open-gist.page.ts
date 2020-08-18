import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

import { GistService } from 'src/app/shared/gist-service/gist.service';
import GistData from '../gist-data';
import { AuthenticationService } from 'src/app/shared/authentication/authentication-service/authentication.service';
import { Platform, IonContent } from '@ionic/angular';

@Component({
  selector: 'open-gist',
  templateUrl: './open-gist.page.html',
  styleUrls: ['./open-gist.page.scss'],
})
export class OpenGistPage implements OnInit {
  // pegar a referencia de ion-contet para que seja possivel ir ao fim da pagina ao clicar
  // no fab-button
  @ViewChild('content') content: IonContent;
  // armazena os dados do gist
  gistData: GistData;
  // essa flag fica verdadeira quando os dados sao carregados
  dataIsLoaded: boolean;
  // essa flag fica verdadeira quando o scroll atinge o bottom da page
  atBottom: boolean;
  // armazena a url do avatar do usuario
  userPhoto: string;
  // armazena o id do gist
  gistId: string;
  // armazena o comentario, pois não usei formulario
  comment: string;
  // se tiver escrevido alguma coisa o campo comentario, essa flag fica verdadeira e o botao ativado
  notCommented: boolean;
  constructor(
    private authenticationService: AuthenticationService,
    private gistService: GistService,
    private platform: Platform,
    private router: ActivatedRoute
  ) {
    this.gistData = new GistData();
    this.dataIsLoaded = false;
    // essa flag vai iniciar verdadeira, e fica falsa comforme vai scrolling a pagina
    this.atBottom = true;
    // inicializa a variavel de comentario
    this.comment = '';
    // inicializa a flag do botao comment
    this.notCommented = true;
   }


  ngOnInit() {
  }

  ionViewWillEnter() {
    // pega a foto do usuario
    this.getUserAvatar();
    // pega os dados dos gist
    this.getData();
    // observa o scroll para mostar/esconder o fabbutton
    this.scroll();
  }

  scroll() {
    // aqui subscribe to ionscroll 
    this.content.ionScroll.subscribe(event => {
      // sempre testando se chegou no fim da pagina
      this.detectBottom();
    });
  }

  // referencia:
  // https://stackoverflow.com/questions/60676745/angular-ionic-detect-if-ion-content-is-scrolled-maximum-bottom
  // essa funcao verifica se o scroll está no top ou bottom da pagina
  async detectBottom() {
    const scrollElement = await this.content.getScrollElement(); // get scroll element
   // quando chega no fim da pagina, a flag atBottom fica verdadeira
    if (
      scrollElement.scrollTop ===
      scrollElement.scrollHeight - scrollElement.clientHeight
    ) {
      this.atBottom = true;
    // mas se nao for o fim, fica falsa
    } else {
      this.atBottom = false;
    }

    // flag verdadeira: fab-buttom some
    // flag falsa: fab-buttom fica visível
  }

  // ao clicar no fab-buttom, vai para o fim da pagina, onde fica a opcao de comentar
  goToPageBottom() {
    this.content.scrollToBottom(300);
  }

  getData() {
    // primeiro extraio o gist_id de route parameters
    this.router.paramMap.pipe(
      // ai retorna o gist_id para o proximo switchmap
      map(params => {
        // armazena logo pra usar depois
        this.gistId = params.get('gist_id');
        return this.gistId;
      }),
      // esse switchmap vai pegar o gist_id e passar para a funçao getGist
      // de gistService, e ai retorna o observable
      switchMap(gist_id => {
        return this.gistService.getGist(gist_id);
      })
      // subscribe to the observable retornado pelo switchmap
    ).subscribe((gist: any) => {
      this.gistData = gist;
      this.dataIsLoaded = true;
    });
  }

  // consertar isso
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

  postComment() {
    const comment = this.comment;
    this.comment = '';
    this.gistService.postComment(this.gistId, comment)
      .subscribe(
        (value) => {
          console.log(value);
          this.getData();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  

  isCommented(): boolean {
    /* if (this.comment === '') {
      return false;
    } else {
      return true;
    } */
      
    return this.comment === '' ? false : true;
  }
}
