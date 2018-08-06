import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  baseUri: string;

  

  constructor(public http: Http) {
    this.baseUri = 'http://172.22.2.17:4000/api/autenticar';
  }

  autenticar(usuario) {      
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUri, JSON.parse(JSON.stringify(usuario)), { headers: headers })
        .map(res => res.json())
        .subscribe(data => {         
          resolve(data);
          console.log(data)
        }, error => {
          reject(error);
        });
    });
  }

}
