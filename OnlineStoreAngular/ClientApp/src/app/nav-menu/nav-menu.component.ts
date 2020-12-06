import {Component, Inject, Input} from '@angular/core';
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
   role:string=''
 cartCount:number=this.Cart.counterOfItemsInCart();
constructor(private Auth:AuthService, private Cart:CartService) {
this.isAuth=this.Auth.logIn();
this.role=this.Auth.getRole();
console.log('is auth?',this.isAuth);
console.log('your role is ',this.role);
this.cartCount=this.Cart.counterOfItemsInCart();
}


}
