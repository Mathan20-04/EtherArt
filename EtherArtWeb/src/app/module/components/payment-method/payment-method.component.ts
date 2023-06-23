import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../base.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {PayoutService} from "../../../service/payout.service";

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css']
})
export class PaymentMethodComponent extends BaseComponent implements OnInit {

  public paymentMethod = [];
  public showAddPayment = false;
  constructor(
    public dialog: MatDialog,
    public payoutService: PayoutService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getUserPaymentMethod();
  }

  receivedMessageHandler(val) {
    this.showAddPayment = val;
  }

  openAddPayment() {
    this.showAddPayment =! this.showAddPayment;
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
}
