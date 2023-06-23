import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/model/transaction';
import { OrderService } from 'src/app/service/order.service';
import { Utils } from 'src/app/utils/Utils';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css', '../../../app.component.css']
})
export class TransactionComponent  extends BaseComponent implements OnInit {

  public purchase : Transaction[] = [] ;
  public sale = [] ;
  constructor( public orderService: OrderService) {
    super()
   }

  ngOnInit() {
    this.getMyPurchase();
    this.getMySale()
  }

  getMyPurchase() {
    let obj = { from_date: '',to_date: '', page_num: 1, page_size: 20}
    try {

      this.orderService.myPurchase(obj).subscribe(
        data => {
          this.generatePurchaseData(data.data)
        }
      );
    } catch (e) {
      this.handleExcception(e);
    }
  }

  getMySale() {
    let obj = { collection_id: '', from_date: '', to_date: '', q:'',oder:'', page_num: 1, page_size: 20}
    try {
      this.orderService.mySale(obj).subscribe(
        data => {
          if (data != null)
            this.generateSalesData(data.data)
        }
      );
    } catch (e) {
      this.handleExcception(e);
    }
  }


  generatePurchaseData(orders) {
    orders.forEach(order => {
      let items = order.items ;
      items.forEach(item => {
        let transItem : Transaction = new Transaction() ;
        transItem.payed = 0
        transItem.cashback = 0
        transItem.itemID = item.item_id;
        transItem.itemURL = item.item.url ;
        transItem.orderID = order.order_id;
        transItem.orderDate = Utils.convertDBDateShortyyyymmdd(order.created_on,'-');
        transItem.price = item.total_price ;
        if (order.payments[0].payment_type == "HARD") {
          transItem.payed = order.payments[0].amount ;
        } else {
          transItem.cashback = order.payments[0].amount ;
        }
        transItem.payed = transItem.price - transItem.cashback
        this.purchase.push(transItem)
      });
    });
  }

  generateSalesData(sales) {
    sales.forEach(sale => {
      let i = {saleDate:null,saleId:null,url:null,purchasePrice:null,salePrice:null,profit: null }
      i.saleDate = Utils.convertDBDateShortyyyymmdd(sale.sale_date,'-');
      i.saleId =  sale.sale_id
      i.url = sale.item_detail.url
      i.purchasePrice = sale.purchase_price
      i.salePrice = sale.sale_price
      i.profit = sale.profit
      this.sale.push(i)
    });
  }
}
