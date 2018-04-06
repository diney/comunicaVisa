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
  filesToUpload = File;
  token: any;

  constructor(public forumService: ForumService,
    private route: ActivatedRoute, ) {
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


}


