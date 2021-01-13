import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "./services/auth.service";
import {Inject} from "@angular/core";

export class AppGuard implements CanActivate {
  constructor( @Inject(AuthService) private auth: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this.auth.logIn() && this.auth.getRole() === 'Admin')
      return  new Observable((observer)=>{observer.next(true)})
    else new Observable((observer)=>{observer.next(false)})
  }
}
