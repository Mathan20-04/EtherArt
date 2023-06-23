import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {CollectionService} from "../../../service/collection.service";
import {BaseComponent} from "../base.component";
import {Message} from "../../../utils/message";
import {SharedDataServiceService} from "../../../service/shared-data-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrls: ['./part.component.css']
})
export class PartComponent extends BaseComponent implements OnInit {
    public item:any;
    public imageId: number ;
    public add:any = true;
    public delete:any = true;
    public update:any = true;
    public imgInput = false;
    public title;
    public file ;
    public imageUrl;
    public collectionItem:any;
    public categoryList: Array<any> = [];
    public selectedCategoryId;
    public metadataList: Array<any> = []
    public value: Array<string> = []
    public metadata ;
    public enableSearch = false;
    public searchShow;
    public heading = "Part";
    public loading = false;

    constructor(public router : Router,
                public collectionService: CollectionService,
                public sharedDataService: SharedDataServiceService,
                public snackBar: MatSnackBar) {
        super();
        let state = this.router.getCurrentNavigation().extras.state;
        if (state != null) {
            if (state.action == 'New') {
                this.add = false;
                this.imageId = state.imageId;
                this.collectionItem = state.collectionItem;
                this.heading = "Add New Part"
            } else {
                this.item = state.item;
                this.title = this.item.title;
                this.delete = false;
                this.update = false;
                this.imgInput = true;
                this.collectionItem = state.collectionItem;
                this.metadata = this.item.metadata;
                this.selectedCategoryId = this.item.category_id
                this.enableSearch = this.item.search_show == 1 ? true : false
            }
        }
        this.getCategoryList();
        this.getMetadataList();

    }

    ngOnInit(): void {
        if (this.item != null)
            this.imageUrl = this.item.url+"&s=700";

    }


    upload(event) {
        this.file = event.target.files[0] ;
        var reader = new FileReader();
        reader.readAsDataURL(this.file)
        reader.onload = (_event) => {
            this.imageUrl = reader.result;
        }
    }

    change(catId) {
        this.selectedCategoryId = catId;
    }

    addPart() {
        if(this.imageId != undefined && this.title != undefined && this.title !=''  && this.file != undefined) {
            this.loading = true;
            this.add = true
            try {
                if( this.enableSearch ==  true ) {
                    this.searchShow = "1"
                } else {
                    this.searchShow = "0"
                }
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
                    "image_id":this.imageId,
                    "title": this.title,
                    "metadata": JSON.stringify(metadata),
                    "category_id" : this.selectedCategoryId,
                    "search_show" : this.searchShow
                };
                this.collectionService.addPart(obj,this.file).subscribe(
                    data => {
                        this.loading = false;
                        this.add = false;
                        this.snackBar.open("Part Added Successfully", "", { duration: 2000 });
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

    deletePart() {
        if(this.item.numvariants == 0) {
            if(confirm("Are you sure to delete the part")) {
                this.loading = true;
                this.delete  = true;
                let postObj = {
                    part_id :this.item.part_id
                }
                let obj = {};
                obj['part_json'] =JSON.stringify(postObj);
                this.collectionService.deletePart(obj).subscribe(
                    data=> {
                        this.loading = false;
                        this.delete = false;
                        this.snackBar.open("Part Deleted Successfully", "", { duration: 2000 });
                        this.router.navigate(['/collection/']);
                    },error =>  {
                        this.loading = false;
                        this.delete = false;
                        alert("Error While Deleting");
                    }
                )
            }
        } else {
            alert("First Delete All the Variations of the Part");
            this.router.navigate(['/collection/']);
        }

    }

    updatePart() {
        alert("Update Part is not yet implemented")
    }

    getCategoryList() {
        let ids = { ids:'' }
        try {
            this.collectionService.getCategoryList(ids).subscribe(
                data => {
                    this.categoryList = data;
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

    showInSearch() {
        this.enableSearch =! this.enableSearch
    }
}
