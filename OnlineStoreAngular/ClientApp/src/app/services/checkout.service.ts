import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {UserData} from "./user-data.service";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  public doOrder(userData:UserData,baseUrl: string): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      if (this.auth.logIn()) {
        this.http.post<UserData>(baseUrl + 'api/order/doOrder',userData)
          .subscribe((result: any) => {
            resolve(true)
            },
            (error) => {
              resolve(false)
            });
      }
    })
  }




}
