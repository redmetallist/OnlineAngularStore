import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }
 public selectedCategory$=new Subject<number>();
  public fromAddCategory:boolean=false;

  public getCategories(baseUrl):Observable<Category[]> {
   return  this.http.get<Category []>(baseUrl + 'api/categories')
  }
  public addCategory(baseUrl,newcategory:Category):Promise<boolean> {
    return  new Promise<boolean>(resolve => {
      this.http.post<Category>(baseUrl + 'api/categories/addCategory', newcategory)
        .subscribe(()=>{
          resolve(true)
        },(() => {
          resolve(false)
        }))
    })

  }

}

export interface Category {
  id?: number
  title: string
  parentCategory?: number

}
