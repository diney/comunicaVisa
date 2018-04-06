
import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
@Injectable()
export class PublicacaoService {

    /* 
     * specifying Base URL.
    */
    private BASE_URL = 'http://172.22.2.221:8080/';

    /* 
	* Setting the Request headers.
	*/
    private headerOptions = new RequestOptions({
        headers: new Headers({ 'Content-Type': 'application/json;charset=UTF-8' })
    });

    constructor(private http: Http) { }

    public publicar(publicacao:any): void {
        console.log(publicacao)
    }
}