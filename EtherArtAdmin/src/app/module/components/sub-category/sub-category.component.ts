import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../base.component";
import {CollectionService} from "../../../service/collection.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.css']
})
export class SubCategoryComponent  extends BaseComponent implements OnInit {

  public categoryList: Array<any> = []
  public subCatList: Array<any> = []
  public selectedCategory: any ;
  public category_id :any;
  public subCategoryName:any;

  constructor(
      public collectionService:CollectionService,
      public snackBar: MatSnackBar
  ) {
    super();
  }
  ngOnInit(): void {
    this.getCategoryList();
  }

  actionClicked(item) {
    if(item.action=='Read') {
      item.action = 'Edit';
      this.selectedCategory = item.category_id
    } else {
      item.action = 'Read'
    }
  }

  cancel(item,idx:number) {
    if (!confirm('Do you want to cancel the changes?')) {
      return;
    }
    if (item.category_name == '') {
      this.subCatList.splice(idx,1)  
    } else {
      item.action = 'Read'
    }

  }

  getCategoryList() {
    let ids = { ids:'' }
    try {
      this.collectionService.getCategoryList(ids).subscribe(
          data => {
            this.process(data)
          }
      );
    } catch (e) {
      alert("error!!!")
      this.handleExcception(e);
    }
  }

  delete(item,idx:number) {
    try {
      if(confirm("Are sure to delete" +" "+'"'+item.sub_category_name+'"'+" "+"sub category")){
        let postObj = {
          sub_category_id:item.sub_category_id
        }
        let obj = {};
        obj['sub_category_json'] = JSON.stringify(postObj)
        this.collectionService.deleteSubCategory(obj).subscribe(
            data => {
              this.snackBar.open("Sub Category "+" "+'"'+item.sub_category_name+'"'+" "+" Deleted Successfully", "", { duration: 2000 });
              this.subCatList.splice(idx,1);
            },error => {
              alert(error);
            }
        )
      }

    } catch (e) {
      alert("error!!!")
      this.handleExcception(e);
    }
  }

  change(item) {
  }
  addNewSubCategory(item) {
    try {
      let postObj = {
        category_id : this.category_id,
        sub_category_name : this.subCategoryName
      }
      let obj = { };
      obj['sub_category_json'] = JSON.stringify(postObj);
      this.collectionService.addSubCategory(obj).subscribe(
          data => {
            this.snackBar.open("Sub Category "+" "+'"'+this.subCategoryName+'"'+" "+" added successfully", "", { duration: 2000 });
            item.category_id = this.category_id
            item.sub_category_name = this.subCategoryName
            let cat = this.categoryList.filter((cat:any) =>{ return cat.category_id == this.category_id})
            if (cat != null && cat.length > 0) {
              item.category_name = cat[0].category_name
            }
            item.action = 'Read'
          }
      );
    }  catch (e) {
      alert("error!!!")
      this.handleExcception(e);
    }

  }

  
  newRow() {
    let subCat = {
      category_id : null,
      category_name : '',
      sub_category_id: null,
      sub_category_name: '',
      is_delete: null,
      action : 'Edit'
    }
    this.subCatList.splice(0,0,subCat);
  }

  getSubCategoryById() {
    let obj ={
      category_id : null
    }
    try {
      this.collectionService.getSubCategoryByCategory(obj).subscribe(
          data => {
            this.process(data)
            
          }
      );
    } catch (e) {
      alert("error!!!")
      this.handleExcception(e);
    }
  }

  save(item) {
    this.category_id = this.selectedCategory
    this.subCategoryName = item.sub_category_name
    if(this.category_id != null && this.subCategoryName) {
      if (item.category_id == null) {
        this.addNewSubCategory(item)
      } else {
        let postObj = {
          category_id:item.category_id,
          sub_category_id:item.sub_category_id,
          sub_category_name:this.subCategoryName
        }
        let obj = {};
        obj['sub_category_json'] = JSON.stringify(postObj)
        this.collectionService.updateSubCategory(obj).subscribe(
            data => {
              this.snackBar.open("Sub Category Updated Successfully", "", { duration: 2000 });
              item.sub_category_name = this.subCategoryName
              item.action = 'Read'
              this.subCategoryName = ""
            },error => {
              alert("error!!!");
            }
        )
      }
    } else {
      alert("please select category and sub category name")
    }

  }


  process(json) {
    if (json != null && json != '' && json.length>0) {
      for (let i = 0; i < json.length; i++) {
        let cat = {
          category_id : json[i].category_id,
          category_name : json[i].category_name,
          is_delete : json[i].is_delete,
        }
        this.categoryList.push(cat)
        if (json[i].sub_categories != null) {
          for (let j = 0 ; j < json[i].sub_categories.length; j++) {
            let subCat = {
              category_id : json[i].category_id,
              category_name : json[i].category_name,
              sub_category_id: json[i].sub_categories[j].sub_category_id,
              sub_category_name: json[i].sub_categories[j].sub_category_name,
              is_delete: json[i].sub_categories[j].is_delete,
              action : 'Read'
            }
            this.subCatList.push(subCat)
          }
        }
      }
    }
  }
}
