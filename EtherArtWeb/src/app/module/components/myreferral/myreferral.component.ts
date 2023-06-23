import { Component, OnInit } from "@angular/core";
import { MyaccountService } from "src/app/service/myaccount.service";
import { BaseComponent } from "../base.component";
import { DomSanitizer } from "@angular/platform-browser";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Utils } from "../../../utils/Utils";
import { WalletService } from "src/app/service/wallet.service";

@Component({
  selector: "app-myreferral",
  templateUrl: "./myreferral.component.html",
  styleUrls: ["./myreferral.component.css"],
})
export class MyreferralComponent extends BaseComponent implements OnInit {
  public list: Array<any> = [];
  public snapshot: any;
  public url =
    this.getBaseURL() +
    "/signup?code=" +
    this.getLoggedInUserInfo().invitation_code;
  public urlReferral =
    "Hi! I’m personally inviting you to a world of rare digital collectibles celebrating the 75th Anniversary of India’s Independence and India’s victories. \nYour exclusive access to EtherArt expires in 24hrs. Join now \n" +
    this.url;

  public shareOnWhatsappApp;
  constructor(
    private sanitizer: DomSanitizer,
    public snackBar: MatSnackBar,
    public accountService: MyaccountService,
    public walletService: WalletService
  ) {
    super();
    this.shareOnWhatsappApp =
      "whatsapp://send?text=Hi! I’m personally inviting you to a world of rare digital collectibles celebrating the 75th Anniversary of India’s Independence and India’s victories. \nYour exclusive access to EtherArt expires in 24hrs. Join now \n" +
      this.url;
    this.shareOnWhatsappApp = this.sanitizer.bypassSecurityTrustUrl(
      this.shareOnWhatsappApp
    );
  }

  ngOnInit() {
    this.getMyReferrals();
    this.getWalletSnapshot();
  }

  getWalletSnapshot() {
    try {
      this.walletService.getWalletSnapshot(null).subscribe((data) => {
        this.snapshot = data;
      });
    } catch (e) {
      this.handleExcception(e);
    }
  }

  getMyReferrals() {
    try {
      let obj = { id: this.getLoggedInUserId() };
      this.accountService.getReferrals(obj).subscribe((data) => {
        if(data != null) {
          this.list = data;
        }

      });
    } catch (e) {
      this.handleExcception(e);
    }
  }
  copyLink() {
    // alert("Link Copied");
    this.snackBar.open("Link Copied", "", { duration: 2000 });
  }

  showDate(item) {
    return Utils.convertDBDateShortyyyymmdd(item.created_on, "-");
  }
}
