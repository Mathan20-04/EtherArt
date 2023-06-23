import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, NavigationStart} from '@angular/router';
import {OrderService} from 'src/app/service/order.service';
import {Utils} from 'src/app/utils/Utils';
import {BaseComponent} from '../base.component';
import {DomSanitizer} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Message} from 'src/app/utils/message';
import {SharedDataServiceService} from 'src/app/service/shared-data-service.service';
import {AppConstants} from 'src/app/utils/Constants';
import {DataService} from 'src/app/service/data.service';
import {AuthService} from 'src/app/service/auth.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent extends BaseComponent implements OnInit {
  public sessionId: any;
  public resp: any;
  public btcValue = "0.00002851";
  public collName = "Name"
  public nftNum;
  public txnHash = ""
  public txnId = ""
  public ownerName = "Self"
  public imageURL = ""
  public shareOnWhatsappApp;
  public urlReferral;
  public token: any;

  // steps
  public authDone = false ;
  public confirmDone = false;
  public error = false
  public errorMsg = ""

  constructor(
    private arouter: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private sanitizer: DomSanitizer,
    public sharedDataService: SharedDataServiceService,
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    super()
  }

  ngOnInit(): void {
    this.arouter.queryParams.subscribe(param => {
      this.sessionId = param.session_id
      this.token = JSON.parse(Utils.decryptResponse(param.token))
      console.log("token is ", this.token)
    });
    console.log(DataService.getDataFromLocal(AppConstants.AUTH_KEY))
    console.log(sessionStorage.getItem(AppConstants.AUTH_KEY))
    setTimeout(()=>{
      console.log("delay")
      this.process()
    },1000)
  }

  process() {
    // try authKey else login using token
    if (this.checkAuthentication() == -1) {
      let input = {
        email_mobile: this.token.mobile,
        password: this.token.password,
        country_dial_code: this.token.country_dial_code
      };
      let obj = {};
      obj["auth_json"] = JSON.stringify(input);
      this.authService.authenticate(obj).subscribe(
        (data) => {
          console.log(data)
          if (data == null) {
            this.confirmOrder()
          }
          if (data["token"] != "") {
            this.confirmOrder()
            let message = new Message(data, "login");
            this.sharedDataService.changeMessage(message);
            this.isLoggedIn = true;
            this.loggedInUserName = data.data.first_name;
          }
        },
        (error) => {
          this.confirmOrder()
        }
      );
    } else {
      setTimeout(()=>{
        this.authDone = true
        this.confirmOrder()
      },2000)
          console.log("timer");

    }
    this.urlReferral = "Hey! Look at this rare digital collectable I just bought. \n " + this.getBaseURL() + "/detail?detail_id="
  }

  // change(message: Message) {
  //   if (message != null) {
  //     if (message.sender == "signup" || message.sender == "login" || message.sender == "autologin") {
  //       if (this.sessionId)
  //         this.confirmOrder()
  //     }
  //   }
  // }

  confirmOrder() {
    let orderJson: any = {};
    orderJson.session_id = this.sessionId;
    let obj = {}
    obj['confirm_json'] = JSON.stringify(orderJson);
    this.orderService.confirm(obj).subscribe(
      data => {
        this.resp = data;
        console.log(data)
        if (this.resp.items != undefined && this.resp.items != null && this.resp.items.length > 0) {
          this.nftNum = this.resp.items[0].item.detail_id
          this.imageURL = this.resp.items[0].item.url + "&s=700"
          this.btcValue = (this.resp.items[0].item.purchased_price /
            Utils.getBTCRate()).toFixed(7).toString()
          let user = this.getLoggedInUserInfo()
          this.ownerName = user.first_name + " " + user.last_name
          this.txnId = data.order_id
          let col = Utils.getCollectionForNFT(this.resp.items[0].item)
          this.collName = col == null ? 'Jai Bharath Vaccination Drive' : col.title
          this.confirmDone = true;
          this.shareOnWhatsappApp = "whatsapp://send?text=Hey! Look at this rare digital collectable I just bought. \n " + this.getBaseURL() + "/detail?detail_id=" + this.nftNum + " \n EtherArt has just launched a very special collection to celebrate the 75th Anniversary of India’s Independence and India’s victories, Join us now to celebrate with us.";
          this.shareOnWhatsappApp = this.sanitizer.bypassSecurityTrustUrl(this.shareOnWhatsappApp);
          this.urlReferral = this.urlReferral + this.nftNum + " \n EtherArt has just launched a very special collection to celebrate the 75th Anniversary of India’s Independence and India’s victories, Join us now to celebrate with us."
        }
      }, error1 => {
        this.error = true
        this.confirmDone = true;
        if (error1 == "Order has been placed already for this session")
          this.errorMsg = error1
        else
          this.errorMsg = "Your payment is successful. Unable to confirm order. Will intimate as soon as order is confirmed via SMS. Your money is safe "
        console.debug("confirm:", error1)
      }
    );
  }

  openCollectables() {
    let obj = {
      collectables: true
    }
    this.router.navigate(['myaccount'], {state: obj})
  }

  copyLink() {
    this.snackBar.open("Link Copied", "", {duration: 2000});
  }
}
