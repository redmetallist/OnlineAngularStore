import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor() { }

}

export interface Category {
  id?: number
  title: string
  parentCategory?: number

}
