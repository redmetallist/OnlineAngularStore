import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router"
import {User} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private http: HttpClient,
              @Inject('BASE_URL') private baseUrl: string, private router: Router, private auth: AuthService, private Cart:CartService) {
  }

  form: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  email = ''
  passHash = ''

  // submit() {
  postData() {
    if (this.form.valid) {
      const newUser: User = {
        passwordHash: this.passHash,
        email: this.email
      }
      this.auth.register(this.baseUrl, newUser).then(result => {
        if(result) {
          console.log('from true result')
          this.router.navigateByUrl('', {skipLocationChange: false}).then(() => {
            console.log('from navigate')
            this.Cart.SyncCartWithServer(this.baseUrl).then();
          });
        }
      })
    } else
      console.log('invalid!')

    this.form.reset();
  }
}



