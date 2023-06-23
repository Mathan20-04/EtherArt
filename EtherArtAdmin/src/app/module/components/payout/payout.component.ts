import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../base.component";
import {Router} from "@angular/router";
import {PayoutService} from "../../../service/payout.service";
import {Utils} from "../../../utils/Utils";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MakePaymentComponent} from "../make-payment/make-payment.component";
import {Message} from "../../../utils/message";
import {SharedDataServiceService} from "../../../service/shared-data-service.service";

@Component({
  selector: 'app-payout',
  templateUrl: './payout.component.html',
  styleUrls: ['./payout.component.css']
})
export class PayoutComponent extends BaseComponent implements OnInit {

  public isfilterOpen = false;
  public payOutRequestList = [];
  public INRBalance = '';
  constructor(
      private router:Router,
      private payoutService:PayoutService,
      private sharedDataService: SharedDataServiceService,
      public dialog: MatDialog,
      ) {
    super();
  }

  ngOnInit(): void {
      this.getAllPayoutRequest()
      this.getINRBalance();
  }

  filterOpen() {
    this.isfilterOpen = ! this.isfilterOpen
  }

  showDateYYYY(dt, char) {
    return Utils.convertDBDateShortyyyymmdd(dt, char);
  }

  getAllPayoutRequest() {
    let obj = {
      from_date: "",
      to_date: "",
      status: "",
      user: "",
      mobile: ""
    }
    this.payoutService.getAllPayoutRequest(obj).subscribe(
        data=> {
          this.payOutRequestList = data.data;
          console.log(this.payOutRequestList)
        },error => {
          alert(error)
        }
    )
  }

  openMakePayment(item) {
    this.getMySale(item)
    let message = new Message(item, "payoutReq");
    this.sharedDataService.changeMessage(message);
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "75vh";
    dialogConfig.width = "90vh";
    this.dialog.open(MakePaymentComponent, dialogConfig);
  }

  getINRBalance(){
    this.payoutService.getINRBalance(null).subscribe(
        data=> {
          this.INRBalance = data;
        }
    )
  }

  getMySale(item) {
    let obj = { collection_id: '', from_date: '', to_date: '', q:'',oder:'', page_num: 1, page_size: 20 ,user_id:item.user_id}
    try {
        this.payoutService.mySale(obj).subscribe(
            data => {

            }
        );
    } catch (e) {
        this.handleExcception(e);
    }
  }
}
