import {Component, Inject, Input, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {AuthService} from "../services/auth.service";
import {CartService} from "../services/cart.service";
import {Observable} from "rxjs";
import {ProductService} from "../services/product.service";

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']

})
export class NavMenuComponent implements OnInit{

   isAuth: boolean = false;
   role:string=''
  cartCount: number;

constructor(@Inject('BASE_URL') private baseUrl: string, private Auth:AuthService, private Cart:CartService, private Products:ProductService) {
this.isAuth=this.Auth.logIn();
this.role=this.Auth.getRole();
console.log('is auth?',this.isAuth);
console.log('your role is ',this.role);
if(this.isAuth) {
  this.Cart.SyncCartWithServer(this.baseUrl).then((serverCart) => {
  })
}
else {
  this.Cart.counterOfItemsInCart()
}




}

  ngOnInit(): void {
  this.cartCount=0;
    this.Cart.subject$.subscribe(x=> {this.cartCount=x})
  }


  ReloadMainPage() {
    this.Products.getProducts(this.baseUrl)
  }
}
