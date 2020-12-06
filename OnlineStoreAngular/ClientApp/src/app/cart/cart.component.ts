import {Component, Inject, OnInit} from '@angular/core';
import {CartProducts, CartService} from "../services/cart.service";
import {ProductService} from "../services/product.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  productCart: CartProducts[] = [];
  productForCart = {} as CartProducts
  totalCost:number=0;

  constructor(@Inject('BASE_URL') private baseUrl: string, private cart: CartService,
              private product: ProductService) {

    const promise = this.cart;
    promise.GetCartFromServer(this.baseUrl).then((serverCart) => {
      console.log('servercart ', serverCart)
//      console.log('product for cart ',this.productForCart)
      serverCart.forEach(async element => {
        console.log('element', element)


        await this.product.getProductsById(this.baseUrl, element.productId).then((result) => {
          this.productForCart.cost = result.cost;
          this.productForCart.title = result.title;
          this.productForCart.description = result.description;
          this.productForCart.quantity = element.quantity;
          this.productForCart.imgsrc = this.baseUrl + 'api/product/image/' + element.productId;
          this.productForCart.id = element.productId;
          this.totalCost+=result.cost;
        });
        await this.productCart.push(this.productForCart);
        this.productForCart = {} as CartProducts;
      })


    })
    console.log('product cart for view: ', this.productCart)
  }

  ngOnInit() {

  }

}
