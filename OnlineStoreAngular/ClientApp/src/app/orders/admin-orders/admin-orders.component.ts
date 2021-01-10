import {Component, Inject, OnInit, Renderer2} from '@angular/core';
import {CheckoutService, Order} from "../../services/checkout.service";

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {

  orders: ClientOrders[] = []

  constructor(@Inject('BASE_URL') private baseUrl: string, private checkout: CheckoutService, private renderer: Renderer2) {
  }


  ngOnInit() {
    this.checkout.getActiveOrders(this.baseUrl).then(result => {
      console.log(result)
      result.forEach(element => {

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

  completeOrder(orderId: number) {
    this.checkout.completeOrder(this.baseUrl, orderId).then(result => {
      if (result) {
        const parent = this.renderer.createElement('div');
        const child = document.getElementById(orderId.toString())
        this.renderer.appendChild(parent, child);
        this.renderer.removeChild(parent, child);
      }
    })
  }
}

interface ClientOrders {
  orderId?: number,
  totalCost: number
  order?: Order[]
  mobileNumber?: string
  firstName?: string
  lastName?: string

}
