import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private result: string;

  constructor(private http: HttpClient) {
  }

  public subject$ = new Subject<number>();

  public addToCart(id: number, baseUrl: string): boolean {
    let isOk: boolean = false;
    let localCart = [];
    if (localStorage.getItem('localCart') !== null) {
      localCart = JSON.parse(localStorage["localCart"]);
    }
    console.log('from add to cart')
    localCart.push(id);
    console.log(typeof id, id)
    this.http.post<number>(baseUrl + 'api/cart/addToCart', id)
      .subscribe((result: any) => {

          localStorage.removeItem('localCart');
          localStorage['localCart'] = JSON.stringify(localCart);
          isOk = true;
          this.counterOfItemsInCart()
          //this.subject$.next(localCart.length);
        },
        (error) => {
          console.log(error.status);
          isOk = false;
          // get the status as error.status
        });

    //  }
    return isOk;
  }


  public SyncCartWithServer(baseUrl: string): Promise<boolean> {

    let localStorageCartItems = []
    return new Promise((resolve, reject) => {

        this.GetCartFromServer(baseUrl).then((cartFromServer) => {
          console.log('cart from server', cartFromServer)

          if (cartFromServer.length > 0) {
            console.log('cart from server more than 0')
            if (localStorage.getItem('localCart') !== null) {
              console.log('local storage not empty')
              localStorageCartItems = JSON.parse(localStorage["localCart"])

              let productIdsFromServer = [];


              function SyncWithServer(): Promise<any> {
                return new Promise((resolve) => {
                  cartFromServer.forEach(async serverCartElement => {
                    await productIdsFromServer.push(serverCartElement.productId);
                    if (localStorageCartItems.includes(serverCartElement.productId)) {
                      console.log('from server iteration')
                    } else {
                      console.log('from server iteration')
                      await localStorageCartItems.push(serverCartElement.productId)
                    }

                  })
                  resolve()
                })

              }

              function SyncWithLocal(): Promise<any> {
                return new Promise((resolve) => {
                  localStorageCartItems.forEach(async localStorageCartElement => {


                    if (productIdsFromServer.includes(localStorageCartElement)) {
                      console.log('from client iteration')
                    } else {
                      console.log('from client iteration')
                      await this.addToCart(localStorageCartElement, baseUrl)
                    }
                  })
                  resolve();
                })
              }

              new Promise((resolve) => {
                resolve(SyncWithServer())
              }).then(() => resolve(SyncWithLocal()))


            } else {
              console.log('local storage is empty', 'cart from server!!', cartFromServer)
              localStorageCartItems = [];
              cartFromServer.forEach(async serverCartElement => {

                await localStorageCartItems.push(serverCartElement.productId)
              })
            }
          } else {
            if (localStorage.getItem('localCart') !== null) {
              let localStorageCartItems = JSON.parse(localStorage["localCart"]);
              localStorageCartItems.forEach(async product => {

                await this.addToCart(product, baseUrl)

              })
            }
          }
        },
          err=>{
          console.log('call from error')
          this.counterOfItemsInCart();
          }
        ).then(() => {

            if (localStorageCartItems.length>0) {
              if (localStorage.getItem('localCart') !== null) {
                localStorage.removeItem('localCart');
              }
              localStorage["localCart"] = JSON.stringify(localStorageCartItems);
            }
          }
        ).then(() => {
          this.counterOfItemsInCart();
          resolve(true)
        })


      }
    )


  }

  public counterOfItemsInCart() {

    this.countUniqueElementsInTheCard().then(res => {
      this.subject$.next(res)

    })


  }

  private countUniqueElementsInTheCard(): Promise<number> {
    return new Promise<number>(resolve => {
      let localCart = [];
      let productsIds = [];
      if (localStorage.getItem('localCart') !== null) {
        localCart = JSON.parse(localStorage["localCart"]);
        localCart.forEach(counter => {
          if (!productsIds.includes(counter)) {
            productsIds.push(counter)
          }

        })}
        resolve(productsIds.length);

    })
  }

  public GetCartFromServer(baseUrl: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let cartItems;
      this.http.get<any[]>(baseUrl + 'api/cart/getCart')
        .subscribe(cart => {
          cartItems = cart;
          resolve(cartItems);
        },
        (error) => {
        //  console.log(error.status);
       //   throw error.status
          reject()

          // get the status as error.status
        })
    })
  }

  public GetCartFromLocal():number[]{

    if (localStorage.getItem('localCart') !== null) {
     return  JSON.parse(localStorage["localCart"]);}
  }

  public isInCart(id:number): boolean{
    if (localStorage.getItem('localCart') !== null)
return this.GetCartFromLocal().includes(id)
    else return false
  }

  public removeFromCart(id: number, baseUrl: string): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.http.delete<number>(baseUrl + 'api/cart/removeFromCart/' + id)
        .subscribe((result: any) => {
            let newLocalStorageCartItems = [];
            let localStorageCartItems = JSON.parse(localStorage["localCart"])
            localStorageCartItems.forEach(val => {
              if (val != id) {
                newLocalStorageCartItems.push(val)
              }
            })
            localStorage.removeItem('localCart');
            if (newLocalStorageCartItems.length > 0)
              localStorage['localCart'] = JSON.stringify(newLocalStorageCartItems);
            this.counterOfItemsInCart();
            resolve(true)
          },
          (error) => {
            console.log(error.status);
            resolve(false);
            // get the status as error.status
          });

    })
  }


}

// export interface CartIds {
//   id: number
// }

export interface CartProducts {
  id: number
  quantity: number
  title: string
  cost: number
  imgsrc: string
  description: string
}


