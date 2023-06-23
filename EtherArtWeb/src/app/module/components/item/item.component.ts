import { Component, Input, OnInit } from '@angular/core';
import { CartService } from 'src/app/service/cart.service';
import { DataService } from 'src/app/service/data.service';
import { OrderService } from 'src/app/service/order.service';
import { ItemStatus } from 'src/app/utils/Constants';
import { Utils } from 'src/app/utils/Utils';
import { BaseComponent } from '../base.component';
import {MatDialog, MatDialogRef,MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ModalloginComponent } from '../modallogin/modallogin.component';
import {Message} from "../../../utils/message";
import {TraitsComponent} from "../traits/traits.component";
import { Router } from '@angular/router';
import { ItemmsgService } from 'src/app/service/itemmsg.service';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: []
})
export class ItemComponent extends BaseComponent implements OnInit {

  @Input() item : any;
  public urlReferral :any;
  public isMyItem = false;
  public shareOnWhatsappApp ;


  public cartTitle ="";
  public owner = ""
  public likeIcon = "" ;
  public like = 0
  public btcValue  = "" ;
  public iconsrc = "assets/sale.svg"

  // first line bottom after image
  // public hashCode = ""
  public urlAuthenticity = "https://etherscan.io/"

  // second line

  public priceToShow


  // third line action line
  public showBid = false
  public showBidPrice = false
  public showBuy = true
  public bShowTitle = false


  public itemStatus = ItemStatus.OnSale ;
  public bidPrice = 0;
  public bidlow = 0;
  public bidhigh = 0;
  public bidObj ;
  public isBidMore = false;
  public showBidHigh = false;
  // loading the page
  public bInProcess = false // input item available

  public bBidRcvd = false
  public bActRcvd = false
  public bSaleRcvd = false

  public rarity_per = "n/a"

  public url = ""

  public bidNow = false
  public buyBtn = false;
  public mysteryItem = false;
  public static bSubscribed = false ; //??? what is this?

  constructor(
    public dialog: MatDialog,
    public cartService: CartService,
    public orderService: OrderService,
    public itemMsgService : ItemmsgService,
    private router: Router,
    public dataService: DataService,
    private sanitizer:DomSanitizer) {
    super()
    this.itemMsgService.currentMessage.subscribe(
      message => (this.onMessageRecv(message)));
  }

  ngOnInit(): void {
    // if (this.item.owner_id == null) {
    //   this.url = "assets/mystery.png"
    //   this.mysteryItem = true;
    // } else {

    // }
    this.url = this.item.url + "&s=700" // show low resolution image
    this.urlReferral = "I am so excited to share this rare digital collectable I found on EtherArt. \n " + this.getBaseURL() +  "/detail?detail_id=" + this.item.detail_id+" \n EtherArt has just launched a very special collection to celebrate the 75th Anniversary of India’s Independence and India’s victories, Join us now to celebrate this special occasion."
    this.bidlow =  this.bidhigh = this.item.price
    if (this.item.owner_id != null) {
      this.isMyItem =  this.item.owner_id == this.getLoggedInUserId()  ? true : false
    }
    this.like = parseInt(this.item.likes)
    // this.hashCode = String(this.item.txn_hash).substring(5,18).toString()+ "..."
    this.rarity_per = this.item.rarity_percent
    this.bInProcess = true
    this.priceToShow = this.item.price
    this.doProcess()
    this.appendNFTHash()
  }

  appendNFTHash() {
    if (this.item.txn_hash != null) {
      this.urlAuthenticity = this.urlAuthenticity + "tx/" + this.item.txn_hash
    }
    else {
      // get the collection for this item
      let col = Utils.getCollectionForNFT(this.item)
      // console.log(col)
      if (col != null)
        this.urlAuthenticity = this.urlAuthenticity + "address/" + col.contract_address
      else // fall back on our first NFT address
        this.urlAuthenticity = this.urlAuthenticity + "address/" + "0xBDc64C1A30065aED64d2729F06DD12F10f5193b9"
    }
    this.shareOnWhatsappApp = "whatsapp://send?text=I am so excited to share this rare digital collectable I found on EtherArt,\n "+ this.getBaseURL() + "/detail?detail_id="+this.item.detail_id+" \n EtherArt has just launched a very special collection to celebrate the 75th Anniversary of India’s Independence and India’s victories, Join us now to celebrate this special occasion."
    this.shareOnWhatsappApp = this.sanitizer.bypassSecurityTrustUrl(this.shareOnWhatsappApp);
  }

  onMessageRecv(msg) {
    if (msg == undefined || msg == null) {
      return
    }
    if (msg.sender == "afterBidsFetch") {
      this.bBidRcvd = true
      this.doBidProcess()
    }
    if (msg.sender == "afterSalesFetch") {
      this.bSaleRcvd = true
      this.doSaleProcess()
    }
    if (msg.sender == "afterActivityFetch") {
      this.bActRcvd = true
      this.doActvitiyProcess()
    }
  }

