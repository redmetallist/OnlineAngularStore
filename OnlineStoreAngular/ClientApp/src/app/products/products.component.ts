import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Product, ProductService} from "../services/product.service";
import {CartService} from "../services/cart.service";
import {Router} from "@angular/router";
import {observable} from "rxjs";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {

isAuth:boolean
  constructor(@Inject('BASE_URL') private baseUrl: string, private Auth:AuthService,
              private product: ProductService, private cart:CartService, private router: Router) {
this.isAuth=this.Auth.logIn();

    //this.getAllProducts()
  }
products:Product[]=[]
  ngOnInit() {
  this.product.products$.subscribe(x=>{
    this.products=x
  })
    this.getAllProducts();

  }
  isLoad:boolean=true;
  getAllProducts(){
    const request = this.product;
    request.getProducts(this.baseUrl).then((result) => {
      this.products=result;
      this.isLoad=false;
    });
  }

  getImage(id:number):string {
    return this.baseUrl + 'api/product/image/'+id.toString()
  }

  addToCart(product:Product) {
    let id:number=product.id;
    this.cart.addToCart(id,this.baseUrl)
    this.cart.counterOfItemsInCart();

  }


}
