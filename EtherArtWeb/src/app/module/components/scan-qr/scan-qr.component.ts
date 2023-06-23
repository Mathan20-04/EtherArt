import {Component, HostListener, OnInit} from '@angular/core';
import {BaseComponent} from "../base.component";
import {ItemmsgService} from "../../../service/itemmsg.service";
import {CollectionService} from "../../../service/collection.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.component.html',
  styleUrls: ['./scan-qr.component.css']
})
export class ScanQrComponent extends BaseComponent implements OnInit {
  public obj :any;
  public qrCode :any;
  public totalAmount :any;
  public msg;
  constructor(
    public itemMsgService:ItemmsgService,
    public dialogRef: MatDialogRef<ScanQrComponent>
  ) {
    super();
    this.itemMsgService.currentMessage.subscribe(
      message => (this.msg = message));
    if(this.msg.sender == 'cart')
      this.obj = this.msg.data;
  }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  openGPay() {
    if (!this.isMob)
      return
    var now = new Date().valueOf();
    setTimeout(function () {
        if (new Date().valueOf() - now > 100) return;
        window.location.href = "";
    }, 25);
    window.location.href = "gpay://pay?pa=mathan2004bca@oksbi&am=100&pn=EtherArt&cu=INR";
  }

}
