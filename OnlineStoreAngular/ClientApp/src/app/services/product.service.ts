import { Injectable } from '@angular/core';
import {Category, CategoryService} from "./category.service";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private category: Category) { }



  products: Product[] =[
    {id:1, title: '31', category: [this.category] },
    {id:2, title: '12', category: [this.category] },
    {id:3, title: '21', category: [this.category] },
    {id:4, title: '11', category: [this.category] }
  ]
AddProduct(){

}


  // categories: Category[] = [
  //   {title: 'Category 1',  id: 11},
  //   {title: 'Category 2', id: 22},
  //   {title: 'Category 3',  id: 33},
  //   {title: 'Category 4',  id: 44},
  // ]

  getById(id: number) {
   // return this.categories.find(p => p.id === id)
  }
}

export interface Product {
  id: number
  title: string
  description? : string
  category: Category[]

}
