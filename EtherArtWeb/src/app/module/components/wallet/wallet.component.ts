import { Component, OnInit } from '@angular/core';
import { Wallettrans } from 'src/app/model/wallettrans';
import { WalletService } from 'src/app/service/wallet.service';
import { BaseComponent } from '../base.component';
import { Utils } from '../../../utils/Utils'
import { OrderService } from 'src/app/service/order.service';
import { Transaction } from 'src/app/model/transaction';
import { ItemmsgService } from 'src/app/service/itemmsg.service';
import { Message } from 'src/app/utils/message';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css', '../../../app.component.css']
})
export class WalletComponent extends BaseComponent implements OnInit {
  public wallet : any ;
  public trans : Wallettrans[] = [] ;
  public purchase : Transaction[] = [] ;
  public sale = [] ;
  public walletItems = [];
  public showItems = []
  public snapshot : any ;
  constructor(
    private walletService : WalletService,
    private orderService: OrderService,
    public itemMsgService : ItemmsgService
  ) {
    super()
  }

  ngOnInit() {
    this.getMyWallet()
    this.getWalletSnapshot()
    // this.getMySale()
  }

  getWalletSnapshot() {
    try {
      this.walletService.getWalletSnapshot(null).subscribe(
        data => {
          this.snapshot = data;
          let msg = new Message(0,"walletCashBalance")
          if (this.snapshot.cash_balance != null && this.snapshot.cash_balance != undefined) {
            msg.data = this.snapshot.cash_balance
          } else {
            this.snapshot.cash_balance = 0
          }
          this.itemMsgService.changeMessage(msg)
        }
      );
    } catch (e) {
      this.handleExcception(e);
    }
  }

  getMyWallet() {
    try {
      this.walletService.getMyWallet(null).subscribe(
        data => {
          this.wallet = data ;
          this.getWalletTrans()
        }
      );
    } catch (e) {
      this.handleExcception(e);
    }
  }

  getWalletTrans() {
    try {
      let input = {
        page_num: 1,
        page_size: 50
      }
      this.walletService.getWalletTrans(input).subscribe(
        data => {
          if(data != null) {
            this.getTransItem(data.data)
            this.generateTrans(data.data)
          }
        }
      );
    } catch (e) {
      this.handleExcception(e);
    }
  }

  getTransItem(data) {
    data.forEach(item => {
      let walletItem = {
        date  : "",
        name  : "",
        itemid : -1,
        image : "",
        trans : "",
        joinReward : -1,
        purchaseReward : -1,
        cashEarned : -1,
        redeemed : -1,
        show: 0,
        sbalance:0,
        hbalance:0

      }
      walletItem.date = Utils.convertDBDateShortyyyymmdd(item.transaction_date,'-')
      walletItem.trans = item.transaction_type
      switch(walletItem.trans) {
        case "TRANSPURCHASE" : // user buying
          walletItem.redeemed = item.soft_amount
          walletItem.image = item.item != null ? item.item.url + '&s=700': ""
          walletItem.itemid = item.item.detail_id
          walletItem.name = item.item.detail_id + " purchased by Me"
          walletItem.sbalance = item.closing_soft_amount
          walletItem.show = walletItem.redeemed > 0 ? 1 : 0
          break
        case "TRANSSIGNUPBONUS" : // Tribe signup
          walletItem.name = item.user != null ? item.user.first_name + " Joined": "Unknown"
          walletItem.joinReward = item.soft_amount
          walletItem.image = "assets/person_black.svg"
          walletItem.sbalance = item.closing_soft_amount
          walletItem.show = walletItem.joinReward > 0 ? 1 : 0
          break;
        case "TRANSUFT" : // Tribe purchase
          walletItem.name = item.user != null ? item.item.detail_id + " purchased by " + item.user.first_name  : "Unknown"
          walletItem.purchaseReward = item.soft_amount
          walletItem.image = item.item != null ? item.item.url + '&s=700' : ""
          walletItem.show = walletItem.purchaseReward > 0 ? 1 : 0
          walletItem.sbalance = item.closing_soft_amount
          break ;
        default :         // user selling
          walletItem.name = item.item.detail_id +  " Sold by Me"
          walletItem.itemid = item.item.detail_id
          walletItem.image = item.item.url + '&s=700'
          walletItem.cashEarned = item.hard_amount
          walletItem.show = walletItem.cashEarned > 0 ? 1 : 0
          walletItem.hbalance = item.closing_hard_amount
          break
      }
      if (walletItem.show == 1)
        this.walletItems.push(walletItem);
    });
    this.showItems = this.walletItems
  }

  filter(str) {
    this.showItems = []
    switch (str) {
      case 'Purchase' :
        this.showItems = this.walletItems.filter((item)=> item.trans == "TRANSPURCHASE")
        break;
      case 'Sale' :
        this.showItems = this.walletItems.filter((item)=> item.cashEarned > 0  )
        break;
      case 'Redeemed' :
        this.showItems = this.walletItems.filter((item)=> item.redeemed > 0)
        break;
      case 'Earned' :
        this.showItems = this.walletItems.filter((item)=> item.joinReward > 0  ||
        item.purchaseReward > 0  ||
        item.cashEarned > 0  )
        break;
    }
  }
  generateTrans(data) {
    data.forEach(item => {
      let soft = parseInt(item.soft_amount)
      let hard = parseInt(item.hard_amount)
      if (soft != 0 || hard != 0) {
        let tran = new Wallettrans() ;
        tran.date = Utils.convertDBDateShortyyyymmdd(item.transaction_date,'-')
        tran.desc = item.comment
        if (item.type == 'DR') {
          if (item.soft_amount != 0)
            tran.dramount = item.soft_amount
          if (item.hard_amount != 0)
            tran.dramount = item.hard_amount
        } else {
          if (item.soft_amount != 0)
            tran.cramount = item.soft_amount
          if (item.hard_amount != 0)
            tran.cramount = item.hard_amount
        }
        tran.balreward = item.closing_soft_amount
        tran.balcash = item.closing_hard_amount
        this.trans.push(tran)
      }
    });
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
            console.log("wallet",data);
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
