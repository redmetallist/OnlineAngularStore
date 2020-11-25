import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {HomeComponent} from "./home/home.component";
import {RegisterComponent} from "./Auth/register/register.component";
import {LoginComponent} from "./Auth/login/login.component";
import {ShowCategoriesComponent} from "./categories/show-categories/show-categories.component";
import {CartComponent} from "./cart/cart.component";
import {ProductComponent} from "./product/product.component";

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  // { path: 'products', component: ProductsComponent },
  { path: 'product', component: ProductComponent },
  { path: 'categories', component: ShowCategoriesComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cart', component: CartComponent },
  // { path: 'addProduct', component: AddProductComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}