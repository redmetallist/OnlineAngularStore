import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-admin-role',
  templateUrl: './admin-role.component.html',
  styleUrls: ['./admin-role.component.css']
})
export class AdminRoleComponent implements OnInit {
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
