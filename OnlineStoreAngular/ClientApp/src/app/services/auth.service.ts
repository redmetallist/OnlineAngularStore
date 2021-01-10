import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {User, UserService} from "./user.service";
import jwt_decode from 'jwt-decode';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private result: string;
  fromCheckout = false;
  public isAuthSubj$ = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {

  }


  public login(user: User, baseUrl: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.post<User>(baseUrl + 'api/login/login', user)
        .subscribe((result: any) => {
          //  console.log('result ', result);
            this.result = result.toString()
            localStorage.setItem('auth_token', result.access_token);
this.isAuthSubj$.next(true);
            resolve(true);
            //this.router.navigate([''])
          },
          (error) => {
            //console.log(error.status);
            this.isAuthSubj$.next(false);
            reject(false);
          });
    })

  }

  public logout() {
    localStorage.removeItem('auth_token');
    this.isAuthSubj$.next(false)
    //  location.reload();
  }

  public logIn(): boolean {
    if (localStorage.getItem('auth_token') !== null) {
      this.isAuthSubj$.next(true);
    } else this.isAuthSubj$.next(false);
    return (localStorage.getItem('auth_token') !== null);
  }

  public getRole(): string {
    let role = ''
    if (localStorage.getItem('auth_token') !== null) {

      let decoded = jwt_decode(localStorage.getItem('auth_token'));
      role = JSON.stringify(
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])
    }
    // @ts-ignore
    return role.replaceAll('"', '')
  }

  public register(baseUrl: string, user: User): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.http.post<User>(baseUrl + 'api/login/register', user)
        .subscribe(() => {
          this.login(user, baseUrl).then(res => {
            console.log('from register in login')
            resolve(true)
          }, (error) => {
            console.log(error.status);
            resolve(false);
          })
        }, (error) => {
          console.log(error.status);//!!!!
          resolve(false);
        });
    })
  }

}
