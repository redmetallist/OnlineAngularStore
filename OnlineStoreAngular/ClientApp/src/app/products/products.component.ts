import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  isAuth: boolean;
  constructor(private Auth:AuthService) {
    this.isAuth=this.Auth.logIn();}

  ngOnInit() {
  }

}
