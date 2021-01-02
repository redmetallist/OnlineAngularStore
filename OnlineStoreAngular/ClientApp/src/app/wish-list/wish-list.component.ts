import {Component, Inject, OnInit, Renderer2} from '@angular/core';
import {Product, ProductService} from "../services/product.service";
import {WishListService} from "../services/wish-list.service";

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit {

  wishes: Product[] = [];
  imgPath = ''

  constructor(@Inject('BASE_URL') private baseUrl: string, private wishListService: WishListService,
              private product: ProductService, private renderer: Renderer2) {
  }

  ngOnInit() {
    this.imgPath = this.baseUrl + 'api/product/image/'
    this.wishListService.getWishFromServer(this.baseUrl).then(wishList => {
      wishList.forEach(async element => {
        let productToWish: Product = {} as Product
        await this.product.getProductsById(this.baseUrl, element.productId).then((result) => {
          productToWish.id = result.id;
          productToWish.title = result.title;
          productToWish.cost = result.cost;
          productToWish.description = result.description;
          productToWish.categoryId = result.categoryId;
        });
        await this.wishes.push(productToWish);
      })
    })
  }

  removeFromWish(id: number) {
    this.wishListService.removeFromWish(id, this.baseUrl).then(result => {
      const parent = this.renderer.createElement('div');
      const child = document.getElementById(id.toString())
      this.renderer.appendChild(parent, child);
      this.renderer.removeChild(parent, child);
      this.wishes = this.wishes.filter(elem => {
        return elem.id != id
      })
    })
  }
}
