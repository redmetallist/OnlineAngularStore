import { Injectable } from '@angular/core';
import {UserData} from "./user-data.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  // categories: Category[] = [
  //   {title: 'Category 1',  id: 11},
  //   {title: 'Category 2', id: 22},
  //   {title: 'Category 3',  id: 33},
  //   {title: 'Category 4',  id: 44},
  // ]

  isAuth=false;

}



export interface User {
  id?: number
  email:string
  passwordHash: string
  userData: UserData

}
