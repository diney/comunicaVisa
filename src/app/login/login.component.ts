import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';


import { ChatService } from './../chat.service';
import { HttpService } from './../http.service';
import { LoginService } from "../login/login.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']

})
export class LoginComponent implements OnInit {

    overlayDisplay = false;
    validacao = true;
    username = null;
    email = null;
    password = null;
    user: any = {
        username: null,
        password: null,

    }
    newUser: any;


    // isuserNameAvailable = false;
    //userTypingTimeout = 500;
    typingTimer = null;

    constructor(
        private chatService: ChatService,
        private router: Router,
        private loginServe: LoginService
    ) { }

    public ngOnInit(): void {
        this.overlayDisplay = true;

    }

    public onkeyup(event) {
        this.validacao = true;
    }

    // public onkeydown(event) {
    //clearTimeout(this.typingTimer);
    // }
    /* 
    
     public onkeyup(event) {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
        this.chatService.checkUserNameCheck({
            'username': this.username
        }, (response) => {
            if (response.error) {
                this.isuserNameAvailable = true;
            } else {
                this.isuserNameAvailable = false;
            }
        });
    }, this.userTypingTimeout);
}
*/
    public login() {
        this.overlayDisplay = false;
        this.chatService.login(
            this.user
            , (error, result) => {
                if (error) {
                    alert(`Invalid Credentials`);
                    this.router.navigate(['/login']);
                } else {
                    if (!result.error) {

                        this.router.navigate(['/forum']);
                    } else {
                        this.autenticarPharos(this.user);
                        // alert(`Invalid Credentials`);
                    }
                }
            });
    }

    autenticarPharos(user): void {
        this.loginServe.autenticar(user)
            .then((newUser: any) => {
                this.newUser = newUser;
                if (this.newUser == 0) {
                    this.validacao = false;
                    this.overlayDisplay = true;
                    return;
                }
                this.overlayDisplay = true;

                this.registerUser();

            }, (error) => {
                console.log('Erro ao listar post', error);

                this.overlayDisplay = true;
            });
    }

    public registerUser(): void {


        this.chatService.registerUser({

            nome: this.newUser.nome,
            username: this.user.username,
            password: this.user.password,
            agencia: this.newUser.agencia,
            conta: this.newUser.conta,
            cpf: this.newUser.cpf,
            cargo : this.newUser.cargo,
            matricula : this.newUser.matricula,
            regional: this.newUser.regional,
            banco: this.newUser.banco,
            unidade : this.newUser.unidade,
            municipio: this.newUser.municipio,
            vinculo: this.newUser.vinculo
           



        }, (error, result) => {
            if (error) {
                alert(result);
            }
            this.login();
        });

    }

}

