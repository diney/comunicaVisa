
import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

/*npm install @types/socket.io-client --save
*/
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {

	/* 
	* specifying Base URL.
	*/
	private BASE_URL = 'http://172.22.2.221:8080';
	private socket;

	constructor() { }

	/* 
* Method to connect the users to socket
*/
	connectSocket(userId: string) {
		this.socket = io(this.BASE_URL, { query: `userId=${userId}` });
	}

	/* 
  * Method to emit the add-messages event.
  */
	sendMessage(message: any): void {
		this.socket.emit('add-message', message);

	}

	/* 
	* Métdo para enviar o event logout .
	*/
	logout(userId): any {

		this.socket.emit('logout', userId);

		let observable = new Observable(observer => {
			this.socket.on('logout-response', (data) => {			
			
				observer.next(data);
			});
			return () => {
				this.socket.disconnect();
			};
		})
		return observable;
		}

	disconnect() {
		this.socket.disconnect();
	}

	/* 
	* Método para receber o evento add-message-response.
	*/
	receiveMessages(): any {
		let observable = new Observable(observer => {
			this.socket.on('add-message-response', (data) => {

				//alert(data.fromUserId +' fromUsrId' + data.toUserId+ " toUserId ")

				observer.next(data);
			});

			return () => {
				this.socket.disconnect();
			};
		});
		return observable;
	}

	/* 
	 *   Método para receber o evento de resposta da lista de bate-papo	* 
	*/
	getChatList(userId: string): any {

		this.socket.emit('chat-list', { userId: userId });

		let observable = new Observable(observer => {
			this.socket.on('chat-list-response', (data) => {
									
				observer.next(data);
			});

			return () => {
				this.socket.disconnect();
			};
		})
		return observable;
	}

}
