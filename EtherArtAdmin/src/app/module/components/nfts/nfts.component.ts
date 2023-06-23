import { Component, OnInit } from '@angular/core';
import {BaseComponent} from '../base.component';
import { CollectionService } from 'src/app/service/collection.service';
import { Router } from '@angular/router';
import {Message} from "../../../utils/message";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {PreviewComponent} from "../preview/preview.component";
import {SharedDataServiceService} from "../../../service/shared-data-service.service";
import { Location } from '@angular/common'
@Component({
  selector: 'app-nfts',
  templateUrl: './nfts.component.html',
  styleUrls: ['./nfts.component.css']
})
export class NftsComponent extends BaseComponent implements OnInit {

  public list: Array<any> = [];
  public param;
  public loading = false;

  constructor(
      public dialog: MatDialog,
      private collectionService:CollectionService,
      public sharedDataService:SharedDataServiceService,
      private location:Location,
      private router: Router
    ) {
    super();
    this.param = this.router.getCurrentNavigation().extras.state;
  }

  ngOnInit() {
    this.getItemByVariant()

  }

  getItemByVariant() {
    try {
      this.loading = true;
      let obj = {ids: this.param.item} ;
      this.collectionService.getItemsByVariant(obj).subscribe(
        data => {
          this.list = data ;
          this.loading = false;
        },error =>  {
          this.loading = false;
          alert(error)
        }
      );
    } catch (e) {
      this.loading = false;
      this.handleExcception(e);
    }
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

  goBack() {
    this.location.back();
  }

}
