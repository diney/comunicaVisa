import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ForumService } from './../forum.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx'
import { Subject } from "rxjs/Subject";
import { Observer } from "rxjs/Rx";
import { Progresso } from "app/progresso.service";


@Component({
  selector: 'app-forum-principal',
  templateUrl: './forum-principal.component.html',
  styleUrls: ['./forum-principal.component.css'],
  providers: [ForumService]
})
export class ForumPrincipalComponent implements OnInit {
    botaoSend: true;

  idPost: any
  resposta: string = ''
  hideElement: boolean;
  filesToUpload: any;
  comentario: string;
  tipoArqui: boolean;
  imagem: boolean;
  video: boolean;
  publicar: boolean
  userId: string
  nomeUserId: string
  token: any;
  file: File;
  preview = null;
  posts = [];
  postsComentarios = []
  url: any;
  type: any
  overlayDisplay = false;
  public imgUpload: string = "/assets/images/logos/jogador.png"
  public progressoPublicacao: string = 'pendente'
  public porcentagemUpload: number

  constructor(private router: Router,
    private forumService: ForumService,
    private progresso: Progresso,
    private route: ActivatedRoute, ) {
    this.filesToUpload = File;
    this.hideElement = true;
    this.tipoArqui = true;
    this.publicar = true;




  }

  ngOnInit() {
    alert()
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // this.userId = this.route.snapshot.params['userid']
    this.token = currentUser.token;
    this.userId = this.token.userId;
    this.nomeUserId = this.token.nomeUserId;
     alert(this.token.cpf)
    this.getPost()

  }
  upload() {

   
    if (this.type != undefined) {

      this.makeFileRequest("http://172.22.2.221:8080/post", this.filesToUpload).then((result) => {
      }, (error) => {
        console.log(error);
      });
      this.ngOnDestroy();
      this. type = undefined;

      return
    }

    this.forumService.insertPost({ comentario: this.comentario, userId: this.userId, nomePost: this.nomeUserId }, (error, response) => {
      this.ngOnDestroy();
      this.getPost();


    })
  }

  verificaExt(event) {

    let extensoes = new Array("image/gif", "image/jpg", "image/jpeg", "image/png", "video/mp4");
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
    if (this.filesToUpload[0].type != null) {
      this.type = this.filesToUpload[0].type
    }

  }

  readThis(inputValue: any): void {

    var url = null

    this.imagem = true
    this.video = true

    this.file = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    if (this.file.type === 'image/gif' || this.file.type === 'image/jpg' || this.file.type === 'image/jpeg' || this.file.type === 'image/png') {
      this.preview = document.querySelector('img');
      this.imagem = false;
      this.video = true;
      this.publicar = false



    }
    if (this.file.type === 'video/mp4') {
      this.preview = document.querySelector('video')
      this.imagem = true;
      this.video = false;
      this.publicar = false


    }


    myReader.onload = (event: any) => {

      this.url = event.target.result;
    }
    myReader.onloadend = function (e) {
      url = myReader.result;
    }
    if (this.file) {
      myReader.readAsDataURL(this.file);
    }

    this.preview = null


  }

  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.filesToUpload = event.target.result;
        this.url = event.target.result;
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  makeFileRequest(url: string, files) {
    return new Promise((resolve, reject) => {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      var estado: number;
      var status: string;

      var snapshot: any

      formData.append('files', files[0]);
      formData.append('comentario', this.comentario);
      formData.append('user', this.userId);
      formData.append('type', this.type);
      formData.append('userPost', this.nomeUserId);

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.upload.onprogress = (event) => {
        // this.progress = Math.round(event.loaded / event.total * 100);
        if (event.lengthComputable) {
          estado = event.loaded
          this.porcentagemUpload = Math.round((event.loaded / event.total) * 100);
          this.progressoPublicacao = 'andamento'


        }


      }
      xhr.onloadstart = (e) => {

      }
      xhr.onloadend = (e) => {
        this.progressoPublicacao = 'concluido'
        this.getPost();

      }
      xhr.onerror = (e) => {
        status = 'erro'

      }

      xhr.open("POST", url, true);
      xhr.send(formData);
      xhr = new XMLHttpRequest();
      this.filesToUpload = File;
      xhr.abort()

    });

  }
  ngOnDestroy(): void {
    this.video = true
    this.imagem = true
    this.comentario = null;
    this.publicar = true;
    this.url = null;

  }
  liberaPost(texto: string): void {
    this.comentario = texto

    if (this.comentario.length > 3 && this.comentario.trim() && (this.filesToUpload == null)) {
      this.publicar = false

    } else if (this.filesToUpload != null) {
      this.publicar = false

    } else {
      this.publicar = true
    }
  }

  getPost() {
    this.forumService.getPosts((error, response) => {
      this.posts = []
      if (!response.error) {
        for (let entry of response.posts) {

          this.posts.push({
            id: entry._id,
            type: entry.type,
            comentario: entry.comentario,
            nome: entry.nomePost,
            time: entry.time,
            url_imagem: entry.url_imagem,
            comentarios: entry.comentarios
            //foto: 'data:' + entry.type + ';base64,' + entry.post.toString('base64')
          })
        }
      }
     
      this.posts.reverse();
      this.overlayDisplay = true;
    })
  }
  clearFile(): void {
    this.filesToUpload = null;
    this.ngOnDestroy();

  }

  resetForm(): void {
    this.progressoPublicacao = 'pendente'
  }

  public sendComentario(resposta): void {
    this.resposta = ((<HTMLInputElement>resposta.target).value)

  }

  pegaId(id): void {
    this.idPost = id
  }

  enviarComentario() {
   if((this.resposta === null)||(this.resposta === '')||(!this.resposta.trim())){
   return
   }
    this.forumService.insertComentario({ comentario: this.resposta, idPost: this.idPost, nomeComentario: this.nomeUserId }, (error, response) => {

      this.resposta = null
      this.idPost = null
      this.getPost()
    })


  }







}