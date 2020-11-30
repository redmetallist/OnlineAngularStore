import { Injectable } from '@angular/core';
import {Category, CategoryService} from "./category.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {User} from "./user.service";
import jwt_decode from "jwt-decode";

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
    return new Promise(( resolve,reject) => {
      this.http.get<Product[]>(baseUrl + 'api/product/getAll')
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




  public logout() {
    localStorage.removeItem('auth_token');
    location.reload();
  }

  public logIn(): boolean {
    console.log(localStorage.getItem('auth_token') !== null)
    return (localStorage.getItem('auth_token') !== null);
  }

  public  getRole():string {
    let role = null
    if (localStorage.getItem('auth_token') !== null) {

      let decoded = jwt_decode(localStorage.getItem('auth_token'));
      role = JSON.stringify(
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])
    }
    return role
  }
}

export interface Product {
  id: number
  title: string
  description? : string
  categoryId:number

}
