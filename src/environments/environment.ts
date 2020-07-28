// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

export const firebaseConfig = {
  apiKey: 'AIzaSyBTPWLX9Bj9RrZt-fuApqpJaSfAxEwuDEk',
  authDomain: 'qrgist.firebaseapp.com',
  databaseURL: 'https://qrgist.firebaseio.com',
  projectId: 'qrgist',
  storageBucket: 'qrgist.appspot.com',
  messagingSenderId: '56203884457',
  appId: '1:56203884457:web:7f5dcee98207406a0576b8'
};

export const githubConfig = {
  client_id: '044c62189110d6c5765b',
  client_secret: 'a1684b3dfd0a702f4c8594360a67f3d71ec73793',
  scope: ['user', 'gist']
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
