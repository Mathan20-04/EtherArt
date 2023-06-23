import { Component, OnInit } from '@angular/core';
import { Bid } from 'src/app/model/bid';
import { OrderService } from 'src/app/service/order.service';
import { Utils } from 'src/app/utils/Utils';
import { BaseComponent } from '../base.component';
import {Message} from "../../../utils/message";
import {CollectionService} from "../../../service/collection.service";
import {ItemStatus, ItemStatusText} from "../../../utils/Constants";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TraitsComponent} from "../traits/traits.component";
import {ItemmsgService} from "../../../service/itemmsg.service";

@Component({
  selector: 'app-mybid',
  templateUrl: './mybid.component.html',
  styleUrls: ['./mybid.component.css']
})
export class MybidComponent extends BaseComponent implements OnInit {

  public bids : Bid[] = [] ;
  public data : any ;
  public items : any = [] ;
  public iconsrc:any ;
  public itemBids: Array<any> = [];
  public bidlow = 0;
  public bidhigh = 0;
  public newPrice = 0;
  public numBids = 0;
  public status = ItemStatus.Owned
  public statusText = ItemStatusText.OnBid
  public onSale :boolean = false;
  public ids = "";
  constructor(
    public orderService: OrderService,
    public collectionService : CollectionService,
    public dialog: MatDialog,
    public itemMsgService : ItemmsgService
    ) {
    super()
   }

  ngOnInit() {
    this.getMyBid();
  }

  getBidRange() {

    this.data.forEach((item) => {
      if (item.item.status == 'ONBID' || item.item.status == 'PAUSED')
        item.item['statusurl'] = "assets/bid.svg";
      else
        item.item['statusurl'] = "assets/sale.svg";
      let bids = item.item.bids
      let bidlow = 9999999999;
      let bidhigh = 0
      bids.forEach(bid => {
        bidlow = bid.bid_price < bidlow ? bid.bid_price : bidlow
        bidhigh = bid.bid_price > bidhigh ? bid.bid_price : bidhigh

      });
      item.item['bid-range'] = bidlow + "-" + bidhigh

    })
  }

  showItem() {
    this.data.forEach((item) => {
      if (item.item.status == 'ONBID' || item.item.status == 'PAUSED')
        item.item['statusurl'] = "assets/bid.svg";
      else
        item.item['statusurl'] = "assets/sale.svg";
    })
  }
  getMyBid() {
    let obj = { from_date: '',to_date: '', q:'', page_num: 1, page_size: 100}
    try {
      this.orderService.myBid(obj).subscribe(
        data => {

          if (data != null && data.data != null) {
            this.data = data.data
            this.showItem()
            this.getIds()
            this.getBids()

          }
        }
      );
    } catch (e) {
      this.handleExcception(e);
    }
  }

  getIds() {
    this.ids = ""
    this.data.forEach(element => {
      this.ids = this.ids == "" ?  element.item.detail_id :  this.ids + "," + element.item.detail_id
    });
  }


  getBids() {
    let obj = {"ids" : this.ids}
    try {
      this.collectionService.getItemBids(obj).subscribe(
        data => {
          this.itemBids = data
          this.embedBids()
          this.getBidRange()

        }
      );
    } catch (e) {
      this.handleExcception(e);
    }
  }

  embedBids() {
    if (this.bids != null) {
      this.itemBids.forEach(element => {
        let items = this.data.filter((item)=>
          item.item.detail_id == element.item_id)
        if (items.length > 0)  {
          if (items[0].item.bids == undefined || items[0].item.bids == null) {
            items[0].item.bids = []
          }
          items[0].item.bids.push(element)
        }
      });
    }
  }

  showDateYYYY(dt,char) {
    return Utils.convertDBDateShortyyyymmdd(dt,char)
  }

}

