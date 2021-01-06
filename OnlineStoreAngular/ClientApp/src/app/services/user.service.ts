import { Injectable } from '@angular/core';
import {UserData} from "./user-data.service";

@Injectable()
export class UserService {

  constructor() { }

  isAuth=false;
 public role:string='none';


}



export interface User {
  id?: number
  email:string
  passwordHash: string
  userData?: UserData

}
