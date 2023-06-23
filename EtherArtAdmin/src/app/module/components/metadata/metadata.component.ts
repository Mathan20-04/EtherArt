import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CollectionService} from "../../../service/collection.service";
import {BaseComponent} from "../base.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.css']
})
export class MetadataComponent extends BaseComponent implements OnInit {

    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    public metadataList: Array<any> = []
    public meta_key;
    constructor(
        public collectionService:CollectionService,
        public snackBar: MatSnackBar
    ) {
        super();
    }

    ngOnInit(): void {
        this.getMetadataList();
    }

    actionClicked(item) {
        if(item.action=='Read') {
            item.action = 'Edit';
            this.meta_key = item.meta_key;
        } else {
            item.action = 'Read'
        }
    }

    delete(item,idx:number) {
        try {
            if(confirm("Are sure to delete"+" "+'"'+item.meta_key+'"'+" "+"metadata")) {
                let postObj = {
                    meta_key_id: item.meta_key_id
                }
                let obj = {}
                obj['metadata_header_json'] = JSON.stringify(postObj)
                this.collectionService.deleteMetadata(obj).subscribe(
                    data=> {
                        this.snackBar.open("Metadata"+" "+'"'+item.meta_key+'"'+" "+" Deleted Successfully", "", { duration: 2000 });
                        this.metadataList.splice(idx,1);
                    } ,error => {
                        alert(error)
                    }
                )
            }
        }  catch (e) {
            alert("error!!!")
            this.handleExcception(e);
        }

    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }
    }

    addNewMetadataKey(item) {
        try {
            let postObj = { meta_key:this.meta_key };
            let obj = {};
            obj['metadata_header_json'] = JSON.stringify(postObj);
            this.collectionService.addMetadataKey(obj).subscribe(
                data => {
                    this.snackBar.open("Metadata"+" "+'"'+this.meta_key+'"'+" "+" Added Successfully", "", { duration: 2000 });
                    item.meta_key = this.meta_key
                    item.meta_key_id = data.meta_key_id
                    this.meta_key = ''
                    item.action = 'Read'
                }
            );
        }   catch (e) {
            alert("error!!!")
            this.handleExcception(e);
        }

    }

    save(item) {
        if (item.meta_key_id == null) {
            this.addNewMetadataKey(item)
        } else {
            let postObj = {
                meta_key_id:item.meta_key_id,
                meta_key: this.meta_key
            }
            let obj = {};
            obj['metadata_header_json'] = JSON.stringify(postObj);
            this.collectionService.updateMetadataKey(obj).subscribe(
                data => {
                    this.snackBar.open("Metadata Updated Successfully", "", { duration: 2000 });
                    item.meta_key = this.meta_key
                    item.action = 'Read'
                    this.meta_key = ''
                },error => {
                    alert("error!!!")
                }
            )
        }

    }

    getMetadataList() {
        let ids = { ids:'' }
        try {
            this.collectionService.getMetadataList(ids).subscribe(
                data => {
                    this.process(data)
                }
            );
        } catch (e) {
            alert("error!!!")
            this.handleExcception(e);
        }
    }

    cancel(item,i) {
        if (item.metadata_id != -1)
            item.action = 'Read'
        else {
            this.metadataList.splice(i,1)
        }
    }
    process(json) {
        if (json != null && json != '' && json.length > 0) {
            for (let i = 0; i < json.length; i++) {
                let met = {
                    meta_key_id : json[i].meta_key_id,
                    meta_key : json[i].meta_key,
                    is_delete : json[i].is_delete,
                    action : 'Read'
                }
                this.metadataList.push(met)
            }
        }
    }
    newRow() {
        let met = {
            metadata_id : -1,
            meta_key : '',
            is_delete : 0,
            action : 'Edit'
        }
        this.metadataList.splice(0,0,met);
        this.meta_key = ''
    }
}
