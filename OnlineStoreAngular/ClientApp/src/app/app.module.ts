import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import {AppRoutingModule} from "./app-routing.module";
import {ShowCategoriesComponent} from "./categories/show-categories/show-categories.component";
import {RegisterComponent} from "./Auth/register/register.component";
import {LoginComponent} from "./Auth/login/login.component";
import {ProductComponent} from "./product/product.component";
import {ProductsComponent} from "./products/products.component";
import {UserRoleComponent} from "./user-role/user-role.component";
import {CartComponent} from "./cart/cart.component";
import {UserService} from "./services/user.service";


@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        ShowCategoriesComponent,
        RegisterComponent,
        LoginComponent,
        ProductComponent,
        ProductsComponent,
        UserRoleComponent,
      CartComponent
    ],
  imports: [
    BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers:[UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
