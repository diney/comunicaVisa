import { Injectable } from '@angular/core';

import { Http} from '@angular/http';
import { HttpService } from '../http.service';

@Injectable()
export class ForumService {
  localhost: string;
  baseUriPost: string;
  baseUriVidio: string;


  


  constructor(public http: Http,
    private httpService: HttpService) {
    this.localhost = 'http://172.22.2.17:4000'
    this.baseUriPost = this.localhost + '/postagem';
     this.baseUriVidio = this.localhost + '/movies/mov_bbb.mp4';
    this.findAllPost();
  }

  findAllPost() {
    return new Promise((resolve, reject) => {
      this.http.get(this.baseUriPost)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  findAllVidio() {
    return new Promise((resolve, reject) => {
      this.http.get(this.baseUriVidio)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data)
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }


  public excluirPostById(params, callback): any {
  
		this.httpService.excluirPostById(params).subscribe(
			response => {
				callback(false, response);
			},
			error => {
				callback(true, 'HTTP fail.');
			}
		);
	}


 

}


