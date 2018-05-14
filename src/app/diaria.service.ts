
import { Http, Response } from '@angular/http'
import { Injectable } from '@angular/core'
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/toPromise'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/retry'





@Injectable()
export class DiariaService {

     private url_api= 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/'

    constructor(private http: Http) { }
 

        public pesquisaMunicipios(termo: string): Observable<any[]> {
         
        return this.http.get(`${this.url_api}/${termo}/municipios `)
            .retry(10)
            .map((resposta: Response) => resposta.json())
        }

        

        
    
    }
    

   

