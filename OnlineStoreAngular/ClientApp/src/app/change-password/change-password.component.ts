import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  form: FormGroup;
  oldPass: string;
  newPass: string;
  confirmPass: string;

  ngOnInit() {
    this.form = new FormGroup({
      oldPwd: new FormControl('', [Validators.required, Validators.minLength(6)]),
      newPwd: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPwd: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }


  constructor(private authService: AuthService, private router: Router) {

  }


  checkPassword(): boolean {
    return this.newPass === this.confirmPass;
  }

  changePassword() {
    if (this.form.valid) {
      this.authService.changePassword(this.oldPass, this.newPass).then(res => {
        if (res) {
          this.router.navigateByUrl('', {skipLocationChange: false}).then(() => {
          });
        } else {
          this.newPass = ''
          this.oldPass = ''
          this.confirmPass = ''

          alert('something wrong. try again')
        }

      })
    } else {
      alert('form is invalid');
    }
  }
}
