import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms'


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
import { PainelComponent } from './painel/painel.component';
import { IncluirPublicacaoComponent } from './forum-principal/incluir-publicacao/incluir-publicacao.component';
import { Progresso } from "app/progresso.service";
import { DiariasComponent } from './diarias/diarias.component';






@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForumComponent,
    ChatComponent,
    PublicarComponent,
    ForumPrincipalComponent,
    PainelComponent,
    IncluirPublicacaoComponent,
    DiariasComponent,


  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    ReactiveFormsModule,
  ],
  providers: [LoginService, ChatService, HttpService, AuthGuard, Progresso],
  bootstrap: [AppComponent]
})
export class AppModule { }
