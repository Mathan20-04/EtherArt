import {Component, Inject, Input, OnInit} from '@angular/core';
import { OrderService } from 'src/app/service/order.service';
import { BaseComponent } from '../base.component';
import { Utils } from '../../../utils/Utils';
import { ItemStatus, ItemStatusText } from '../../../utils/Constants';
import {Message} from "../../../utils/message";
import {CollectionService} from "../../../service/collection.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {AddCommentComponent} from "../add-comment/add-comment.component";
import {ItemmsgService} from "../../../service/itemmsg.service";
import {ListforsaleComponent} from "../listforsale/listforsale.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-owned-item',
  templateUrl: './owned-item.component.html',
  styleUrls: ['./owned-item.component.css']
})

export class OwnedItemComponent extends BaseComponent implements OnInit {

  @Input() item : any;
  public hashCode = ""
  public status = ItemStatus.Owned
  public statusText = ItemStatusText.OnBid
  public onSale :boolean = false;
  public askMode : boolean = false ;
  public askPrice ;
  public askDate =""
  public bidlow = 0;
  public bidhigh = 0;
  public newPrice = 0;
  public numBids = 0;
  public hideAsk = false ;
  public iconsrc = "assets/bid.svg"
  public bids = []
  public msg:any;
  constructor(private orderService : OrderService,
              private collectionService:CollectionService,
              public itemMsgService : ItemmsgService,
              public dialog: MatDialog,
              public router:Router) {
    super();
  }

  ngOnInit(): void {
    console.log("Owned items:", this.item)
    console.log("Owned items:", this.item.sale)
    this.hashCode = String(this.item.txn_hash).substring(5,18).toString()+ "..."

    if (this.item.sale != null) {
      if (this.item.status == 'PAUSED') {
        this.onSale = false ;
        this.status = ItemStatus.Owned;
        this.statusText = ItemStatusText.OnBid;
        this.iconsrc = "assets/bid.svg";
      } else {
        this.askPrice = this.item.sale[0].price ;
        this.askDate = Utils.convertDBDateShortyyyymmdd(this.item.sale[0].created_on,'-') ;
        this.onSale = true ;
        this.status = ItemStatus.OwnerSale;
        this.statusText = ItemStatusText.OwnerSale;
        this.iconsrc = "assets/sale.svg";
      }
    } else {
      console.log("Owned Item", this.item.sale)
    }
  }

  getBidRange() {
    if (this.item.bids != null && !this.onSale){
      this.numBids = this.item.bids.length
      let bids = this.item.bids
      this.bidlow = this.bidhigh = bids[0].bid_price
      let sameprice = true
      bids.forEach(bid => {
        bid.showAccept = 0
        if (bid.bid_price < this.bidlow) {
          this.bidlow = bid.bid_price
        }
        if (bid.bid_price > this.bidhigh) {
          this.bidhigh = bid.bid_price
          bid.showAccept = 1
          sameprice = false
        }
      });
      if (sameprice && bids.length > 0) {
        bids[0].showAccept = 1
      }
    }
  }

  hideAccept() {
    this.item.bids.forEach(bid => {
      bid.showAccept = 0
    });
  }

  cancel() {
    this.askMode = false
    this.hideAsk = false
  }
  ask() {
    this.askMode = true
    this.hideAsk = true
  }

  pause() {
    try {
      let obj = {item_id: this.item.detail_id , action : "PAUSE"} ;
      obj['action_json'] = JSON.stringify(obj) ;
      this.orderService.pause(obj).subscribe(
        data => {
            alert("Successfully placed the item on pause!!!")
            this.status = ItemStatus.Owned
            this.statusText = ItemStatusText.OnBid
            this.onSale = false ;
            this.iconsrc = "assets/bid.svg"
            this.getBidRange() ;
        }
      );
    } catch (e) {
      alert("error!!!")
      this.handleExcception(e);
    }
  }

  openListForSale() {
    let message = new Message(this.item, "listForSale");
    this.itemMsgService.changeMessage(message);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-add-comment";
    if(!this.isMob) {
      dialogConfig.width = "50vw";
      dialogConfig.height = "90vh";
    }
    if(this.isMob)
      dialogConfig.height = "80vh";
    dialogConfig.data = this.item;
    const dialogRef = this.dialog.open(ListforsaleComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result != undefined && result != null) {
        this.onSale = true ;
      this.askPrice = result.price;
      this.askDate = Utils.convertDate(new Date())
      this.status = ItemStatus.OwnerSale
      this.statusText = ItemStatusText.OwnerSale
      this.iconsrc = "assets/sale.svg"
      this.askMode = false;
      }
    });
  }

  Accept(price){
    this.newPrice = price
    this.openListForSale()
  }

  showDate(dt,char) {
    return Utils.convertDBDateShort(dt,char)
  }

  showDateYYYY(dt,char) {
    return Utils.convertDBDateShortyyyymmdd(dt,char)
  }

  showDetail() {
    let obj = {item: this.item , bidHigh: this.bidhigh}
    this.router.navigate(['detail'], { state: obj });
  }

}
