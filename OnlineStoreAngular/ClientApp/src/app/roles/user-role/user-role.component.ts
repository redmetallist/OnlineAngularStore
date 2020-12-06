import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.css']
})
export class UserRoleComponent implements OnInit {
  auth;

  constructor(auth: AuthService) {
    this.auth = auth
  }

  ngOnInit() {
  }

  logout() {
    this.auth.logout();
  }
}
