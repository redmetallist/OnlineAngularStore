import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor() { }



}

export interface UserData {
  id?: number
  userId?:number
  firstName: string
  lastName: string
  address?: string
 city?: string
  zipCode?: string
  country?: string
  mobileNumber:string


}
