import {Component, HostListener, OnInit} from '@angular/core';
import {BaseComponent} from "../base.component";
import {MatDialogRef} from "@angular/material/dialog";
import {PayoutService} from "../../../service/payout.service";
import {SharedDataServiceService} from "../../../service/shared-data-service.service";
import {Utils} from "../../../utils/Utils";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
    selector: 'app-make-payment',
    templateUrl: './make-payment.component.html',
    styleUrls: ['./make-payment.component.css']
})
export class MakePaymentComponent extends BaseComponent implements OnInit {

    public updatePayReq = false;
    public msg: any;
    public payoutReq: any;
    public payoutStatus: any;
    public requestId;
    public status;
    public comments;
    public referenceId;
    public referenceObject;
    public amount;
    public payment;
    public toName;
    public mode;
    public upiId;
    public accountNumber;
    public ifsc;

    constructor(
        public dialogRef: MatDialogRef<MakePaymentComponent>,
        public payoutService: PayoutService,
        public sharedDataService: SharedDataServiceService,
        public snackBar: MatSnackBar
    ) {
        super();
        this.sharedDataService.currentMessage.subscribe(
            message => (this.msg = message));
        if (this.msg.sender == "payoutReq") {
            this.payoutReq = this.msg.data;
            console.log(this.payoutReq);
            this.requestId = this.payoutReq.request_id;
            this.referenceId = Utils.generateRandomNum()
            this.toName = this.payoutReq.payment_method.account_name;
            this.mode = this.payoutReq.comments
            this.upiId = this.payoutReq.payment_method.upi_id;
            this.accountNumber = this.payoutReq.payment_method.account_number;
            this.ifsc = this.payoutReq.payment_method.ifsc_code;
            this.amount = this.payoutReq.amount;
        }
    }

    ngOnInit(): void {
        this.getPayoutStatus();
    }

    onPayoutStatusChange(status) {
        this.status = status
    }

    getPayoutStatus() {
        this.payoutService.getPayoutStatus(null).subscribe(
            data => {
                this.payoutStatus = data;
            }, error => {
                alert(error)
            }
        )
    }

    close() {
        this.dialogRef.close();
    }

    @HostListener('window:keyup.esc') onKeyUp() {
        this.dialogRef.close();
    }

    // transfer() {
    //   if(this.status != undefined && this.comments != undefined ) {
    //     this.updatePayReq = true;
    //     let postObj = {
    //       request_id : this.requestId,
    //       status : this.status,
    //       comments : this.comments,
    //       reference_id :this.referenceId,
    //       reference_object : this.referenceObject
    //     }
    //     let obj = {};
    //     obj['payout_request_json'] = JSON.stringify(postObj)
    //     this.payoutService.updatePayoutRequest(obj).subscribe(
    //         data=> {
    //           this.updatePayReq = false;
    //           this.snackBar.open("Payout Request Updated Successfully", "", { duration: 2000 })
    //           this.dialogRef.close()
    //         },error => {
    //           alert(error);
    //         }
    //     )
    //   } else {
    //     alert("please fill all the input fields are mandatory")
    //   }
    // }

    updatePayoutRequest() {
        // if(this.status != undefined && this.comments != undefined ) {
        this.updatePayReq = true;
        let postObj = {
            request_id: this.requestId,
            status: this.status,
            comments: this.comments,
            reference_id: this.referenceId,
            reference_object: this.referenceObject
        }
        let obj = {};
        obj['payout_request_json'] = JSON.stringify(this.payoutReq)
        this.payoutService.updatePayoutRequest(obj).subscribe(
            data => {
                this.updatePayReq = false;
                this.snackBar.open("Payout Request Updated Successfully", "", {duration: 2000})
                this.dialogRef.close()
            }, error => {
                alert(error);
            }
        )
        // } else {
        //   alert("please fill all the input fields are mandatory")
        // }

    }

}

