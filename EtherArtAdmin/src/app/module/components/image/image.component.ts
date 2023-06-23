import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {BaseComponent} from "../base.component";
import {CollectionService} from "../../../service/collection.service";
import {Message} from "../../../utils/message";
import {JSONFile} from "@angular/cli/utilities/json-file";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
    selector: 'app-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.css']
})
export class ImageComponent  extends BaseComponent implements OnInit {
    public item:any;
    public add = true;
    public delete = true;
    public update = true;
    public imgInput = false;
    public title;
    public description;
    public length;
    public width;
    public price;
    public file ;
    public imageUrl;
    public color;
    public fabric;
    public content;
    public metadataList: Array<any> = []
    public value: Array<string> = []
    public metadata;
    public rarityType;
    public reserved = false;
    public heading = "Collection";
    public loading = false;
    constructor(public router : Router,
                public collectionService: CollectionService,
                public snackBar: MatSnackBar) {
        super()
        let state = this.router.getCurrentNavigation().extras.state;
        if (state != null) {
            if (state.action == 'New') {
                this.add = false;
                this.heading = "Add New Collection"
            } else {
                this.item = state.item;
                this.delete = false;
                this.update = false;
                this.imgInput = true;
                this.title = this.item.title
                this.description = this.item.description
                this.length = this.item.length
                this.width = this.item.width
                this.price = this.item.price
                this.metadata = this.item.metadata
                this.reserved = this.item.rarity_type == "PRIVATE" ? true : false
            }
        }
        this.getMetadataList();
    }

    ngOnInit(): void {
        if (this.item != null && this.item != undefined)
            this.imageUrl = this.item.url+"&s=700";
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

    upload(event) {
        this.file = event.target.files[0] ;
        var reader = new FileReader();
        reader.readAsDataURL(this.file)
        reader.onload = (_event) => {
            this.imageUrl = reader.result;
        }
    }

    selectPublic() {
        this.reserved = false;
    }

    selectReserved() {
        this.reserved = true;
    }

    addImage() {
        if(this.title != null && this.title != ''  && this.description != null && this.description != '' && this.price != null && this.file != null) {
            this.loading = true;
            this.add = true
            try {
                if( this.reserved == false ) {
                    this.rarityType = "PUBLIC"
                } else {
                    this.rarityType = "PRIVATE"
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
                    "title": this.title,
                    "description": this.description,
                    "length": this.length,
                    "width": this.width,
                    "price": this.price,
                    "rarity_type":this.rarityType,
                    "metadata": JSON.stringify(metadata)
                };
                this.collectionService.addImage(obj, this.file).subscribe(
                    data => {
                        this.loading = false;
                        this.add = false;
                        this.snackBar.open("Collection Added Successfully", "", { duration: 2000 });
                        this.router.navigate(['/collection/']);
                    },
                    error => {
                        this.loading = false;
                        this.add = false;
                        alert("error!!!" + error.toString())
                    }
                );
            } catch (e) {
                alert("error!!!")
                this.loading = false;
                this.add = false;
                this.handleExcception(e);
            }

        } else {
            alert("please fill all the input fields are mandatory")
        }

    }

    deleteImage() {
        if(this.item.numparts == 0) {
            if(confirm("Are you sure to delete the Collection ")) {
                this.delete = true;
                this.loading = true;
                let postObj = {
                    image_id:this.item.image_id
                }
                let obj = {};
                obj['image_json'] = JSON.stringify(postObj)
                this.collectionService.deleteImage(obj).subscribe(
                    data => {
                        this.loading = false;
                        this.delete = false
                        this.snackBar.open("Collection Deleted Successfully", "", { duration: 2000 });
                        this.router.navigate(['/collection/']);
                    },error => {
                        this.loading = false;
                        this.delete = false
                        alert("Error while deleting");
                    }
                )
            }
        } else {
            alert("First Delete all the parts of collection");
            this.router.navigate(['/collection/']);
        }

    }

    updateImage() {
        alert("Update collection is not yet implemented")
    }

}
