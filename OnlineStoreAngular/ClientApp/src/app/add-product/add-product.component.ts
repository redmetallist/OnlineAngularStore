import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {HttpClient, HttpEventType} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})


export class AddProductComponent implements OnInit {

  constructor(private http: HttpClient,
              @Inject('BASE_URL') private baseUrl: string, private router: Router) {
  }

  ngOnInit() {

  }





}
