import {Component, Inject, OnInit} from '@angular/core';
import {Category, CategoryService} from "../../services/category.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  parentCategory: number = -1;
  parentCategoryName:string=''
  categories: Category [] = [];
  categoryName: string;
  form: FormGroup;
  isCanAdd=true;

  constructor(@Inject('BASE_URL') private baseUrl: string, private categoryService: CategoryService, private authService: AuthService) {
    categoryService.fromAddCategory = true;
    categoryService.selectedCategory$.subscribe(x => {
     this.onCategoryChange(x);
      //this.parentCategory = x;
    })
    this.categoryService.getCategories(this.baseUrl)
      .subscribe(categories => {
        this.categories = categories;
      });
  }

  private onCategoryChange(x: number) {
    this.parentCategory = x;
    this.parentCategoryName=this.categories.filter(element=>{return element.id==x})[0].title;
    let element=this.categories.filter(el=>{return el.id==x})[0];
    for(let i=0; i<2;i++){
      if(element.parentCategory==null){
        this.isCanAdd=true;
        return
      }
      else {
        this.isCanAdd=false;
      }
      element=this.categories.filter(el=>{return el.id==element.parentCategory})[0];
    }
  }


  ngOnInit() {
    this.authService.logIn();
    this.form = new FormGroup({
      categoryName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    })
  }

  addCategory() {
//to do in future
  }

  addRootCategory() {

  }

}
