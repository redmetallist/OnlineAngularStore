import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Product, ProductService} from "../services/product.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  id: number;

  constructor(@Inject('BASE_URL') private baseUrl: string, private products: ProductService, private activateRoute: ActivatedRoute) {
    this.id = activateRoute.snapshot.params['id'];
    console.log('id is '+this.id)
  }
imgPath='';
  ngOnInit() {
    this.getProduct();


  }
product:Product;
    getProduct(){
      const request = this.products;
      request.loadProduct(this.id, this.baseUrl).then((result) => {
this.product=result;
        this.imgPath=this.baseUrl + 'api/product/image/'+this.id.toString()
      });
    }


}
