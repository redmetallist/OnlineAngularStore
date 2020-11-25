import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../services/user.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private http: HttpClient,
              @Inject('BASE_URL') private baseUrl: string, private router: Router) { }

  form: FormGroup;
  email = ''
  passHash=''
  result= ''

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('' , [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])

  })}

  postData(){
    if (this.form.valid) {

      const newUser: User = {
        passwordHash: this.passHash, userData: {firstName:null, lastName: null },
        email : this.email
      }
     // this.loading = true;
      this.http.post<User>(this.baseUrl + 'api/login', newUser)
        .subscribe(result => {
          console.log('result ', result);
          this.result=result.toString()
        });
      if(this.result === "true")
      {
        this.router.navigate([''])
      }


    } else
      console.log('invalid!')

    this.form.reset();
  }
}

