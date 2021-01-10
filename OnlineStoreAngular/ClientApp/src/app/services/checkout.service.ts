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

  public getUserOrders(baseUrl:string):Promise<Order []>{
    return new Promise<Order[]>(resolve => {
      if (this.auth.logIn()) {
        this.http.get<Order>(baseUrl + 'api/order/getUserOrders')
          .subscribe((result: any) => {
              resolve(result)
            },
            (error) => {
              resolve([])
            });
      }
    })
  }
  public getActiveOrders(baseUrl:string):Promise<Order []>{
    return new Promise<Order[]>(resolve => {
      if (this.auth.logIn()) {
        this.http.get<Order>(baseUrl + 'api/order/getActiveOrders')
          .subscribe((result: any) => {
              resolve(result)
            },
            (error) => {
              resolve([])
            });
      }
    })
  }

  public completeOrder(baseUrl:string, id:number):Promise<boolean>{
    return new Promise<boolean>(resolve => {
      if (this.auth.logIn()) {
        this.http.post<number>(baseUrl + 'api/order/completeOrder', id)
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

export interface Order {
  id?:number
    userId:number,
  productId:number,
  orderId:number,
  quantity:number,
  isComplete:boolean,
  orderDateTime:Date,
  cost:number

}
