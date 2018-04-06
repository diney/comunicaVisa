import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from './../socket.service';
import { HttpService } from './../http.service';
import { ChatService } from './../chat.service';

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.css'],
	providers: [ChatService, HttpService, SocketService],


})
export class ChatComponent implements OnInit, OnDestroy {

	today: number = Date.now();
	private filesToUpload: File;
	hideElement: boolean;
	tipoArqui: boolean = false;
	loginEmitter = new EventEmitter
	arquivo:any

	/*
	* Variáveis ​​relacionadas com UI são iniciadas
	*/
	overlayDisplay = false;
	selectedUserId = null;
	selectedSocketId = null;
	selectedUserName = null;
	selectedUserFoto = null;

	/*
	* Variáveis ​​relacionadas com bate-papo 
	*/
	foto: boolean;
	userfoto = null;
	username = null;
	userId = null;
	socketId = null;
	chatListUsers = [];
	message = '';
	messages = [];
	currentUser: any;
	token: any;

	constructor(
		private chatService: ChatService,
		private socketService: SocketService,
		private route: ActivatedRoute,
		private router: Router
	) {
		this.hideElement = true;
		this.tipoArqui = true;

	}

	ngOnInit() {


		//this.teste= true;
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.token = this.currentUser.token;// your token
		this.userId = this.token.userId;


    	/*
		* Obtendo ID do usuário do URL usando 'route.snapshot'
		*/
		//this.userId = this.route.snapshot.params['userid'];

		if (this.userId === '' || typeof this.userId == 'undefined') {
			this.router.navigate(['/forum']);

		} else {

			/*
			* Função para verificar se o usuário está logado ou não inicia
			*/
			this.chatService.userSessionCheck(this.userId, (error, response) => {

				if (error) {

					this.router.navigate(['/forum']); /* Home page  */
				} else {

					this.username = response.nome;
					this.userfoto = response.foto;
					this.overlayDisplay = true;

					/*
				* Fazendo a conexão do soquete passando o UserId
				*/
					this.socketService.connectSocket(this.userId);

					/*
					*  Método de serviço de chamada para obter a lista de bate-papo.
					*/
					this.socketService.getChatList(this.userId).subscribe(response => {

						if (!response.error) {

							if (response.singleUser) {

								/* 
								* Removendo o usuário duplicado da matriz da lista de bate-papo.
								*/
								if (this.chatListUsers.length > 0) {
									this.chatListUsers = this.chatListUsers.filter(function (obj) {

										return obj._id !== response.chatList._id;
									});

								}

								/* 
								*Adicionando novo usuário online na lista de lista de bate-papo
								*/

								this.chatListUsers.push(response.chatList);
 
							} else if (response.userDisconnected) {
                                
								if ((this.selectedUserId !== null) && (this.selectedUserId === response.userId)) {
									this.selectedUserId = null
									//this.selectedUserName = null
									//this.messages = []

									

								}
								else if (response.desconct) {
									
									this.selectedUserId = null
									//this.selectedUserName = null
									//this.messages = []
									
									return
								}

							} else {
								/* 
								* Atualizando lista de chat completa se o usuário fizer logon.
								*/
								this.chatListUsers = response.chatList;

							}
						} else {
							alert(`Chat list failure.`);
						}
					});
					/* 
					* Subscrevendo mensagens 
					*/
					this.socketService.receiveMessages().subscribe(response => {
						if (this.selectedUserId && this.selectedUserId == response.fromUserId) {
							this.selectedSocketId
							this.messages.push(response);
							setTimeout(() => {
								document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight;
							}, 100);
						}
					});

				}
			});
		}
	}

	mostraFoto() {
		if (this.userfoto == null) {
			return this.foto = false;
		}

		this.foto = true;
	}
	/* 
	  *  O método para selecionar o usuário da lista de bate-papo
	  */
	selectedUser(user): void {
		user.msg = "";
		this.selectedUserId = user._id;
		this.selectedSocketId = user.socketId;
		this.selectedUserName = user.nome;
		this.selectedUserFoto = user.foto;


		/* 
		* Método de chamada para obter as mensagens
		*/
		this.chatService.getMessages({ userId: this.userId, toUserId: user._id }, (error, response) => {
			if (response.messages != 0) {
				setTimeout(() => {
					document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight;
				}, 100);
			}

			if (!response.error) {
				this.messages = response.messages;
			}
		});

		this.chatService.updateMessages({ userId: this.userId, toUserId: user._id }, (error, response) => {

			if (!response.error) {

				setTimeout(() => {
					document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight;
				}, 100);

			}
		});
	}

	isUserSelected(userId: string): boolean {

		if (!this.selectedUserId) {
			return false;
		}

		return this.selectedUserId === userId ? true : false;
	}

	sendMessage(event) {

		if (event.keyCode === 13) {

			if (this.message === '' || this.message === null) {
				alert(`Message can't be empty.`);
			} else {

				if (this.message === '') {
					alert(`Message can't be empty.`);
				} else if (this.userId === '') {
					this.router.navigate(['/']);
				} else if (this.selectedUserId === '') {
					alert(`Select a user to chat.`);
				} else {

					const data = {
						fromUserId: this.userId,
						message: (this.message).trim(),
						toUserId: this.selectedUserId,
						toSocketId: this.selectedSocketId,
						hora: this.today,
						read: false,
						fromSocketId: this.socketId
					}
					this.messages.push(data);
					setTimeout(() => {
						document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight;
					}, 100);

					/* 
					* Método para enviar as mensagens
					*/
					this.message = null;
					this.socketService.sendMessage(data);

				}
			}
		}
	}
	alignMessage(userId) {
		return this.userId === userId ? false : true;
	}


	logout() {
		this.selectedUserName = null;
		this.socketService.logout({ userId: this.userId }).subscribe(response => {
			//this.router.navigate(['/']); /* Home page redirection */

		});

	}

	verificaExt(event) {

		let extensoes = new Array("image/jpg", "image/jpeg", "image/png");
		let teste = event.target.files[0];

		for (var i = 0; i < extensoes.length; i++) {

			if (extensoes[i] == teste.type) {
				this.tipoArqui = true;
				this.fileChangeEvent(event);
				return;
			}
			this.tipoArqui = false;
		}
	}

	fileChangeEvent(event) {

		this.hideElement = false;
		this.readThis(event.target);
		this.filesToUpload = event.target.files;
	}

	readThis(inputValue: any): void {

		var file: File = inputValue.files[0];
		var myReader: FileReader = new FileReader();


		var preview = document.querySelector('img');
		myReader.onloadend = function (e) {

			preview.src = myReader.result;
		}
		if (file) {
			myReader.readAsDataURL(file);
		}
		preview.src = "";
	}

	upload() {
		this.makeFileRequest("http://172.22.2.221:8080/foto", this.filesToUpload).then((result) => {
		}, (error) => {
			console.log(error);
		});
	}

	makeFileRequest(url: string, files) {
		return new Promise((resolve, reject) => {
			var formData: any = new FormData();
			var xhr = new XMLHttpRequest();

			formData.append('files', files[0]);
			formData.append('user', this.userId);

			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						resolve(JSON.parse(xhr.response));
					} else {
						reject(xhr.response);
					}
				}
			}
			xhr.open("POST", url, true);
			xhr.send(formData);
			//this.router.navigate(['/forum']);
		});
	}


	ngOnDestroy() {
		this.logout();

	}

	limpaUpload() {
		this.hideElement = true;


	}

}







