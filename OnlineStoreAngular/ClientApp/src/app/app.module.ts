import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot} from '@angular/router';

import {AppComponent} from './app.component';
import {NavMenuComponent} from './nav-menu/nav-menu.component';
import {HomeComponent} from './home/home.component';
import {AppRoutingModule} from "./app-routing.module";
import {ShowCategoriesComponent} from "./categories/show-categories/show-categories.component";
import {RegisterComponent} from "./Auth/register/register.component";
import {LoginComponent} from "./Auth/login/login.component";
import {ProductComponent} from "./product/product.component";
import {ProductsComponent} from "./products/products.component";
import {UserRoleComponent} from "./roles/user-role/user-role.component";
import {CartComponent} from "./cart/cart.component";
import {UserService} from "./services/user.service";
import {AuthInterceptor} from "./services/auth-interceptor.service";
import {AdminRoleComponent} from "./roles/admin-role/admin-role.component";
import {CheckoutComponent} from "./checkout/checkout.component";
import {WishListComponent} from "./wish-list/wish-list.component";
import {UserOrdersComponent} from "./orders/user-orders/user-orders.component";
import {AdminOrdersComponent} from "./orders/admin-orders/admin-orders.component";
import {AddCategoryComponent} from "./categories/add-category/add-category.component";
import {AppGuard} from "./app.guard";
import {AddProductComponent} from "./add-product/add-product.component";
import {ChangePasswordComponent} from './change-password/change-password.component';



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
    CartComponent,
    AdminRoleComponent,
    CheckoutComponent,
    WishListComponent,
    UserOrdersComponent,
    AdminOrdersComponent,
    AddCategoryComponent,
    AddProductComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }, AppGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