  doBidProcess() {
    if (this.bInProcess && this.bBidRcvd) {
      this.getBidRange()
    }
  }

  doSaleProcess() {
    // if (this.item != null)
    //   console.log(this.item)
    if (this.bInProcess && this.bSaleRcvd) {
      this.owner = ""
      if (this.item.owner_id != null) {
        this.isMyItem =  this.item.owner_id == this.getLoggedInUserId()  ? true : false
        this.owner = this.isMyItem ?  "Me" : this.item.owner_id.toString(16)
        if (this.item.sale == null) {
          this.itemStatus = ItemStatus.Owned
          this.iconsrc = "assets/bid.svg"
          if (this.bidhigh > this.item.purchased_price) {
            this.bidPrice = this.bidhigh
          } else {
            this.bidPrice = this.item.purchased_price + 50
            this.bidhigh = this.bidPrice
          }
          // this.iconsrc = "assets/bid.svg"
        } else {
          this.itemStatus = ItemStatus.OwnerSale
          this.iconsrc = "assets/sale.svg"
        }
      }
      this.itemStatusAction()
    }
  }

  doActvitiyProcess() {
    if (this.bInProcess && this.bActRcvd) {
      this.likeIcon = this.item.activity == null ? "favorite_border" : "favorite" ;
    }
  }
  doProcess() {
    this.doBidProcess()
    this.doSaleProcess()
    this.doActvitiyProcess()
  }

  itemStatusAction() {

    this.cartTitle = this.item.detail_id
    // console.log(this.item)
    switch (this.itemStatus) {
      case ItemStatus.OnSale :
        this.cartTitle = this.item.detail_id
        this.priceToShow =  this.item.price
        this.showBuy = true
        this.showBid = false;
        break ;
      case ItemStatus.Owned :
        this.cartTitle = this.cartTitle = this.item.detail_id + " - " + this.owner
        this.priceToShow = this.bidhigh
        this.showBid = this.isMyItem ? false : true
        this.showBuy = false
        this.showBidPrice = false
        // this.priceToShow = 500
        // this.showBuy =  true
        // this.showBid = false
        break
      case ItemStatus.OwnerSale :
        this.cartTitle = this.item.detail_id + " - " + this.owner
        this.priceToShow = this.item.sale[0].price
        this.showBuy = this.isMyItem ? false : true
        this.showBid = false;
        break ;
      default :
        this.cartTitle = "xxx"
        this.priceToShow =  this.item.price
        this.showBuy = true
        break ;
    }
    this.bShowTitle = true
    this.btcValue = (this.priceToShow / Utils.getBTCRate()).toFixed(7).toString()

  }

  openLogin() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    this.dialog.open(ModalloginComponent,{
      panelClass: 'dialog-container-custom'
    });
  }
  buyClicked() {
    if (this.getLoggedInUserId() == null) {
      this.openLogin() ;
      return
    }
    this.buyBtn = true;
    this.router.navigate(['cart'], {state: this.item})
  }

  getBidRange() {
    if (this.item.bids != null){
      this.bidObj = Utils.getBidRange(this.item.bids, this.getLoggedInUserId())
      this.bidlow = this.bidObj.low
      this.bidhigh = this.bidObj.high
    }
  }

  bidMore() {
    if (this.bidPrice != this.bidObj.amnt ) {
      this.isBidMore = true
    }
  }
  bidClicked() {
    if (this.getLoggedInUserId() == null) {
      this.openLogin();
      return
    }
    this.bidNow = true;
    try {
      let obj = {item_id: this.item.detail_id , bid_price : this.bidPrice} ;
      obj['bid_json'] = JSON.stringify(obj) ;
      this.orderService.bid(obj).subscribe(
        data => {
          alert("Successfully placed the bid")
          this.bidNow = false
          this.showBidHigh = true;
        }
      );
    } catch (e) {
      alert("error!!!")
      this.bidNow = false
      this.handleExcception(e);
    }
  }

  likeClicked() {
    if (this.likeIcon == "favorite")
      return this.like--,this.likeIcon = "favorite_border";
    try {
      let obj = {id: this.item.detail_id , activity_type : "LIKE"} ;
      obj['activity_json'] = JSON.stringify(obj) ;
      this.cartService.like(obj).subscribe(
        data => {
          this.like++;
          this.likeIcon = "favorite"
        }
      );
    } catch (e) {
      alert("error!!!")
      this.handleExcception(e);
    }
  }

  showDetail() {
    let obj = {item: this.item , bidHigh: this.bidPrice}
    this.router.navigate(['detail'], { state: obj });
  }

  traits(item) {
    let message = new Message(item, "traits");
    this.itemMsgService.changeMessage(message);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    if(!this.isMob) {
      dialogConfig.height = "100vh";
      dialogConfig.width = "60vw";
    }
    this.dialog.open(TraitsComponent, dialogConfig);
  }

  openDownloadImage() {
    let obj = {
      item:this.item
    }
    this.router.navigate(['download'],{ state : obj })
  }
}
