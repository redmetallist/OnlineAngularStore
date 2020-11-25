import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor() { }



}

export interface UserData {
  id?: number
  firstName: string
  lastName: string
  address?: string
 city?: string
  zipCode?: string
  country?: string


}
