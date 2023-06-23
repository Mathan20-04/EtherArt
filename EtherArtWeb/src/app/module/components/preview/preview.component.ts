import { Component, HostListener,OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {ItemmsgService} from "../../../service/itemmsg.service";
import {CollectionService} from "../../../service/collection.service";
import {BaseComponent} from "../base.component";

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent extends BaseComponent implements OnInit {
  public item;
  public msg;
  public url;
  constructor(
    public dialogRef: MatDialogRef<PreviewComponent>,
    public itemMsgService:ItemmsgService,
    public collectionService:CollectionService,
  ) {
    super();
    dialogRef.disableClose = true;
    this.itemMsgService.currentMessage.subscribe(
      message => (this.msg=message));
    if(this.msg.sender == "preview") {
      this.item = this.msg.data;
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
}
