import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Category} from "../../services/category.service";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-show-categories',
  templateUrl: './show-categories.component.html',
  styleUrls: ['./show-categories.component.css']
})
export class ShowCategoriesComponent {


  constructor(private http: HttpClient,
              @Inject('BASE_URL') private baseUrl: string,
              private product: ProductService) {
    this.getCategories();


  }

  AllCategories: Category [] = [];
  sortedCategories: Category[] = [];


  getCategories() {
    this.http.get<Category []>(this.baseUrl + 'api/categories')
      .subscribe(categories => {
        this.AllCategories = categories;
        this.iSortNodes();
        this.showAllCategories();
      });

    this.iSortNodes();

  }

  iSortNodes() {
    this.sortedCategories = [];
    for (let element of this.AllCategories.filter(x => x.parentCategory == null)) {
      this.sortedCategories.push(element);
      this.iSortChildrenRecursive(element)
    }
  }

  iSortChildrenRecursive(node: Category) {
    for (let child of this.AllCategories.filter(x => x.parentCategory === node.id)) {
      this.sortedCategories.push(child)

      if (this.AllCategories.filter(x => x.parentCategory === child.id).length > 0)
        this.iSortChildrenRecursive(child)

    }
  }

  showAllCategories() {

    for (let element of this.sortedCategories) {
      let parent;
      if (element.parentCategory == null) {

        let elem = '<li id="element' + element.id + '" > ' +
          element.title
        document.querySelector("#initial").insertAdjacentHTML('beforeend', elem);
        document.querySelector("#element" + element.id).addEventListener('click', this.choosedCategory.bind(this));
      } else {
        parent = document.getElementById('element' + element.parentCategory)
        if (document.getElementById('element' + element.parentCategory.toString()).nodeName == 'LI') {
          //  console.log(document.getElementById('element'+element.parentCategory.toString()).nodeName)

          let elem = ' <ul class="submenu"><li id="element' + element.id + '" >' +
            element.title + '</li>'
          document.querySelector("#element" + element.parentCategory).insertAdjacentHTML('beforeend', elem);
          document.querySelector("#element" + element.parentCategory).addEventListener('click', this.choosedCategory.bind(this));
        } else {

          let elem = '<li id="element' + element.id + '"  >' +
            element.title + '</li>'
          document.querySelector("#element" + element.parentCategory).insertAdjacentHTML('beforeend', elem);
          document.querySelector("#element" + element.parentCategory).addEventListener('click', this.choosedCategory.bind(this));
        }

      }

    }
  }


  choosedCategory(event) {
    console.log(event)
    let target = event.target || event.currentTarget;
    let idAttr = target.attributes.id;
    // console.log('choosed category ',idAttr)
    // console.log( JSON.stringify(idAttr.nodeValue))
    let str = idAttr.nodeValue.toString().substr(7, idAttr.nodeValue.length - 6);
    console.log(str)
    //this.router.navigate[''];

    this.product.getProductInCategory(this.baseUrl, str)

  }



}
