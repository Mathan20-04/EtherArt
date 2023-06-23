import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { OrderService } from "src/app/service/order.service";
import { WalletService } from "src/app/service/wallet.service";
import { BaseComponent } from "../base.component";
import { Utils } from "src/app/utils/Utils";
import { CountryISO } from "ngx-intl-tel-input";

import { MyaccountService } from "src/app/service/myaccount.service";
import {Message} from "../../../utils/message";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ItemmsgService} from "../../../service/itemmsg.service";
import {ScanQrComponent} from "../scan-qr/scan-qr.component";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent extends BaseComponent implements OnInit {
  public item: any;
  public user: any;
  public wallet: any;
  public itemid = "";
  public countryiso = CountryISO.India;
  public maxDeduction = 0.0;
  public itemPrice = 500;
  public netPrice = 0;
  public toPay = 0.0;
  public balance = 0.0;
  public checkOutData: any;
  public url = "assets/mystery.png";
  public paymentHandler: any = null;
  public showConfirmButon = true;
  public showPayuButton = false;
  public disablePaymentButton = true;
  public fname = "";
  public phone = "";
  public email = "";
  public usd = false;
  public taxpercent = 18;
  public taxamount = 18;
  public serviceCharge = 150
  public col ;
  public qrCode : any ;
  public disable = false;
  public purchasedPrice = 0
  public isAvailable = true ;

  public checkoutForm: any = {
    productinfo: "",
    firstname: "",
    email: "",
    phone: "",
    amount: "",
    surl: "",
    furl: "",
    key: "",
    hash: "",
    txnid: "",
    currency: "INR",
  };

  // public formData: any = {
  //   account_id : 'M000032953',
  //   return_url :'http://localhost:4200/success',
  //   reference_no : '12345',
  //   amount: '10.00',
  //   description : 'Test',
  //   name : 'Vikram',
  //   phone : '9999999999',
  //   email : 'Vikr@sdaflj.com',
  //   address: 'address text here',
  //   city: 'Bangalore',
  //   state: 'Karnataka',
  //   postal_code: '56004',
  //   udf1:'',
  //   udf2:'',
  //   udf3:'',
  //   udf4:'',
  //   udf5:'',
  //   secure_hash: ''
  // };

  constructor(
    public router: Router,
    private walletService: WalletService,
    private orderService: OrderService,
    private accntService : MyaccountService,
    public itemMsgService : ItemmsgService,
    public dialog: MatDialog,
  ) {
    super();
    this.item = this.router.getCurrentNavigation().extras.state;
    if (this.item == null)
      this.router.navigate(["dashboard"]);

      if (this.item.price == null)
      this.itemPrice = 750;
    else
      this.itemPrice = this.item.price;

    this.url = this.item.url + "&s=700";
    this.itemid = this.item.detail_id;

    if (this.item.sale != null) {
      this.itemPrice = this.item.sale[0].price;
    }

    this.checkoutForm.amount = this.itemPrice;
  }

  ngOnInit(): void {
    document.body.scrollTop = 0;
    this.user = this.getLoggedInUserInfo();
    this.col = Utils.getCollectionForNFT(this.item);
    let name = this.col.name;;
    this.checkoutForm.firstname = this.user.first_name;
    this.checkoutForm.lastname = this.user.last_name;
    this.checkoutForm.email = this.user.email;
    this.checkoutForm.phone = this.user.mobile;
    this.phone = this.user.mobile;
    this.checkoutForm.productinfo = this.item.detail_id + name;
    if (this.user.country_dial_code != 91) {
      this.checkoutForm.currency = 'USD'
      this.usd = true
      console.log(this.itemPrice, this.serviceCharge)
      this.checkoutForm.amount = this.itemPrice + this.serviceCharge;
      this.netPrice = this.itemPrice + this.serviceCharge;
    } else {
      this.getWallet();
    }
    this.checkAvailability()
    document.body.scrollTop = 0
  }

  checkAvailability() {
    try {
      let obj = {
        item_id : this.item.detail_id
      }
      this.orderService.checkAvialble(obj).subscribe((data) => {
        console.log(data)
        if (data != null && data.is_available != 1) {
          this.isAvailable = false
          this.showConfirmButon = false
        }
      });
    } catch (e) {
      this.handleExcception(e);
    }
  }

  getWallet() {
    try {
      this.walletService.getMyWallet(null).subscribe((data) => {
        this.maxDeduction = 0;
        this.toPay = this.itemPrice;
        this.balance = 0;
        if (data != null) {
          this.wallet = data;
          this.maxDeduction =
            this.wallet.closing_soft_balance > 200
              ? 200
              : this.wallet.closing_soft_balance;
          if (this.maxDeduction > this.itemPrice)
            this.maxDeduction = 0;
          this.netPrice = this.itemPrice - this.maxDeduction;
          this.taxamount = this.netPrice * this.taxpercent / 100
          this.toPay = this.netPrice + this.taxamount
          this.balance = this.wallet.closing_soft_balance;
          this.checkoutForm.amount = this.toPay;
        } else {
          this.netPrice = this.itemPrice - this.maxDeduction;
          this.taxamount = this.netPrice * this.taxpercent / 100
          this.toPay = this.netPrice + this.taxamount
          this.checkoutForm.amount = this.toPay;
        }
      });
    } catch (e) {
      this.handleExcception(e);
    }
  }

  selectINR() {
    this.usd = false
    this.checkoutForm.currency = 'INR'
  }

  selectUSD() {
    this.usd  = true
    this.checkoutForm.currency = 'USD'
  }


  updateUserProfile() {
    try {
      let obj = {
        email: this.checkoutForm.email,
        name: this.checkoutForm.firstname
      };
      let postObj = {};
      postObj["email_json"] = JSON.stringify(obj);
      this.accntService.updateEmailName(postObj).subscribe((data) => {
      });
    } catch (e) {
      alert("error!!!");
      this.handleExcception(e);
    }
  }

  checkOut() {
    console.log(this.col)
    if (this.checkoutForm.firstname == undefined || this.checkoutForm.firstname == '') {
      alert("Please fill in Name")
      return
    }

    if (this.checkoutForm.email == undefined || this.checkoutForm.email == '') {
      alert("Please fill in email")
      return
    }

    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regexp.test(this.checkoutForm.email)) {
      console.log("valid")
    } else {
      alert("Please enter valid email id");
      return;
    }

    if (this.checkoutForm.phone == undefined || this.checkoutForm.phone == '') {
      alert("Please fill in phone")
      return
    }
    this.showConfirmButon = false;
    this.disable = true;
    this.updateUserProfile()
    console.log("netPrice", this.netPrice)

    try {
      let cartItem = {
        item_id: this.item.detail_id,
        // item_id: this.item.detail_id,
        item_type: "DIGITAL",
        quantity: 1,
        base_price: this.netPrice,
        purchase_price: this.item.purchased_price == null ? 0 : this.item.purchased_price,
        coupon_deduction: 0,
        coupon_code: ""
      };
      let items = [];
      items.push(cartItem);
      let payItemSoft = {
        payment_type: "SOFT",
        amount: this.maxDeduction,
        ref_id: Utils.generateRandomNumAsStr(),
      };
      let payments = [];
      payments.push(payItemSoft);

      let payItemHard = {
        payment_type: "HARD",
        amount: this.netPrice,
        ref_id: Utils.generateRandomNumAsStr(),
      };
      payments.push(payItemHard);
      let obj = {
        items: items,
        payments: payments,
        pg: this.checkoutForm.currency == 'USD' ? "STRIPE" : "CASHFREE",
        context : {
          first_name: this.checkoutForm.firstname,
          email: this.checkoutForm.email,
          phone: this.checkoutForm.phone
        }
      };
      let postObj = {};
      postObj["order_json"] = JSON.stringify(obj);
      this.orderService.add(postObj).subscribe((encdata) => {
        let data = JSON.parse(Utils.decryptResponse(encdata))
        console.log(data)
        let json = { checkoutForm: this.checkoutForm, draftOrder: data ,item: this.item}
        this.router.navigate(['pay'], {state: json})
        this.disable = false;
      },error => {
        this.showConfirmButon = false;
        this.isAvailable = false
        }
      );
    } catch (e) {
      this.showConfirmButon = false;
      this.isAvailable = false
    }
  }

  openScanQR() {
    let obj = {
      qrCode : this.qrCode,
      totalAmount : this.checkoutForm.amount
    };
    let message = new Message(obj, "cart");
    this.itemMsgService.changeMessage(message);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    if(this.isMob) {
      dialogConfig.height = "70vh";
      dialogConfig.width = "90vw";
    } else {
      dialogConfig.height = "90vh";
      dialogConfig.width = "30vw";
    }
    this.dialog.open(ScanQrComponent, dialogConfig);
  }

}
