import {Component, Inject, OnInit} from '@angular/core';
import {CheckoutService, Order} from "../../services/checkout.service";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent implements OnInit {


  orders: ClientOrders[] = []

  constructor(@Inject('BASE_URL') private baseUrl: string, private checkout: CheckoutService, private productService: ProductService) {
  }

  private titles: IDictionary<string>[] = []


  ngOnInit() {
    this.checkout.getUserOrders(this.baseUrl).then(result => {
      result.forEach(element => {
        this.productService.getProductsById(this.baseUrl, element.productId).then(x => {
          this.titles[element.productId] = x.title
        })
        if (this.orders.filter(x => {
          return x.orderId == element.orderId
        }).length == 0) {
          let totalCost = 0;
          this.orders.push({
            orderId: element.orderId, order: result.filter(x => {
              if (x.orderId == element.orderId) {
                totalCost += x.cost * x.quantity;
                return true
              } else {
                return false
              }
            }), totalCost: totalCost
          });
        }
      })
    })
    console.log(this.orders)
  }

  getProductTitle(productId: number): IDictionary<string> {
    return this.titles[productId]
  }
}

interface ClientOrders {
  orderId?: number,
  totalCost: number
  order?: Order[]

}

interface IDictionary<TValue> {
  [id: number]: TValue;
}
