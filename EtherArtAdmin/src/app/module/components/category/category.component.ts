import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {BaseComponent} from "../base.component";
import {CollectionService} from "../../../service/collection.service";
import {stringify} from "@angular/compiler/src/util";
import {error} from "protractor";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.css']
})
export class CategoryComponent extends BaseComponent implements OnInit {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    public categoryList: Array<any> = []
    public categoryName;
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
            this.categoryName = item.category_name
        } else {
            item.action = 'Read'
        }
    }

    delete(item,idx:number) {
        try {
            if(confirm("Are sure to delete"+" "+'"'+item.category_name+'"'+" "+"category")){
                let postObj = {
                    category_id:item.category_id
                }
                let obj = {};
                obj['category_json'] = JSON.stringify(postObj)
                this.collectionService.deleteCategory(obj).subscribe(
                    data => {
                        this.snackBar.open("Category"+" "+'"'+item.category_name+'"'+" "+"Deleted Successfully", "", { duration: 2000 });
                        this.categoryList.splice(idx,1);
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

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }
    }

    addNewCategory(item) {
        try {
            let postObj = { category_name:this.categoryName };
            let obj={};
            obj['category_json'] = JSON.stringify(postObj);
            this.collectionService.addCategory(obj).subscribe(
                data => {
                    this.snackBar.open("Category"+" "+'"'+this.categoryName+'"'+" "+"Added Successfully", "", { duration: 2000 });
                    item.category_name = this.categoryName
                    item.action = 'Read'
                    item.category_id = data.category_id
                    this.categoryName = ""
                    this.scrollToBottom()
                }
            );
        }   catch (e) {
            alert("error!!!")
            this.handleExcception(e);
        }
    }

    save(item) {
        if(this.categoryName != null) {
            if (item.category_id == -1) {
                this.addNewCategory(item)
            } else {
                let postObj = {
                    category_id:item.category_id,
                    category_name:this.categoryName
                }
                let obj = {};
                obj['category_json'] = JSON.stringify(postObj)
                this.collectionService.updateCategory(obj).subscribe(
                    data => {
                        this.snackBar.open("Category Updated Successfully", "", { duration: 2000 });
                        item.category_name = this.categoryName
                        item.action = 'Read'
                        this.categoryName = ""
                    },error => {
                        alert("error!!!");
                    }
                )
            }
        } else {
            alert("please enter category name")
        }


    }

    getCategoryList() {
        let ids = { ids:'' }
        try {
            this.collectionService.getCategoryList(ids).subscribe(
                data => {
                    // this.category = data;
                    this.process(data)
                }
            );
        } catch (e) {
            alert("error!!!")
            this.handleExcception(e);
        }
    }

    cancel(item,i) {
        if (!confirm('Do you want to cancel the changes?')) {
            return;
        }
        if (item.category_id != -1)
            item.action = 'Read'
        else
            this.categoryList.splice(i,1)
    }
    process(json) {
        if (json != null && json != '' && json.length > 0) {
            for (let i = 0; i < json.length; i++) {
                let cat = {
                    category_id : json[i].category_id,
                    category_name : json[i].category_name,
                    is_delete : json[i].is_delete,
                    action : 'Read'
                }
                this.categoryList.push(cat)
            }
        }
    }
    newRow() {
        let cat = {
            category_id : -1,
            category_name : '',
            is_delete : 0,
            action : 'Edit'
        }
        this.categoryList.splice(0,0,cat);
    }
}
