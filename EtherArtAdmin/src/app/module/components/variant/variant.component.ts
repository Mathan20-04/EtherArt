import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../base.component";
import {Router} from "@angular/router";
import {CollectionService} from "../../../service/collection.service";
import {SharedDataServiceService} from "../../../service/shared-data-service.service";
import {Message} from "../../../utils/message";
import {stat} from "fs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-variant',
  templateUrl: './variant.component.html',
  styleUrls: ['./variant.component.css']
})
export class VariantComponent extends BaseComponent implements OnInit {
    public item:any;
    public partId: number ;
    public add:any = true;
    public delete:any = true;
    public update:any = true;
    public imgInput = false;
    public title;
    public file ;
    public repFile ;
    public partItem:any;
    public collectionItem:any;
    public imageUrl;
    public repImageUrl;
    public categoryList: Array<any> = [];
    public selectedCategoryId;
    public subCategoryList: Array<any> = [];
    public selectedSubCategoryId;
    public metadataList: Array<any> = []
    public value: Array<string> = []
    public metadata ;
    public heading = "variation";
    public loading = false;

    constructor(public collectionService: CollectionService,
                public router : Router,
                private sharedDataService : SharedDataServiceService,
                public snackBar: MatSnackBar) {
        super();
        let state = this.router.getCurrentNavigation().extras.state;
        if (state != null) {
            if (state.action == 'New') {
                this.add = false;
                this.partId = state.partId;
                this.partItem = state.partItem;
                this.collectionItem = state.collectionItem;
                this.item = state.item;
                this.selectedCategoryId = this.partItem.category_id;
                this.heading = "Add New Variation";
                } else {
                this.item = state.item
                this.delete = false;
                this.update = false;
                this.imgInput = true;
                this.partItem = state.partItem;
                this.collectionItem = state.collectionItem;
                this.title = this.item.title;
                this.metadata = this.item.metadata;
                this.selectedCategoryId = this.partItem.category_id;
                this.selectedSubCategoryId = this.item.sub_category_id;
            }
        }
        this.getMetadataList();
        this.getCategoryList();
        this.getSubCategoryById();
    }

    ngOnInit(): void {
        if (this.item != null) {
            this.imageUrl = this.item.url+"&s=700";
            this.repImageUrl = this.item.rep_url+"&s=700"
        }
    }

    upload(event) {
        this.file = event.target.files[0] ;
        var reader = new FileReader();
        reader.readAsDataURL(this.file)
        reader.onload = (_event) => {
            this.imageUrl = reader.result;
        }
    }
    uploadRep(event) {
        this.repFile = event.target.files[0] ;
        var reader = new FileReader();
        reader.readAsDataURL(this.repFile)
        reader.onload = (_event) => {
            this.repImageUrl = reader.result;
        }
    }

    change(subCatId){
        this.selectedSubCategoryId = subCatId;
    }

    addVariation() {
        if(this.partId != undefined && this.title != undefined && this.title !='' && this.file != undefined && this.repFile != undefined) {
            this.loading = true;
            this.add = true;
            try {
                let metadata =  []
                let i = 0;
                this.value.forEach((val)=>{
                    if (val != "") {
                        let metaObj =  {
                            key:"",
                            value:"",
                        }
                        metaObj.key = this.metadataList[i].meta_key
                        metaObj.value = val
                        metadata.push(metaObj)
                    }
                    i++
                })
                let obj = {
                    "part_id": this.partId,
                    "title": this.title,
                    "metadata": JSON.stringify(metadata),
                    "sub_category_id": this.selectedSubCategoryId
                };
                console.log(obj)
                console.log(this.repFile)
                console.log(this.file)

                this.collectionService.addVariation(obj,this.file,this.repFile).subscribe(
                    data => {
                        this.loading = false;
                        this.add = false;
                        this.snackBar.open("Variation Added Successfully", "", { duration: 2000 });
                        this.router.navigate(['collection']);
                    },
                    error => {
                        this.loading = false;
                        this.add = false;
                        alert("error!!!" + error.toString())
                    }
                );
            } catch (e) {
                this.loading = false;
                this.add = false;
                alert("error!!!")
                this.handleExcception(e);
            }
        } else {
            alert("please fill all the input fields are mandatory");
        }
    }

    deleteVariation() {
        if(confirm("Are you sure to delete the Variation")) {
            this.loading = true;
            let postObj = {
                variation_id: this.item.variation_id
            }
            let obj = {};
            obj['variation_json'] = JSON.stringify(postObj);
            this.collectionService.deleteVariation(obj).subscribe(
                data=> {
                    this.loading = false;
                    this.snackBar.open("Variation Deleted Successfully", "", { duration: 2000 });
                    this.router.navigate(['collection']);
                },error => {
                    alert("Error While Deleting");
                }
            )
        }

    }

    updateVariation() {
        alert("Update variation is not yet implemented")
    }
    getCategoryList() {
        let ids = { ids:'' }
        try {
            this.collectionService.getCategoryList(ids).subscribe(
                data => {
                    this.categoryList = data
                }
            );
        } catch (e) {
            alert("error!!!")
            this.handleExcception(e);
        }
    }


    getSubCategoryById() {
        let obj ={
            category_id :  this.selectedCategoryId
        }
        try {
            this.collectionService.getSubCategoryByCategory(obj).subscribe(
                data => {
                    this.subCategoryList = data;
                }
            );
        } catch (e) {
            alert("error!!!")
            this.handleExcception(e);
        }
    }

    getMetadataList() {
        let ids = { ids:'' }
        try {
            this.collectionService.getMetadataList(ids).subscribe(
                data => {
                    this.metadataList = data
                    this.value.fill("",0,this.metadataList.length-1)
                    this.fillMetaValue()
                }
            );
        } catch (e) {
            alert("error!!!")
            this.handleExcception(e);
        }
    }

    fillMetaValue() {
        if (this.metadataList.length > 0) {
            if(this.metadata != undefined) {
                let json = JSON.parse(this.metadata)
                json.forEach((obj) => {
                    let i = this.metadataList.findIndex((item) => {
                        return item.meta_key == obj.key
                    })
                    if (i >= 0) {
                        this.value[i] = obj.value
                    }
                })
            }
        }

    }

}
