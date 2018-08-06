
import { Injectable, EventEmitter } from '@angular/core';

import { HttpService } from './http.service';


@Injectable()
export class ChatService {


	usuarioAutenticado: boolean;

	mostrarMenuEmitter = new EventEmitter

	constructor(private httpService: HttpService) { }

	/* 
	* check if username already exists.
	*/
	public checkUserNameCheck(params, callback) {
		this.httpService.userNameCheck(params).subscribe(
			response => {
				callback(response);
			},
			error => {
				alert('HTTP fail.');
			}
		);
	}
	/* 
	* Login the user
	*/
	public login(params, callback): any {

		this.httpService.login(params).subscribe(
			response => {
				callback(false, response);
			
				localStorage.setItem('currentUser', JSON.stringify({ token: response }));

				if (response.error === false) {

					this.usuarioAutenticado = true;
					this.mostrarMenuEmitter.emit(true);
					callback(false, response);
					return;

				}
				//this.usuarioAutenticado = false;
			//	this.mostrarMenuEmitter.emit(false);
				//callback(false, response);
			},
			error => {
				
				callback(true, 'HTTP fail.');
				this.usuarioAutenticado = false;
				this.mostrarMenuEmitter.emit(false);
			}
		);
	}

	usuarioEstaAutenticado() {

		return this.usuarioAutenticado;

	}

	/* 
* method to add new users
*/
	public registerUser(params, callback): any {
	
		this.httpService.registerUser(params).subscribe(
			response => {
				callback(false, response);
				localStorage.setItem('currentUser', JSON.stringify({ token: response }));
				this.mostrarMenuEmitter.emit(true);
			},
			error => {
				callback(true, 'HTTP fail.');
				this.mostrarMenuEmitter.emit(false);
			}
		);
	}


	/* 
* method to get the messages between two users
*/
	public getMessages(params, callback): any {
		this.httpService.getMessages(params).subscribe(
			response => {
			
				callback(false, response);
					
			},
			error => {
				callback(true, 'HTTP fail.');
			}
		);
	
	}

	/* 
	* method to update the messages between two users
	*/
	public updateMessages(params, callback): any {
		
		this.httpService.updateMessages(params).subscribe(
			response => {
				callback(false, response);
					
			},
			error => {
				callback(true, 'HTTP fail.');
			}
		);
	}


    /* 
	* Method to check the session of user.
	*/
	public userSessionCheck(userId, callback): any {
		this.httpService.userSessionCheck({ userId: userId }).subscribe(
			response => {
				callback(false, response);
			},
			error => {
				callback(true, 'HTTP fail.');
			}
		);
	}

	/* 
	* Method to check the session of user.
	*/
	public fotoChat(params, callback): any {
		this.httpService.fotoChat(params).subscribe(
			response => {
				callback(false, response);
			},
			error => {
				callback(true, 'HTTP fail.');
			}
		);
	}

	/* 
	* Method to check the session of user.
	*/
	public getContMessage(params, callback): any {
		this.httpService.getContMessage(params).subscribe(
			response => {
				callback(false, response);
			},
			error => {
				callback(true, 'HTTP fail.');
			}
		);
	}

	/* 
	* Method to check the session of user.
	*/
	public getFotoChatById(params, callback): any {
		this.httpService.getFotoChatById(params).subscribe(
			response => {
				callback(false, response);
			},
			error => {
				callback(true, 'HTTP fail.');
			}
		);
	}

	public userGetById(params, callback): any {
		this.httpService.userGetById(params).subscribe(
			response => {
				callback(false, response);
			},
			error => {
				callback(true, 'HTTP fail.');
			}
		);
	}

	public dateNow( callback): any {
		this.httpService.dateNow().subscribe(
			response => {
				callback(false, response);
				
			},
			error => {
				callback(true, 'HTTP fail.');	
			}
		);
	}


	






}
