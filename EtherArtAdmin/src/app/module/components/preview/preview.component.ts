import { Component, HostListener,OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {CollectionService} from "../../../service/collection.service";
import {BaseComponent} from "../base.component";
import {SharedDataServiceService} from "../../../service/shared-data-service.service";
import { GeneralService } from 'src/app/service/general.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent extends BaseComponent implements OnInit {
  public item;
  public msg;
  public objectURL ;
  public loading = false;
  constructor(
      public dialogRef: MatDialogRef<PreviewComponent>,
      public sharedDataService: SharedDataServiceService,
      private generalService: GeneralService,
      public collectionService:CollectionService,
      private sanitizer: DomSanitizer
  ) {
    super();
    dialogRef.disableClose = true;
    this.sharedDataService.currentMessage.subscribe(
        message => (this.msg=message));
    if(this.msg.sender == "preview") {
      this.item = this.msg.data;
      this.downloadImage()
    }
      
  }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  downloadImage() {
    this.loading = true;
    try {
      this.generalService.getImageFromURL(this.item.url).subscribe(
        data => {
          this.objectURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
          this.loading = false;
          console.log(this.objectURL)
        }, error => {
          this.loading = false;
          }
      );
    } catch (e) {
      this.handleExcception(e);
    }
  }
}
