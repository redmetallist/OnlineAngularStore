import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {User, UserService} from "./user.service";
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private result: string;

  constructor(private http: HttpClient,private router: Router) {
    let promise = new Promise(function(resolve, reject) {
      // функция-исполнитель (executor)
      // "певец"
    });
  }

  public login(user: User, baseUrl: string):Promise<boolean>{
    return new Promise(( resolve,reject) => {
      let isOk = false;
      this.http.post<User>(baseUrl + 'api/login', user)
        .subscribe((result: any) => {
            console.log('result ', result);
            this.result = result.toString()
            localStorage.setItem('auth_token', result.access_token);
            isOk = true;
            resolve(isOk);
            //this.router.navigate([''])
          },
          (error) => {
            console.log(error.status);
            isOk = false;
            reject(isOk);
            // get the status as error.status
          });
    })

  }




  // login(user: User, baseUrl: string)  {
  //   let isOk=false;
  //   this.http.post<User>(baseUrl + 'api/login', user)
  //     .subscribe((result:any) => {
  //         console.log('result ', result);
  //         this.result=result.toString()
  //         localStorage.setItem('auth_token', result.access_token);
  //         isOk=true;
  //         //this.router.navigate([''])
  //       },
  //       (error) => {
  //         console.log(error.status);
  //         isOk=false;
  //         // get the status as error.status
  //       });
  //   return isOk;
  // }





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
