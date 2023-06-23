import { Component, Input, OnInit } from '@angular/core';
import {BaseComponent} from '../base.component';
import { CollectionService } from 'src/app/service/collection.service';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-collectables',
  templateUrl: './collectables.component.html',
  styleUrls: ['./collectables.component.css']
})
export class CollectablesComponent extends BaseComponent implements OnInit {

  public assetList: Array<any> = [];
  public show = false ;
  public showEmpty = false ;
  ids: string;
  bids: any;
  sales: any;
  constructor(
    public collectionService: CollectionService,
    public orderService: OrderService,
    ) {
    super();
  }

  ngOnInit() {
    console.log("getitems")
    this.getMyItems()
  }

  getMyItems() {
    let input = {
      collection_id:null,
      q: "",
      page_num: 1,
      page_size: 100,
    };
    try {
      this.collectionService.getMyItems(input).subscribe(
        data => {
          // paginated item contains two keys
          // data and pages
          // pages contains {total_records and total_pages}
          // data is specific to object

          if (data != null && data.data != null){
            this.assetList = data.data ;
            console.log(data)
            this.doPostFetch()
          } else {
            this.showEmpty = true
          }
        }
      );
    } catch (e) {
      alert("error!!!")
      this.handleExcception(e);
    }
    return;
  }

  doPostFetch() {
    console.log("post fetch")
    this.getIds();
    this.getBids();
  }

  getIds() {
    this.ids = "";
    if(this.assetList != null) {
      this.assetList.forEach((element) => {
        this.ids =
          this.ids == "" ? element.detail_id : this.ids + "," + element.detail_id;
      });
    }
  }

  getBids() {
    let obj = { ids: this.ids };
    try {
      this.collectionService.getItemBids(obj).subscribe((data) => {
        this.bids = data;
        console.log("Bids" , this.bids)
        this.embedBids();
        console.log("After embed bids" , this.assetList)
        this.getSales();
      });
    } catch (e) {
      this.handleExcception(e);
    }
  }
  embedBids() {
    if (this.bids != null) {
      this.bids.forEach((element) => {
        let item = this.assetList.filter(
          (item) => item.detail_id == element.item_id
        );
        if (item.length > 0) {
          if (item[0].bids == null) {
            item[0].bids = [];
          }
          item[0].bids.push(element);
        }
      });
    }
  }

  getSales() {
    let obj = { ids: this.ids };
    try {
      this.orderService.getSaleDataById(obj).subscribe((data) => {
        this.sales = data;
        console.log("sales", this.sales)
        this.embedSales();
        console.log("after sale", this.assetList)
      });
    } catch (e) {
      this.handleExcception(e);
    }
  }

  embedSales() {
    if (this.sales != null) {
      this.sales.forEach((element) => {
        let item = this.assetList.filter(
          (item) => item.detail_id == element.item_id
        );
        if (item.length > 0) {
          if (item[0].sale == null) {
            item[0].sale = [];
          }
          item[0].sale.push(element);
        }
      });
    }
    this.show = true
  }
}


