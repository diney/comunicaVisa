import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
//import { ReactiveFormsModule } from '@angular/forms'
import { PopoverModule } from "ngx-popover";
import {ImageCropperComponent  } from 'ng2-img-cropper';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ForumComponent } from './forum/forum.component';
import { ChatComponent } from './chat/chat.component';
import { routing } from "./app.routing";
import { PublicarComponent } from './publicar/publicar.component';
import { LoginService } from './login/login.service';
import { ChatService } from "./chat.service";
import { HttpService } from "./http.service";
import { AuthGuard } from "app/guards/auth.guard";
import { ForumPrincipalComponent } from './forum-principal/forum-principal.component';

import { DiariasComponent } from './diarias/diarias.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForumComponent,
    ChatComponent,
    PublicarComponent,
    ForumPrincipalComponent,    
    DiariasComponent,
    ImageCropperComponent
  
    
  


  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
   // ReactiveFormsModule,
    PopoverModule,
  ],
  providers: [LoginService, ChatService, HttpService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
