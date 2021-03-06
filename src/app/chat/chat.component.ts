import { Component, OnInit, OnDestroy, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from './../socket.service';
import { ChatService } from './../chat.service';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
//import { BuscaNomePipe } from './../busca-nome.pipe';


@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.css'],
	providers: [ChatService, SocketService],
	


})
export class ChatComponent implements OnInit, OnDestroy {
	
    
	name: string;
	data1: any;
	cropperSettings1: CropperSettings;
	croppedWidth: number;
	croppedHeight: number;

	@ViewChild('cropper', undefined) cropper: ImageCropperComponent;

	pageTitle = document.title;
	original = document.title;
	time = 6000;

	private filesToUpload: File;
	hideElement: boolean;
	tipoArqui: boolean = false;
	loginEmitter = new EventEmitter
	arquivo: any
	

	/*
	* Variáveis ​​relacionadas com UI são iniciadas
	*/
	overlayDisplay = false;
	selectedUserId = null;
	selectedSocketId = null;
	selectedUserName = null;
	selectedUserFoto = null;
	overlayDisplayLista = false;

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
	msg: any
	msgtotal: any
	minhasMsg: any;
	advertencia: any;
	dig: boolean = true;
	userSelct: any;
	msgOnline: any;
	hora: number;

	constructor(
		private chatService: ChatService,
		private socketService: SocketService,
		

		private route: ActivatedRoute,
		private router: Router
	) {
		//console.log('Native window obj', winRef.nativeWindow);
	
		this.hideElement = true;
		this.tipoArqui = true;
		this.advertencia = null;
		this.userSelct = null;
		this.msgOnline = null;

		//this.name = 'Angular2'
		this.cropperSettings1 = new CropperSettings();
		// Tamanho minimo 
		this.cropperSettings1.width = 1;
		this.cropperSettings1.height = 1;
		//Largura da imagem resultante
		this.cropperSettings1.croppedWidth = 100;
		this.cropperSettings1.croppedHeight = 100;

		this.cropperSettings1.canvasWidth = 200;
		this.cropperSettings1.canvasHeight = 200;

		this.cropperSettings1.minWidth = 10;
		this.cropperSettings1.minHeight = 10;

		this.cropperSettings1.rounded = true;
		this.cropperSettings1.keepAspect = true;

		this.cropperSettings1.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
		this.cropperSettings1.cropperDrawSettings.strokeWidth = 2;

		this.data1 = {};

	}

