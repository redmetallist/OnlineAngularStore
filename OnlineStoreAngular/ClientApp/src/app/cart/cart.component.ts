import {Component, Inject, OnInit, Renderer2} from '@angular/core';
import {CartProducts, CartService} from "../services/cart.service";
import {ProductService} from "../services/product.service";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  productCart: CartProducts[] = [];
  productForCart = {} as CartProducts
  totalCost: number = 0;
  doCheckout=false;
  private cartCount: number;


  constructor(@Inject('BASE_URL') private baseUrl: string, private cart: CartService,
              private product: ProductService, private renderer: Renderer2, private auth: AuthService) {


    {
      if (auth.logIn()) {
        this.cart.GetCartFromServer(this.baseUrl).then((serverCart) => {
            console.log('servercart ', serverCart)
//      console.log('product for cart ',this.productForCart)
            serverCart.forEach(async element => {
              console.log('element', element)


              await this.product.getProductsById(this.baseUrl, element.productId).then((result) => {
                this.productForCart.cost = result.cost;
                this.productForCart.title = result.title;
                this.productForCart.description = result.description;
                this.productForCart.quantity = element.quantity;
                this.productForCart.imgsrc = this.baseUrl + 'api/product/image/' + element.productId;
                this.productForCart.id = element.productId;
                if (this.productForCart.quantity > 1) {
                  this.totalCost += result.cost * this.productForCart.quantity;
                } else {
                  this.totalCost += result.cost;
                }
              });
              await this.productCart.push(this.productForCart);
              this.productForCart = {} as CartProducts
            })

          },
          (error) => {
            console.log('from cart error')
          }
        )

      } else {
        if (cart.GetCartFromLocal() != undefined) {

          cart.GetCartFromLocal().forEach(async x => {
            console.log('cart from local', x)

            await this.product.getProductsById(this.baseUrl, x).then((result) => {
              this.productForCart.cost = result.cost;
              this.productForCart.title = result.title;
              this.productForCart.description = result.description;
              this.productForCart.quantity = 1;
              this.productForCart.imgsrc = this.baseUrl + 'api/product/image/' + x;
              this.productForCart.id = x;
              this.totalCost += result.cost;
              console.log('from get product from server', this.productForCart)
            }).then(() => {
              new Promise(() => {
                if (this.productCart.filter(ex => {
                  return ex.id === x
                }).length > 0) {
                  this.productCart.forEach((element, index) => {
                    if (element.id === x) {
                      element.quantity++;
                    }
                  })
                  this.productForCart = {} as CartProducts
                } else {

                  this.productCart.push(this.productForCart);
                  this.productForCart = {} as CartProducts
                }
              })
            })


          })

          console.log('product cart for view: ', this.productCart)
        }
      }


    }
  }

  ngOnInit() {
    this.cartCount = this.productCart.length;
    this.cart.subject$.subscribe(x => {
      this.cartCount = x
    })
    this.cart.counterOfItemsInCart();
  }

  RemoveItemFromCart(id: number) {

    this.cart.removeFromCart(id, this.baseUrl).then(res => {
      const parent = this.renderer.createElement('div');
      const child = document.getElementById(id.toString())
      this.renderer.appendChild(parent, child);
      this.renderer.removeChild(parent, child);
    })

  }


   changeQuantity($event, id: number) {
    let quantity: number = +$event;
    if ($event > 10) {
      document.getElementById(id.toString()).getElementsByTagName('input')[0].value = '10'
      quantity = 10;
    }


    if ($event < 1) {
      quantity = 1
      document.getElementById(id.toString()).getElementsByTagName('input')[0].value = '1'
    }
   this.cart.setQuantity(id, quantity, this.baseUrl).then(r => {
     if(r){
       this.totalCost = 0;
       console.log(this.productCart)
       this.productCart.forEach(element => {
         this.totalCost += element.cost * element.quantity;
         console.log('total', this.totalCost)
       })
     }
        })


  }

  checkout() {
    this.auth.fromCheckout = true;
  }

  doCheckOut() {
    this.doCheckout=true;
  }
}
