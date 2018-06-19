import { Component, OnInit } from '@angular/core';
import { ForumService } from "../forum/forum.service";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
  providers: [ForumService]
})

export class ForumComponent implements OnInit {
  posts: Array<any>;
  valueDate = new Date();
  userId = null;
  overlayDisplay = false;
  v: string;

  token: any;
  hideElement: boolean;
  filesToUpload: any;
  titulo: string;
  tipoArqui: boolean;
  arquivo: any

  constructor(public forumService: ForumService,
    private route: ActivatedRoute,
    private router: Router) {
    this.filesToUpload = File;
    this.hideElement = true;
    this.tipoArqui = true;
  }

  ngOnInit() {
    this.carregaPost();
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser.token; // your token
    /*
  * Obtendo ID do usuário do URL usando 'route.snapshot'
  */
    //	this.userId = this.route.snapshot.params['userid'];


  }

  carregaPost() {
    this.forumService.findAllPost()
      .then((posts: Array<any>) => {
        this.posts = posts.reverse();
        this.overlayDisplay = true;
      }, (error) => {
        console.log('Erro ao listar post', error);
      });
  }
  upload() {
    if (this.titulo == undefined || !this.titulo.trim) {
      return;
    }
    this.makeFileRequest("http://172.22.2.221:4000/postagem", this.filesToUpload).then((result) => {
    }, (error) => {
      console.log(error);
    });
  }

  verificaExt(event) {

    let extensoes = new Array("image/gif", "image/jpg", "image/jpeg", "image/png");
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

  makeFileRequest(url: string, files) {
    return new Promise((resolve, reject) => {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();

      formData.append('files', files[0]);
      formData.append('titulo', this.titulo);


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
      this.router.navigate(['/forum']);
    });

  }

  



}


