import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router"
import {User} from "../../services/user.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private http: HttpClient,
              @Inject('BASE_URL') private baseUrl: string, private router: Router) {
  }

  form: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  email = ''
  passHash=''
result= '' ;
 // submit() {
  postData(){
    if (this.form.valid) {

const newUser: User = {
  passwordHash: this.passHash,
  email : this.email
}
      this.http.post<User>(this.baseUrl + 'api/register', newUser)
        .subscribe(result => {
          console.log('result ', result);
          this.result=result.toString()
          if(this.result === "true")
          {
            this.router.navigate(['/login'])
          }
        });


    } else
      console.log('invalid!')

    this.form.reset();
  }
}



