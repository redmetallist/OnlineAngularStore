import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Product, ProductService} from "../services/product.service";
import {CartService} from "../services/cart.service";
import {Router} from "@angular/router";
import {WishListService} from "../services/wish-list.service";
import {IWishList} from "../services/wish-list.service";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {

  isAuth: boolean
  wishList: IWishList[] = []
  form: FormGroup;
  products: Product[] = []
  isLoad: boolean = true;

  constructor(@Inject('BASE_URL') private baseUrl: string, private Auth: AuthService,
              private product: ProductService, private cart: CartService, private router: Router,
              private wishListService: WishListService) {
    this.isAuth = this.Auth.logIn();
    this.wishListService.getWishFromServer(baseUrl).then(wishlist => {
      this.wishList = wishlist;
    })
  }



  ngOnInit() {
    this.product.products$.subscribe(x => {
      this.products = x
    })
    this.getAllProducts();

  }



  getAllProducts() {
    const request = this.product;
    request.getProducts(this.baseUrl).then((result) => {
      this.products = result;
      this.isLoad = false;
    });
  }

  getImage(id: number): string {
    return this.baseUrl + 'api/product/image/' + id.toString()
  }

  addToCart(product: Product) {
    let id: number = product.id;
    this.cart.addToCart(id, this.baseUrl)
    this.cart.counterOfItemsInCart();

  }


  addToWish(id: number) {
    this.wishListService.addToWish(id, this.baseUrl).then(result => {
      if (result) {
        console.log('added!')
        this.wishListService.getWishFromServer(this.baseUrl).then(wishlist => {
          this.wishList = wishlist;
        })
      }
    })
  }

  isInWish(id: number): boolean {
    if (this.wishList.length > 0) {
      console.log('from isInWish')
      return (this.wishList.filter(elem => {
        return elem.productId === id
      })).length > 0
    }
    return false;
  }
}
