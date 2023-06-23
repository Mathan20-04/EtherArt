import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BaseComponent } from '../base.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import { WalletService } from 'src/app/service/wallet.service';


@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.css']
})
export class ReferralComponent extends BaseComponent implements OnInit {

  public url = this.getBaseURL() +  "/signup?code=" + this.getLoggedInUserInfo().invitation_code ;
  public urlReferral = "Hi! I’m personally inviting you to a world of rare digital collectibles celebrating the 75th Anniversary of India’s Independence and India’s victories. \n Your exclusive access to EtherArt expires in 24hrs. Join now \n " + this.url
  public isMob = this.isMobile();
  public shareOnWhatsappApp ;
  public welcomeMsg = "Welcome to EtherArt!"
  public balance = 0
  public snapshot: any;
  constructor(private sanitizer:DomSanitizer,public snackBar:MatSnackBar,
    private walletService : WalletService,) {
    super()
    this.shareOnWhatsappApp = "whatsapp://send?text=Hi! I’m personally inviting you to a world of rare digital collectibles celebrating the 75th Anniversary of India’s Independence and India’s victories. \n Your exclusive access to EtherArt expires in 24hrs. Join now \n" +
    this.url;
    this.shareOnWhatsappApp = this.sanitizer.bypassSecurityTrustUrl(this.shareOnWhatsappApp);
  }

  ngOnInit() {
    this.getWalletSnapshot()
  }

  copyLink() {
    this.snackBar.open("Link Copied","",{ duration: 2000});
  }

  getWalletSnapshot() {
    try {
      this.walletService.getWalletSnapshot(null).subscribe(
        data => {
          if (data != null) {
            this.balance = data.remaining
          }
        }
      );
    } catch (e) {
      this.handleExcception(e);
    }
  }

}
