import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-publicar',
  templateUrl: './publicar.component.html',
  styleUrls: ['./publicar.component.css']
})
export class PublicarComponent implements OnInit {
  hideElement: boolean;
  filesToUpload: any;
  titulo: string;
  tipoArqui: boolean;
  arquivo:any

  constructor(private router: Router) {
  this.filesToUpload = File;
  this.hideElement = true;
  this.tipoArqui = true;
  }

  ngOnInit() {
  }

  upload() {
    if(this.titulo==undefined || !this.titulo.trim ){     
      return;
    }
    this.makeFileRequest("http://172.22.2.221:4000/postagem", this.filesToUpload).then((result) => {
    }, (error) => {
      console.log(error);
    });
  }

  verificaExt(event) {
    
    let extensoes = new Array("image/gif","image/jpg","image/jpeg","image/png");
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
