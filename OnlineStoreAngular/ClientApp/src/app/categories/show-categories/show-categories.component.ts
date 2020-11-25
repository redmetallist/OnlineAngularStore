import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Category, CategoryService} from "../../services/category.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-show-categories',
  templateUrl: './show-categories.component.html',
  styleUrls: ['./show-categories.component.css']
})
export class ShowCategoriesComponent implements OnInit {

  constructor(private http: HttpClient,
              @Inject('BASE_URL') private baseUrl: string,
              private categoryService: CategoryService) {


  }
  form: FormGroup;

  AllCategories: Category [] = [];
  ngOnInit() {

    this.form = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(6)]),

    })

    this.getCategories();
    this.showAllCategories();
  }

  sortedCategories: Category[]= [];


  getCategories(){
    // this.loading = true;
    // this.http.get<Category []>(this.baseUrl + 'api/categories')
    //   .subscribe(categories => {
    //     console.log(categories);
    //     this.AllCategories = categories;
    //     this.loading = false;
    //     this.iSortNodes();
    //   });
this.AllCategories=[{id:1, title:'Parent1', parentCategory:null},
  {id:2, title:'child1', parentCategory:1},
  {id:3, title:'child 1-1', parentCategory:2},
  {id:4, title:'Parent2', parentCategory:null},
  {id:5, title:'child2', parentCategory:4},
  {id:6, title:'child 2-1', parentCategory:5}]
    this.iSortNodes();

  }

  iSortNodes()
  {
    this.sortedCategories=[];
    for(let element of this.AllCategories.filter(x=> x.parentCategory==null))
    {
      this.sortedCategories.push(element);
      this.iSortChildrenRecursive(element)
    }
    console.log(this.sortedCategories)
  }

  iSortChildrenRecursive(node:Category){
    for(let child of this.AllCategories.filter(x=> x.parentCategory===node.id))
    {
      this.sortedCategories.push(child)

      if(this.AllCategories.filter(x=> x.parentCategory===child.id).length>0)
        this.iSortChildrenRecursive(child)

    }
  }

  showAllCategories()
  {
    let initial=document.getElementById('initial');
    console.log('sorted', this.sortedCategories)
    for(let element of this.sortedCategories)
    {
      let parent;
      if(element.parentCategory==null)
      {

       let elem = '<li id="element'+ element.id+'" > ' +
          element.title
        document.querySelector("#initial").insertAdjacentHTML('beforeend', elem);
        document.querySelector("#element"+element.id ).addEventListener('click', this.choosedCategory);
      }
      else {
       parent = document.getElementById('element'+element.parentCategory)
        console.log(parent)
        //console.log(document.getElementById('element'+element.parentCategory.toString()).nodeName)
        if(document.getElementById('element'+element.parentCategory.toString()).nodeName=='LI')
        {
        //  console.log(document.getElementById('element'+element.parentCategory.toString()).nodeName)

            let elem = ' <ul class="submenu"><li id="element'+ element.id+'" >' +
          element.title +'</li>'
          document.querySelector("#element"+element.parentCategory).insertAdjacentHTML('beforeend', elem);
          document.querySelector("#element"+element.parentCategory).addEventListener('click', this.choosedCategory);
        }
      else {

        let elem = '<li id="element'+ element.id+'"  >' +
          element.title +'</li>'
        document.querySelector("#element"+element.parentCategory).insertAdjacentHTML('beforeend', elem);
          document.querySelector("#element"+element.parentCategory ).addEventListener('click', this.choosedCategory);
      }

      }

    }
  }


  choosedCategory(event){
    console.log(event)
    let target = event.target || event.currentTarget;
   let idAttr = target.attributes.id;
    console.log(idAttr)

  }



}
