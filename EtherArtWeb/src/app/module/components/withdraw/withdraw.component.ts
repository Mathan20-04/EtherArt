import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../base.component";
import {Utils} from "../../../utils/Utils";
import {PayoutService} from "../../../service/payout.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {WalletService} from "../../../service/wallet.service";
import {OrderService} from "../../../service/order.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent extends BaseComponent implements OnInit {

  public amount = '';
  public userInfo : any;
  public payOutRequestList : any;
  public snapshot : any;
  public walletItems = []
  public cashAvailable : any;
  public showItems : any
  public iconSrc;
  public requestBtn = false;
  public profileCompleted = false;
  public sale = [] ;
  public paymentMethod = [];
  public pay_id;

  constructor(
    private payoutService:PayoutService,
    public snackBar:MatSnackBar,
    private walletService:WalletService,
    private router: Router,
    private orderService: OrderService) {
    super();
  }

  ngOnInit(): void {
    this.userInfo = this.getLoggedInUserInfo()
    console.log(this.userInfo)
    if(this.userInfo.first_name != '' && this.userInfo.email != '' && this.userInfo.city != '' && this.userInfo.pin !='') {
      this.profileCompleted = true;
    } else {
      this.profileCompleted = false;
    }
    this.getWalletSnapshot();
    this.getPayoutRequest();
    this.getMyWallet();
    this.getMySale();
    this.getUserPaymentMethod();
  }

  getMyWallet() {
    try {
      this.walletService.getMyWallet(null).subscribe(
        data => {
          this.getWalletTrans()
        }
      );
    } catch (e) {
      this.handleExcception(e);
    }
  }

  showDateYYYY(dt, char) {
    return Utils.convertDBDateShortyyyymmdd(dt, char);
  }

  makePayoutRequest() {
    if(this.amount != '' && this.amount != null && this.amount !=undefined) {
      if(this.amount <= this.cashAvailable) {
        if(this.pay_id != undefined && this.pay_id != ''){
          this.requestBtn = true;
          let pid = this.paymentMethod.filter((pm) => pm.payment_method_id == this.pay_id)

          let postObj = {
            user_id : this.getLoggedInUserId(),
            payment_method_id : this.pay_id,
            amount : this.amount,
            comments: pid[0].upi_id != '' ? 'UPI' : 'Bank',
            currency : 'INR'
          };
          let obj = {};
          obj['payout_request_json'] = JSON.stringify(postObj);
          this.payoutService.addPayoutRequest(obj).subscribe(
            data=>{
              this.snackBar.open("request added successfully","",{ duration: 2000});
              this.amount = '';
              this.requestBtn = false;
              this.getPayoutRequest();
            },error => {
              alert(error)
              this.requestBtn = false;
            }
          );
        } else{
          alert("please select Payment Method")
        }
      } else {
        alert("please enter amount less than or equal to cash available")
      }
    } else {
      alert("please enter amount to make request")
    }

  }

  getPayoutRequest() {
    let obj = {
      from_date: "",
      to_date: "",
      status: "",
    };
    this.payoutService.getPayoutRequestCustomer(obj).subscribe(
      data => {
        if (data != null)
          this.payOutRequestList = data.data;
      }
    )
  }

  getWalletSnapshot() {
    try {
      this.walletService.getWalletSnapshot(null).subscribe(
        data => {
          this.snapshot = data;
          this.cashAvailable = data.cash_balance;
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
            // this.generateTrans(data.data)
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
      walletItem.date =  " Sold by Me" +" "+ "on " + Utils.convertDBDateShortyyyymmdd(item.transaction_date,'-')
      walletItem.trans = item.transaction_type
      if(walletItem.trans == "TRANSSALE") {
        walletItem.name = item.item.detail_id
        walletItem.itemid = item.item.detail_id
        walletItem.image = item.item.url + '&s=700'
        walletItem.cashEarned = item.hard_amount
        walletItem.show = walletItem.cashEarned > 0 ? 1 : 0
        walletItem.hbalance = item.closing_hard_amount
        this.iconSrc = "assets/sold.svg";
      }
      if (walletItem.show == 1)
        this.walletItems.push(walletItem);
    });
    this.showItems = this.walletItems
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

  generateSalesData(sales) {
    sales.forEach(sale => {
      let obj = {}
      obj['saleDate'] =  "Sold"+" "+ "on "+ Utils.convertDBDateShortyyyymmdd(sale.sale_date,'-');
      obj['item_id'] = sale.item_id
      obj['url'] = sale.item_detail.url
      obj['purchasePrice'] = sale.purchase_price;
      obj['salePrice'] = sale.sale_price;
      obj['commission'] = sale.commission
      obj['profit'] = sale.profit;
      obj['item_detail'] = sale.item_detail;
      this.iconSrc = "assets/sold.svg";
      this.sale.push(obj)
    });
  }

  getUserPaymentMethod() {
    this.payoutService.getUserPaymentMethod(null).subscribe(
      data=> {
        this.paymentMethod = data;
      },error => {
        alert(error)
      }
    )
  }

  onPayMethodChange(event) {
    // this.paymethod = event;
  }
  openPaymentMethod() {
    let obj = {
      paymethod:true
    }
    this.router.navigate(['myaccount'], {state: obj})
  }
}

