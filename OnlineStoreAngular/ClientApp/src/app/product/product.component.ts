import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Product, ProductService} from "../services/product.service";
import {CartService} from "../services/cart.service";
import {WishListService} from "../services/wish-list.service";
import {AuthService} from "../services/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  id: number;
  isInWish=false;
  role='User';
  form:FormGroup;
  product:Product;
  description: string='';
  title: string='';
  cost: number=0;
  constructor(@Inject('BASE_URL') private baseUrl: string, private products: ProductService, private activateRoute: ActivatedRoute, private cart:CartService,
              private wishListService:WishListService, private authService:AuthService) {
    this.id = activateRoute.snapshot.params['id'];
    console.log('id is '+this.id)
    console.log(this.description)

  }
imgPath='';
  ngOnInit() {
    this.getProduct();
   this.wishListService.isInWish(this.id, this.baseUrl).then(res=>{
     this.isInWish=res;
   })
    if(this.authService.getRole()!=''){
      console.log(this.authService.getRole())
      this.role=this.authService.getRole()
      if(this.role==='Admin') {
        this.form = new FormGroup({
          title: new FormControl('', [Validators.required, Validators.minLength(3)]),
          desc: new FormControl('', [Validators.required, Validators.minLength(10)]),
          cost: new FormControl('', [Validators.required])
        })
        this.title=this.product.title
      }

    }
  }

    getProduct(){
      const request = this.products;
      request.loadProduct(this.id, this.baseUrl).then((result) => {
this.product=result;
        this.imgPath=this.baseUrl + 'api/product/image/'+this.id.toString()
        console.log('!!!!!')
        this.title=this.product.title
        this.cost=this.product.cost
        this.description=this.product.description
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

  updateProduct() {

  }
}
