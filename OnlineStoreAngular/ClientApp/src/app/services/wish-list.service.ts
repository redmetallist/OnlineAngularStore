import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class WishListService {


  constructor(private http: HttpClient) {

  }

  public getWishFromServer(baseUrl: string): Promise<IWishList[]> {
    return new Promise((resolve, reject) => {
      this.http.get<IWishList[]>(baseUrl + 'api/wishlist/getWish')
        .subscribe(wish => {
            resolve(wish);
          },
          (error) => {
            console.log('from get wish list. error code is: ', error.status, 'error message is: ', error.message)
            reject([])
          })
    })
  }

  public addToWish(id: number, baseUrl: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<number>(baseUrl + 'api/wishlist/addToWish', id)
        .subscribe((result: any) => {
              resolve(true);
          },
          (error) => {
            console.log('from add to wish list. error code is: ', error.status, 'error message is: ', error.message, 'server response is: ', error.error);
            reject(false);
          });
    })
  }

  public removeFromWish(id: number, baseUrl: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.delete<number>(baseUrl + 'api/wishlist/removeFromWish/' + id)
        .subscribe((result: any) => {
            resolve(true);
          },
          (error) => {
            console.log('from remove from wish list. error code is: ', error.status, 'error message is: ', error.message);
            reject(false);
          });
    })
  }

  public isInWish(id: number, baseUrl: string): Promise<boolean> {
    return new Promise<boolean>( (resolve, reject) => {
      this.getWishFromServer(baseUrl).then(result => {
        if(result.length>0){
          result.forEach(element => {
            if (element.productId == id) {
              resolve(true)
            }
          })}
        resolve(false)
      })
    })
  }
}

export interface IWishList {
  id?: number
  userId: number
  productId: number
}
