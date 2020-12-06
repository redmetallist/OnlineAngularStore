import {Injectable, Input, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";


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
      console.log('kyky')
      localCart.push(id);
      console.log(typeof id, id)
      this.http.post<number>(baseUrl + 'api/cart/addToCart', id)
        .subscribe((result: any) => {

            localStorage.removeItem('localCart');
            localStorage['localCart'] = JSON.stringify(localCart);
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
    this.http.delete(baseUrl + 'api/cart/removeFromCart/' + id)
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
    this.http.get<CartIds[]>(baseUrl + 'api/cart/syncCart')
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

  public  GetCartFromServer( baseUrl: string): Promise<any[]> {
    return new Promise(( resolve) => {
    let cartItems;
    this.http.get<any[]>(baseUrl + 'api/cart/getCart')
      .subscribe(cart => {
       // console.log(cart);
        cartItems = cart;
        resolve(cartItems);
      }),
      (error) => {
        console.log(error.status);
return null
        // get the status as error.status
      }
  })
  }

}

export  interface CartIds {
  id:number
}

export  interface CartProducts {
  id:number
  quantity:number
  title:string
  cost:number
  imgsrc:string
  description:string
}


