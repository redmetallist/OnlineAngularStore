import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Product, ProductService} from "../services/product.service";
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {

  isAuth: boolean;
  constructor(@Inject('BASE_URL') private baseUrl: string, private Auth:AuthService, private product: ProductService) {
    this.isAuth=this.Auth.logIn();
    //this.getAllProducts()
  }
products:Product[]=[]
  ngOnInit() {
    this.getAllProducts();


  }
  isLoad:boolean=true;
  getAllProducts(){
    const request = this.product;
    request.getProducts(this.baseUrl).then((result) => {
      this.products=result;
      this.isLoad=false;
     // this.imgPath=this.baseUrl + 'api/product/image/'+this.id.toString()
    });
  }

  getImage(id:number):string {
    return this.baseUrl + 'api/product/image/'+id.toString()
  }
}
