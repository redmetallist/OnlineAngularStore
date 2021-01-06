import {Component, Inject, OnInit, Renderer2} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserData} from "../services/user-data.service";
import {CartService} from "../services/cart.service";
import {ProductService} from "../services/product.service";
import {AuthService} from "../services/auth.service";
import {CheckoutService} from "../services/checkout.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(@Inject('BASE_URL') private baseUrl: string, private cart: CartService,
              private auth: AuthService, private router: Router, private checkout: CheckoutService) {
  }

  form: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      mobileNumber: new FormControl('', [Validators.required, Validators.minLength(9)])

    })
  }

  fName = ''
  lName = ''
  mobileNumber = ''

  doOrder() {
    if (this.form.valid) {
      const userData: UserData = {
        firstName: this.fName,
        lastName: this.lName,
        mobileNumber: this.mobileNumber
      }
      this.checkout.doOrder(userData, this.baseUrl).then(result => {
        if (result) {
          this.cart.removeLocalCart();
          this.cart.subject$.next(0);
          this.router.navigateByUrl('', {skipLocationChange: false})
        }
      })

      console.log(userData)
    }


  }


}
