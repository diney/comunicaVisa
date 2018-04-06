import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from "app/login/login.component";
import { ChatComponent } from "app/chat/chat.component";
import { ForumComponent } from "app/forum/forum.component";
import { PublicarComponent } from "app/publicar/publicar.component";

import { AuthGuard } from "app/guards/auth.guard";
import { ForumPrincipalComponent } from "app/forum-principal/forum-principal.component";
import { DiariasComponent } from "app/diarias/diarias.component";


const APP_ROUTES: Routes = [

    {
        path: '', component: LoginComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'login', component: LoginComponent,
    },
    {
        path: 'chat', component: ChatComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'forum/:userid', component: ForumComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'forum', component: ForumComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'publicar', component: PublicarComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'forumPrincipal', component: ForumPrincipalComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'diarias', component: DiariasComponent,
        canActivate: [AuthGuard]
    }

];

export const routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);

