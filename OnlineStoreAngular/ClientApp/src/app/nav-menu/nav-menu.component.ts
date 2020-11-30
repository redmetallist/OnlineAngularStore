import {Component, Inject} from '@angular/core';
import {UserService} from "../services/user.service";
import {AuthService} from "../services/auth.service";
import {CartService} from "../services/cart.service";

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']

})
export class NavMenuComponent {

   isAuth: boolean = false;
   cartCount:number;
constructor(private Auth:AuthService, private Cart:CartService) {
this.isAuth=this.Auth.logIn();
console.log(this.isAuth);
this.cartCount=this.Cart.counterOfItemsInCart();
}

}
