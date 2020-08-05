import { AuthenticationService } from 'src/app/shared/authentication/authentication-service/authentication.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import GistData from 'src/app/main/gist-data';
import UserData from '../authentication/user-data';
import GistFile from 'src/app/main/gist-file';
import GistComment from 'src/app/main/gist-comment';
import { Subject, BehaviorSubject } from 'rxjs';

const SERVER = 'http://192.168.0.103:3000';
@Injectable({
  providedIn: 'root'
})
export class GistService {
  gistData: GistData;
  
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) { 
    this.gistData = new GistData();
  }

  // método para buscar um determinado gist
  getGist(gistId: string) {
    // primeiro pega o token de authenticationService
    return this.authenticationService.tokenValue()
    .pipe(
      map((token) => {
        // retorna o token para o primeiro switchmap
        return token;
      }),
      // esse switchmap pega o token, prepara tudinho para fazer uma requisiçao ao servidor proxy,
      // depois retorna o observable de buscar o gist no servidor proxy
      switchMap((token) => {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const params = new HttpParams().set('token', token).set('gist_id', gistId);
        const options = {headers, params};
        return this.httpClient.get(`${SERVER}/get-gist`, options);
      }),
      // esse switchmap pega o gist do observable anterior e faz uns tratamentos nele,
      // que é guardar os dados numa variavel global.
      // depois retorna o observable de buscar os comments do gist
      switchMap((gist) => {
        // algumas variaveis necessarias aqui nesse switchmap
        const gistOwner = new UserData();
        const gistFiles = new Array<GistFile>();
        
        // dados de owner
        const owner = gist['owner'];
        gistOwner.setData(owner['login'], owner['avatar_url']);

        // dados de gistData (owner e data de criaçao)
        this.gistData.owner = gistOwner;
        this.gistData.created_at = gist['created_at'];

        // dados de gistData (files)
        const files = gist['files'];
        // esse variavel i é apenas para pegar o primeiro nome de arquivo para ficar no titulo, junto com o nome do owner
        let i = 0;
        // esse for é para pegar as chaves referente a cada arquivo dentro do json
        for (const key of Object.keys(files)) {
          if (i === 0) {
            // isso sera executado apenas na primeira iteraçao
            this.gistData.file_title = key;
            i++;
          }
          const f = files[key];
          // dados de um file
          const gistFile = new GistFile(f['filename'], f['type']);
          // ai esse file é incluido no array de files
          gistFiles.push(gistFile);
        }
        // o array de files é colocado la no gistData
        this.gistData.files = gistFiles;
        return this.getComments(gist['id']);
        }),
        // esse switchmap recebe os comments retornados no switchmap anterior,
        // extrai dos comments os dados que me interessam
        // e retonra um behaviorSubject para opengistpage, com o valor completo de gistdata
        switchMap((comments) => {
          const gistComments = new Array<GistComment>();
          for (const key of Object.keys(comments)) {
            const c = comments[key];
            const user = new UserData();
            // em alguns comentarios, o user veio null
            if (c['user'] != null ) {
              const u = c['user'];
              console.log(u);
              user.setData(u['login'], u['avatar_url']);
              const comment = new GistComment(c['body'], user, c['created_at']);
              gistComments.push(comment);
            }
          }
          this.gistData.comments = gistComments;
          const gistBehavior = new BehaviorSubject(this.gistData);
          return gistBehavior;
        })
    );
  }

  // metodo para buscar os comentarios de determinado gist
  getComments(gistId: string) {
    // pega o token de authenticationService
    return this.authenticationService.tokenValue()
    .pipe(
      map((token) => {
        // retorna o token para o proximo switchmap
        return token;
      }),
      // esse switchmap pega o token, prepara tudinho para fazer uma requisiçao ao servidor proxy,
      // depois retorna o observable de buscar os comments no servidor proxy
      switchMap((token) => {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const params = new HttpParams().set('token', token).set('gist_id', gistId);
        const options = {headers, params};
        return this.httpClient.get(`${SERVER}/get-comments`, options);
      })
    );
  }
}
