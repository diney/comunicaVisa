
import { Injectable, EventEmitter } from '@angular/core';

import { HttpService } from './http.service';

@Injectable()
export class ForumService {

	constructor(private httpService: HttpService) { }

	public insertPost(params, callback): any {
		this.httpService.insertPost(params).subscribe(
			response => {
				callback(false, response);
			},
			error => {
				callback(true, 'HTTP fail.');
			}
		);
	}

		public getPosts( callback): any {
		this.httpService.getPosts().subscribe(
			response => {
				callback(false, response);
			},
			error => {
				callback(true, 'HTTP fail.');
			}
		);
	}

	public insertComentario( params,callback): any {
		this.httpService.insertComentario(params).subscribe(
			response => {
				callback(false, response);
			},
			error => {
				callback(true, 'HTTP fail.');
			}
		);
	}

	

}