import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {HttpClient, HttpEventType} from "@angular/common/http";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Category, CategoryService} from "../services/category.service";
import {AuthService} from "../services/auth.service";


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})


export class AddProductComponent implements OnInit {
  form: FormGroup;
  types = ["png", "jpg", "jpeg"];
  description: string = '';
  title: string = '';
  cost: number = 0;
  status: boolean = false;
  chosenCategoryID: number = -1;
  public progress: number;
  public message: string = '';
  categories: Category [] = [];
  formData;
  isImage = false;
  isLastCategory = true;

  @Output() public onUploadFinished = new EventEmitter();

  constructor(private http: HttpClient,
              @Inject('BASE_URL') private baseUrl: string, private categoryService: CategoryService, private authService: AuthService, private router: Router) {
    categoryService.fromAddCategory = true;


    categoryService.selectedCategory$.subscribe(x => {
      this.chosenCategoryID = x;
      this.onCategoryChange()
    })
  }

  ngOnInit() {
    this.categoryService.getCategories(this.baseUrl)
      .subscribe(categories => {
        this.categories = categories;
      })
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      desc: new FormControl('', [Validators.required, Validators.minLength(10)]),
      cost: new FormControl('', [Validators.required])
    })
  }

  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    this.formData = new FormData();
    this.formData.append('file', fileToUpload, fileToUpload.name);
    console.log(fileToUpload.name.substr(fileToUpload.name.lastIndexOf('.') + 1));
    this.isImage = false
    for (let tmp of this.types) {
      if (fileToUpload.name.substr(fileToUpload.name.lastIndexOf('.') + 1) === tmp) {
        this.status = true;
        this.isImage = true
        this.message = ''
      }
    }
    if (!this.isImage)
      this.message = 'uploaded file is not an image.try again'


  }

  onCategoryChange() {
    console.log('ku-ku')
    let category = this.categories.filter(x => {
      return x.id === this.chosenCategoryID
    })[0];
    for (let a = 0; a < 3; a++) {
      console.log('from loop ', a)
      if (a === 2 && category.parentCategory === null) {
        this.isLastCategory = true;
        break;
      } else {
        this.isLastCategory = false;
        category = this.categories.filter(x => {
          return x.id === category.parentCategory
        })[0];
        if (category === undefined)
          break;
      }
    }
  }

  addProduct() {
    if (this.form.valid) {
      if (this.status) {
        console.log(this.formData);
        this.http.post(this.baseUrl + 'api/product/uploadImage/' + this.chosenCategoryID + '/' + this.cost + '/' + this.description + '/0/' + this.title, this.formData, {
          reportProgress: true,
          observe: 'events'
        })
          .subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
              this.message = null;
            } else if (event.type === HttpEventType.Response) {
              this.message = 'Upload success.';
              this.onUploadFinished.emit(event.body);
              console.log(event.body)
              alert('new product was added')
              this.router.navigateByUrl('', {skipLocationChange: false}).then(() => {
              });
            }
          });
      }
    }

  }
}
