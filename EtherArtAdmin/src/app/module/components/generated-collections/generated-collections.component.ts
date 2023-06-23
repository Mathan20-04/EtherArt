import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../base.component";
import {CollectionService} from "../../../service/collection.service";
import {Router} from "@angular/router";
import {SharedDataServiceService} from "../../../service/shared-data-service.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {Message} from "../../../utils/message";
import {PreviewComponent} from "../preview/preview.component";

@Component({
  selector: 'app-generated-collections',
  templateUrl: './generated-collections.component.html',
  styleUrls: ['./generated-collections.component.css']
})
export class GeneratedCollectionsComponent extends BaseComponent implements OnInit {

  public genCollectionList;
  public collectionItem;
  public collectionImageId;
  public loading = false;
  constructor(
      public dialog: MatDialog,
      public collectionService:CollectionService,
      public router:Router,
      public sharedDataService:SharedDataServiceService
  ) {
    super();
    let state = this.router.getCurrentNavigation().extras.state;
    if(state != null) {
      this.collectionItem = state.item;
      this.collectionImageId = this.collectionItem.image_id;
    } else {
      this.router.navigate(["/"])
    }
  }

  ngOnInit(): void {
    this.getGeneratedCollectionList()
  }
  getGeneratedCollectionList() {
    try {
      let obj = { id:this.collectionImageId}
      this.loading = true;
      this.collectionService.getCollectListForImage(obj).subscribe(
          data => {
            this.genCollectionList =  data['collection'];
            this.loading = false;
          },error => {
            this.loading = false;
            alert("error!!!");
          }
      )
    } catch (e) {
      this.loading = false;
      alert("error!!!")
      this.handleExcception(e);
    }

  }
  traits(item) {
    this.router.navigate(['/traits/'],{ state:item });
  }

  preview(item) {
    let message = new Message(item, "preview");
    this.sharedDataService.changeMessage(message);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "100vh";
    dialogConfig.width = "100vw";
    this.dialog.open(PreviewComponent, dialogConfig);
  }

}
