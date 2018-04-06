import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { ChatService } from "app/chat.service";

@Injectable()
export class AuthGuard implements CanActivate {



  constructor(
    private chatService:ChatService,
    private router: Router

  ) { }

      canActivate(
      route: ActivatedRouteSnapshot, 
      state: RouterStateSnapshot
      ): boolean | Observable<boolean> {

    if(this.chatService.usuarioEstaAutenticado()){
      return true;
    }
    this.router.navigate(['/login']);
    return false;
    }

}
