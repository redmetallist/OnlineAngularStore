import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {User, UserService} from "../../services/user.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private http: HttpClient,
              @Inject('BASE_URL') private baseUrl: string, private router: Router, private user: UserService, private auth: AuthService, private Cart: CartService) {
  }

  form: FormGroup;
  email = ''
  passHash = ''

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  postData() {
    if (this.form.valid) {
      const user: User = {
        passwordHash: this.passHash,
        email: this.email
      }

      this.auth.login(user, this.baseUrl).then((result) => {
        if (result) {
          this.user.isAuth = true;
          this.router.navigateByUrl('', {skipLocationChange: false}).then(() => {
            this.Cart.SyncCartWithServer(this.baseUrl).then();
          });
          if (this.auth.fromCheckout) {
            this.router.navigateByUrl('checkout', {skipLocationChange: false}).then(() => {
              this.Cart.SyncCartWithServer(this.baseUrl).then();
            });
          }
        } else {
          this.email = '';
          this.passHash = '';
          alert('the entered data is incorrect or user dont exist');
        }

      });

    } else
      console.log('invalid!')

    this.form.reset();
  }
}


