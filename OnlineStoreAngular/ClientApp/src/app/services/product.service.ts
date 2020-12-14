import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient,private router: Router) {

  }

  private result:Product;

  public loadProduct(id:number,baseUrl: string):Promise<Product>{
    return new Promise(( resolve,reject) => {
      this.http.get<Product>(baseUrl + 'api/product/description/'+id)
        .subscribe((result: any) => {
            console.log('result ', result);
            this.result = result;
            resolve(result);
          },
          (error) => {
            console.log(error.status);
           // reject([]);
            // get the status as error.status
          });
    })

  }

products:Product[]=[];

  public getProducts(baseUrl: string):Promise<Product[]>{
    return new Promise(() => {
      this.http.get<Product[]>(baseUrl + 'api/product/getAll')
        .subscribe((result: any) => {
            console.log('result ', result);
            this.products = result;
           // resolve(result);
            this.products$.next(result)
          },
          (error) => {
            console.log(error.status);
           // reject([]);
            // get the status as error.status
          });
    })

  }

  public getProductsById(baseUrl: string, id:number):Promise<Product>{
    return new Promise(( resolve) => {
      this.http.get<Product>(baseUrl + 'api/product/description/'+id)
        .subscribe((result: any) => {
            console.log('result ', result);
            this.products = result;
            resolve(result);
          },
          (error) => {
            console.log(error.status);
            // reject([]);
            // get the status as error.status
          });
    })

  }
  public products$ = new Subject<Product[]>();

  public getProductInCategory(baseUrl: string, id:number):Promise<Product[]>{
    return new Promise(() => {
      this.http.get<Product[]>(baseUrl + 'api/product/getProductInCategory/'+id)
        .subscribe((result: any) => {
            console.log('products in choosed category ', result);
            this.products = result;
            this.products$.next(result)
          },
          (error) => {
            console.log(error.status);
            // reject([]);
            // get the status as error.status
          });
    })
  }


}

export interface Product {
  id: number
  title: string
  description? : string
  categoryId:number
  cost:number

}
