import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'
import { PublicacaoService } from './publicacao.service'
import { Router } from "@angular/router";

@Component({
  selector: 'app-incluir-publicacao',
  templateUrl: './incluir-publicacao.component.html',
  styleUrls: ['./incluir-publicacao.component.css'],
  providers: [PublicacaoService]
})
export class IncluirPublicacaoComponent implements OnInit, OnDestroy {
  arquivo:any
  hideElement: boolean;
  filesToUpload: any;
  comentario: string;
  tipoArqui: boolean;
  imagem: boolean;
  video: boolean;
  userId: string
  token: any;
  file: File;
  public imgUpload: string ="/assets/images/logos/jogador.png"



  constructor(
    private router: Router
  ) {

    this.filesToUpload = File;
    this.hideElement = true;
    this.tipoArqui = true;
  }

  ngOnInit() {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser.token;
    this.userId = this.token.userId;
  }

  upload() {

    if (this.comentario == undefined || !this.comentario.trim) {
      return;
    }
    this.makeFileRequest("http://172.22.2.221:8080/post", this.filesToUpload).then((result) => {
    }, (error) => {
      console.log(error);
    });

    this.ngOnDestroy()
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
  }

  readThis(inputValue: any): void {
    
    var preview = null;
    this.imagem = true
    this.video = true

    this.file = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    if (this.file.type === 'image/gif' || this.file.type === 'image/jpg' || this.file.type === 'image/jpeg' || this.file.type === 'image/png') {
      preview = document.querySelector('img');
      this.imagem = false;
      this.video = true;



    }
    if (this.file.type === 'video/mp4') {

      preview = document.querySelector('video')
      this.imagem = true;
      this.video = false;


    }
    myReader.onloadend = function (e) {

      preview.src = myReader.result;
    }
    if (this.file) {
      myReader.readAsDataURL(this.file);
    }

    preview.src = '';
    this.file = null

  }

  makeFileRequest(url: string, files) {
    return new Promise((resolve, reject) => {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();

      formData.append('files', files[0]);
      formData.append('comentario', this.comentario);
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
      this.router.navigate(['/forumPrincipal']);


    });

  }
  ngOnDestroy(): void {
    this.video = true
    this.imagem = true
    this.comentario = null
   
   
    





  }











}
