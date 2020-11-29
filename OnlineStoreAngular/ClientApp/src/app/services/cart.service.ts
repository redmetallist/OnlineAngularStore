import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "./user.service";
import {Category} from "./category.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private result: string;
  constructor(private http: HttpClient) { }

  public addToCart(id:number, baseUrl: string): boolean {
    let isOk: boolean = false;
    let localCart = [];
    if (localStorage.getItem('localCart') !== null) {
      localCart = JSON.parse(localStorage["localCart"]);
    }
    if (localCart.find(x => {
      return x === id
    })) {
      return true
    } //product already exist. do nothing
    else {
      localCart.push(id);
      this.http.post(baseUrl + 'api/addToCart', id)
        .subscribe((result: any) => {
            console.log('result ', result);
            this.result = result.toString();
            localStorage.removeItem('localCart');
            localStorage["localCart"] = JSON.stringify(localCart);
            isOk = true;
          },
          (error) => {
            console.log(error.status);
            isOk = false;
            // get the status as error.status
          });

    }
    return isOk;
  }

public RemoveFromCart(id:number, baseUrl: string):boolean {
  let isOk: boolean = false;
  let localCart = [];
  if (localStorage.getItem('localCart') !== null) {
    localCart = JSON.parse(localStorage["localCart"]);
    let index = localCart.indexOf(id, 0);
    if (index > -1)
      localCart.splice(index, 1)
    this.http.delete(baseUrl + 'api/removeFromCart/' + id)
      .subscribe(result => {
          console.log('result ', result);
          this.result = result.toString();
          localStorage.removeItem('localCart');
          localStorage["localCart"] = JSON.stringify(localCart);
          isOk = true;
        },
        (error) => {
          console.log(error.status);
          isOk = false;
          // get the status as error.status
        });
  }
  return isOk;
}

  public SyncCartWithServer( baseUrl: string):boolean{
    let isOk=false;
    let cartItems;
    this.http.get<CartIds[]>(baseUrl + 'api/syncCart')
      .subscribe(cart => {
        console.log(cart);
        cartItems = cart;
        if (localStorage.getItem('localCart') !== null) {
          localStorage.removeItem('localCart');
        }
        localStorage["localCart"] = JSON.stringify(cartItems);
        isOk=true;
      }),
    (error) => {
      console.log(error.status);
      isOk = false;
      // get the status as error.status
    };
    return isOk;
  }

  public counterOfItemsInCart():number{
   if( localStorage.getItem('localCart') !== null){
    let cartItems=JSON.parse(localStorage["localCart"]);
    return cartItems.length;}
   else {
     return 0;
   }
  }


}
export  interface CartIds {
  id:number
}
