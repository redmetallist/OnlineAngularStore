import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    const idToken = localStorage.getItem("auth_token");
console.log(idToken)
    if (idToken) {
      const cloned= req.clone({
        headers: req.headers
          .set("Authorization", "Bearer "+ idToken)
          .set('Content-Type', 'application/json')
      });
      return next.handle(cloned);
    }
    else {
      return next.handle(req);
    }
  }
}