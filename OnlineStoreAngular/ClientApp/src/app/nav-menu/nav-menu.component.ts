import { Component } from '@angular/core';
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  isAuth=false;
constructor(private Auth:UserService) {
  this.isAuth=this.Auth.isAuth;
}
  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
