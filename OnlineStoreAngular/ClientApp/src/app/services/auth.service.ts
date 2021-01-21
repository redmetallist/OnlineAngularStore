import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {User, UserService} from "./user.service";
import jwt_decode from 'jwt-decode';
import {Observable, Subject, Subscription, interval} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private result: string;
  fromCheckout = false;
  public isAuthSubj$ = new Subject<boolean>();
  sub: Subscription;
  isSubscribe = false;

  constructor(private http: HttpClient, private router: Router, @Inject('BASE_URL') private baseUrl: string) {

  }


  public login(user: User, baseUrl: string): Promise<boolean> {
    return new Promise((resolve) => {
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
           resolve(false);
          });
    })

  }

  public logout() {
    localStorage.removeItem('auth_token');
    this.isAuthSubj$.next(false)
  }

  public logIn(): boolean {
    if (localStorage.getItem('auth_token') !== null) {
      if (!this.isSubscribe) {
        this.sub = interval(60000)
          .subscribe((val) => {
            this.isSubscribe = true;
            this.http.get(this.baseUrl + 'api/login/isTokenValid')
              .subscribe(() => {
              }, error => {
                localStorage.removeItem('auth_token');
                this.isAuthSubj$.next(false);
                this.isSubscribe = false;
                this.sub.unsubscribe();
                this.router.navigateByUrl('', {skipLocationChange: false}).then(() => {
                });
              });
          });
      }

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
      this.http.post(baseUrl + 'api/login/register', user, {responseType: 'text'})
        .subscribe(() => {
          this.login(user, baseUrl).then(res => {
            console.log('from register in login')
            resolve(true)
          })
        }, (error) => {
          console.log(error.status);//!!!!
          resolve(false);
        });
    })
  }

  public changePassword( currentPass:string, newPass:string): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.http.post(this.baseUrl + 'api/login/changePassword', {'currentPass':currentPass, 'newPass':newPass})
        .subscribe(() => {
            resolve(true)
          },  () => {
          resolve(false);
        });
    })
  }

}

