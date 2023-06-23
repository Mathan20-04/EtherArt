import { Component,  OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { loadStripe } from '@stripe/stripe-js';
import { loadStripe } from "@stripe/stripe-js/pure";
import { DataService } from 'src/app/service/data.service';
import { AppConstants, StripeKey } from "src/app/utils/Constants";
import { Utils } from 'src/app/utils/Utils';
import {BaseComponent} from "../base.component";

declare function callStripe(data: any): any;

@Component({
  selector: 'app-payu',
  templateUrl: './payu.component.html',
  styleUrls: ['./payu.component.css']
})
export class PayuComponent extends BaseComponent implements OnInit {
  stripePromise = loadStripe(StripeKey.Prod);
  public isINR = true ;
  public item:any;
  public url = "assets/mystery.png";
  public stripeSessionID ;
  public itemid = "";
  public itemPrice;
  public infoMsg:any;
  public checkOutForm:any;
  public data : any;
  public formData: any = {
    account_id : 'M000032953', // does not matter .. coming from backend
    return_url :'http://localhost:4200/success',
    reference_no : '12345',
    amount: '10.00',
    description : 'Test',
    name : 'Vikram',
    phone : '9999999999',
    email : 'Vikr@sdaflj.com',
    address: 'address text here',
    city: 'Bangalore',
    state: 'Karnataka',
    postal_code: '56004',
    udf1:'',
    udf2:'',
    udf3:'',
    udf4:'',
    udf5:'',
    secure_hash: ''
  };
  constructor(public router : Router) {
    super();
    this.data = this.router.getCurrentNavigation().extras.state;
    if (this.data == null)
      this.router.navigate(["dashboard"]);
    console.log(this.data)
    this.stripeSessionID = this.data.draftOrder.session_id ;
    this.formData.account_id = this.data.draftOrder.key
    this.formData.return_url = this.data.draftOrder.success_url
    this.formData.reference_no = this.data.draftOrder.order
    // this.formData.reference_no = Utils.generateRandomNumAsStr()
    this.formData.amount = this.data.draftOrder.amount
    this.formData.description = 'Item - ' + this.data.draftOrder.product_info
    this.formData.name = this.data.checkoutForm.firstname
    this.formData.phone = this.data.checkoutForm.phone
    this.formData.email = this.data.checkoutForm.email
    this.formData.secure_hash = this.data.draftOrder.hash
    this.isINR = this.data.checkoutForm.currency == 'INR' ? true : false
    this.checkOutForm = this.data.checkoutForm;
    this.itemPrice = this.data.draftOrder.amount
    this.item = this.data.item;
    this.url = this.item.url + "&s=700";
    this.itemid = this.item.detail_id;

    console.log(this.item)
    // alert("Reference number is "+ this.formData.reference_no)
  }

  ngOnInit() {
    console.log(DataService.getDataFromLocal(AppConstants.AUTH_KEY))
    console.log(sessionStorage.getItem(AppConstants.AUTH_KEY))
  }

  openStripe() {
    this.callStripe();
  }

  // openCF() {
  //   alert(this.data.draftOrder.payment_link)
  //   // this.router.navigateByUrl(this.data.draftOrder.payment_link,{skipLocationChange : true})
  //   document.location.href = this.data.draftOrder.payment_link
  // }
  async callStripe() {
    // When the customer clicks on the button, redirect them to Checkout.
    console.log(this.stripeSessionID);
    const stripe = await this.stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId: this.stripeSessionID,
    });
    if (error) {
      console.log(error);
    } else {
      alert("Successful payment!!");
      console.log(error);
    }
  }
}