	ngOnInit() {

		this.msgtotal = 0

		//this.teste= true;
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.token = this.currentUser.token;// your token
		this.userId = this.token.userId;
		//total mesagens não lidas 
		this.chatService.getContMessage({ userId: this.userId }, (error, response) => {

			this.msgtotal = response.msg
		})
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
 
						
						var chatArray: [any] = response.chatList
						if (response.toUserId === this.userId) {

							this.flashTitle(document.title, response.chatList.nome)

						}

						if (response.toUserId === this.userId && this.selectedUserId === response.digitado) {

							this.flashTitle(document.title, response.chatList.nome)

							this.chatService.updateMessages({ userId: this.userId, toUserId: this.selectedUserId }, (error, response) => {

							});
						}

						this.chatService.getContMessage({ userId: this.userId }, (error, response) => {

							this.msgtotal = response.msg
						})

						this.overlayDisplayLista = true;

						if (!response.error) {

							if (response.singleUser) {

								/* 
								* Removendo o usuário duplicado  da lista de bate-papo.
								*/
								if (this.chatListUsers.length > 0) {
									this.chatListUsers = this.chatListUsers.filter(function (obj) {
										if (response.chatList._id != null) {
											if (response.chatList._id != undefined && response.chatList._id != null) {
												return obj._id !== response.chatList._id;
											}
											return
										}
										return
									});
								}

								/* 
								*Adicionando novo usuário online na lista de bate-papo
								*/

								this.chatListUsers.push(response.chatList);


							} else if (response.userDisconnected) {

								if ((this.selectedUserId !== null) && (this.selectedUserId === response.userId)) {
									this.selectedUserId = null

								}
								else if (response.desconct) {

									this.selectedUserId = null

									return
								}

							} else {
								/* 
								* Atualizando lista de chat completa se o usuário fizer logon.
								*/

								this.chatListUsers = response.chatList.sort(function (a, b) {
									return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
								})


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

		this.advertencia = null;
		user.msg = user.msg;
		this.selectedUserId = user._id;
		this.selectedSocketId = user.socketId;
		this.selectedUserName = user.nome;

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


		if (user.msgLogout != undefined) {

			for (var i = 0; i < user.msgLogout.length; i++) {
				if (user.msgLogout[i]._id == this.userId) {

					user.toUserId = user.msgLogout[i]._id

				}
			}

		}

		if (user.toUserId == this.userId) {

			

			this.chatService.updateMessages({ userId: this.userId, toUserId: user._id }, (error, response) => {

				if ((user.msg != undefined) && (user.msg > 0)) {
					this.msgtotal -= user.msg
					user.msg = null;
				} else if (user.msgLogout != null ) {

					for (var i = 0; i < user.msgLogout.length; i++) {
						if (user.msgLogout[i]._id == this.userId) {

							this.msgtotal -= user.msgLogout[i].total;
							user.msg = null;
							user.msgLogout = null;
							if(user.msgLogout == null){
								return
							}
						}
					}
				}
			});

		}

		this.message = null;

		this.chatService.getFotoChatById({ userId: this.selectedUserId }, (error, response) => {
			this.selectedUserFoto = response.foto
		})
	}

	isUserSelected(userId: string): boolean {

		if (!this.selectedUserId) {
			return false;
		}

		return this.selectedUserId === userId ? true : false;
	}

	//digitando(userId: string) {
	//if (userId == this.userId) {
	//	return true;
	//}
	//return false;
	//}
	stopDigitar() {
		//para de digitar no broadcast com userSelc: null
		this.socketService.userDigitandoMessage({ userId: this.userId, userSelc: this.selectedUserId, stop: false });
		this.dig = true;
		}

	dataNow() {

		this.chatService.dateNow((error, response) => {
			this.hora = response.dateNow;

		});
		return this.hora

	}

	sendMessage(event) {

		this.dataNow()

		if (this.selectedUserId === null) {
			this.advertencia = "Selecione um usuário na  lista de bate papo a sua direita. ---->"

			return
		}

		if (event.target.value.trim() && this.dig) {
		

			this.socketService.userDigitandoMessage({ userId: this.userId, userSelc: this.selectedUserId, stop: true });
			this.dig = false;
		}
		

		if (event.keyCode === 13 && event.target.value.trim()) {
			setTimeout(() => {
				this.socketService.userDigitandoMessage({ userId: this.userId, userSelc: this.selectedUserId, stop: false });
			}, 1000);
			this.dig = true;
			//para de digitar no broadcast com userSelc: null

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
						hora: this.dataNow(),
						read: 'false',
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
		this.msgtotal = 0;
		this.selectedUserName = null;
		this.socketService.logout({ userId: this.userId }).subscribe(response => {
			//this.router.navigate(['/']); /* Home page redirection */
		});

	}
      //Foto
	verificaExt(event) {
		let extensoes = new Array("image/jpg", "image/jpeg", "image/png");
		let teste = event.target.files[0];

		for (var i = 0; i < extensoes.length; i++) {

			if (extensoes[i] == teste.type) {
				this.tipoArqui = true;

				return;
			}
			this.tipoArqui = false;
		}
	}

	upload() {
		this.chatService.fotoChat({ userId: this.userId, foto: this.data1.image }, (error, response) => {
			this.ngOnInit();
		})
	}

	endChat() {
		this.logout();
	}

	@HostListener('window:beforeunload', ['$event'])
	beforeunloadHandler(event) {
		this.endChat();
	}

	ngOnDestroy() {

		this.logout();
		this.selectedUserId = null;
	}

	limpaUpload() {
		this.hideElement = true;
	}

	/*contaMessage(response: any) {
			if (response != undefined) {
	
				for (var i = 0; i < response.length; i++) {
					if (response[i].msg != undefined) {
						if (response[i].toUserId == this.userId) {
							this.msgtotal = ++response[i].msg;
						}
					}
	
	
				}
			}
	
		}*/

	cropped(bounds: Bounds) {
		console.log(bounds)
		console.log(this.data1.image)
	}

	fileChangeListener($event) {
		var image: any = new Image();
		var file: File = $event.target.files[0];
		var myReader: FileReader = new FileReader();
		var that = this;
		myReader.onloadend = function (loadEvent: any) {
			image.src = loadEvent.target.result;
			that.cropper.setImage(image);
		};

		myReader.readAsDataURL(file);
	}

	flashTitle(pageTitle, newMessageTitle) {
		if (document.title == pageTitle) {
			document.title = newMessageTitle;
		}
		else {
			document.title = pageTitle;
		}

		setTimeout(() => {
			this.flashTitle(document.title, this.original)
		}, this.time);

	}

	

	

	







}







