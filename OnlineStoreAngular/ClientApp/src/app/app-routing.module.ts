import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {HomeComponent} from "./home/home.component";
import {RegisterComponent} from "./Auth/register/register.component";
import {LoginComponent} from "./Auth/login/login.component";
import {ShowCategoriesComponent} from "./categories/show-categories/show-categories.component";
import {CartComponent} from "./cart/cart.component";
import {ProductComponent} from "./product/product.component";
import {WishListComponent} from "./wish-list/wish-list.component";
import {UserOrdersComponent} from "./orders/user-orders/user-orders.component";
import {AdminOrdersComponent} from "./orders/admin-orders/admin-orders.component";
import {AddCategoryComponent} from "./categories/add-category/add-category.component";
import {AppGuard} from "./app.guard";
import {AddProductComponent} from "./add-product/add-product.component";




const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'product/:id', component: ProductComponent },
  { path: 'categories', component: ShowCategoriesComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cart', component: CartComponent },
  { path: 'wishes', component: WishListComponent },
  { path: 'orders', component: UserOrdersComponent },
  { path: 'addProduct', component: AddProductComponent, canActivate:[AppGuard]},
  { path: 'orderList', component: AdminOrdersComponent, canActivate:[AppGuard] },
  { path: 'addCategory', component: AddCategoryComponent, canActivate:[AppGuard] }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {


}

