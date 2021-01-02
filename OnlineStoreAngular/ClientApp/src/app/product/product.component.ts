import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Product, ProductService} from "../services/product.service";
import {CartService} from "../services/cart.service";
import {WishListService} from "../services/wish-list.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  id: number;
  isInWish=false;
  constructor(@Inject('BASE_URL') private baseUrl: string, private products: ProductService, private activateRoute: ActivatedRoute, private cart:CartService,
              private wishListService:WishListService) {
    this.id = activateRoute.snapshot.params['id'];
    console.log('id is '+this.id)
  //
  //  this.wishListService.getWishFromServer()

  }
imgPath='';
  ngOnInit() {
    this.getProduct();
   this.wishListService.isInWish(this.id, this.baseUrl).then(res=>{
     this.isInWish=res;
   })
  }
product:Product;
    getProduct(){
      const request = this.products;
      request.loadProduct(this.id, this.baseUrl).then((result) => {
this.product=result;
        this.imgPath=this.baseUrl + 'api/product/image/'+this.id.toString()
        console.log('!!!!!')
      });
    }

  addToCart(product:Product) {
    let id:number=product.id;
    this.cart.addToCart(id,this.baseUrl)
    this.cart.counterOfItemsInCart();

  }


  addToWish(id: number) {
    this.wishListService.addToWish(id,this.baseUrl).then(result=>{
      if(result)
        this.isInWish=true;
    })
  }
}
