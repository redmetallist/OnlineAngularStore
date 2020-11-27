import {Component, Inject} from '@angular/core';
import {UserService} from "../services/user.service";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']

})
export class NavMenuComponent {

   isAuth: boolean;
constructor(private Auth:AuthService) {
this.isAuth=this.Auth.logIn();
console.log(this.isAuth);
}

}
