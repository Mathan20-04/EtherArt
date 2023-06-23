import {Component, HostListener, OnInit,Inject} from '@angular/core';
import {BaseComponent} from "../base.component";
import {MatDialogRef} from "@angular/material/dialog";
import {ItemmsgService} from "../../../service/itemmsg.service";
import {ItemStatus, ItemStatusText} from "../../../utils/Constants";
import {Utils} from "../../../utils/Utils";
import {OrderService} from "../../../service/order.service";
import {Message} from "../../../utils/message";
import {MatDialogModule,MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-listforsale',
  templateUrl: './listforsale.component.html',
  styleUrls: ['./listforsale.component.css']
})

export class ListforsaleComponent extends BaseComponent implements OnInit {

  public newPrice;
  public purchasedPrice;
  public earning;
  public commission ;
  constructor(public dialogRef: MatDialogRef<ListforsaleComponent>,
              @Inject(MAT_DIALOG_DATA) public item: any,
              private orderService : OrderService,) {
    super();

  }

  ngOnInit(): void {
    this.purchasedPrice = this.item.purchased_price;
    this.newPrice = this.item.purchased_price;
    console.log(this.newPrice)
  }

  close(): void {
    this.dialogRef.close();
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  putOnSale() {
    if(this.newPrice!='' && this.newPrice!=undefined && this.newPrice!=null){
      if (this.newPrice <= this.item.purchased_price) {
        if (!confirm("Are you sure you want to sell this item @ Rs." + this.newPrice + " which is below or equal to your purchase price of Rs." + this.item.purchased_price + " ?")) {
          return
        }
      } else {
        if (!confirm("Are you sure you want to Sell this item @ Rs." + this.newPrice + "?")) {
          return
        }
      }
      try {
        let obj = {item_id: this.item.detail_id , price : this.newPrice} ;
        obj['sale_json'] = JSON.stringify(obj) ;
        this.orderService.sale(obj).subscribe(
          data => {
            alert("Successfully placed the item on sale!")
            this.dialogRef.close(data);
          }
        );
      } catch (e) {
        alert("error!!!")
        this.handleExcception(e);
      }
    } else {
      alert("please enter amount for sale")
    }
  }
}
