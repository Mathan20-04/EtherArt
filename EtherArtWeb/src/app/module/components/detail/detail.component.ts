import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BaseComponent } from '../base.component';
import { CartService } from "../../../service/cart.service";
import { CollectionService } from 'src/app/service/collection.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalloginComponent } from '../modallogin/modallogin.component';
import {Message} from "../../../utils/message";
import {TraitsComponent} from "../traits/traits.component";
import {ItemmsgService} from "../../../service/itemmsg.service";
import {PreviewComponent} from "../preview/preview.component";
import { OrderService } from 'src/app/service/order.service';
import { Utils } from 'src/app/utils/Utils';
import { ThisReceiver } from '@angular/compiler';
import { DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent extends BaseComponent implements OnInit {

  public item = null;
  public url ="";
  public bIsShowing = false ;
  private detail_id : number ; // coming from share
  public collection_name = ""
  public trending = "trending";
  public likeIcon = "";
  public like = 0;
  public btcValue ;
  public hashCode = "";
  public showBid = false;
  public priceToShow = 0;
  public showBuy = true;
  public urlAuthenticity = "https://etherscan.io/";
  public urlReferral:any;
  public shareOnWhatsappApp ;
  public itemid = ""
  public owner = ""
  public description : any;
  public collection : any;
  public buyBtnDisable = false;
  // requires if direct access to detail on link
  public bShare = false
  public bids: Array<any> = [];
  public sales: Array<any> = [];
  public activities: Array<any> = [];
  public allFetchCount = 0;
  public bidNow = false;
  public bidPrice ;
  public bidhigh;
  public bidlow;

  constructor(
    public dialog: MatDialog,
    public cartService: CartService,
    public collectionService : CollectionService,
    public orderService: OrderService,
    public router : Router,
    private arouter : ActivatedRoute,
    public itemMsgService:ItemmsgService,
    public sanitizer :DomSanitizer
    ) {
      super();
      if (this.router.getCurrentNavigation().extras.state != undefined) {
        let obj = this.router.getCurrentNavigation().extras.state;
        this.item= obj.item ;
        this.bidPrice = obj.bidHigh
      }
  }

  ngOnInit(): void {
    document.body.scrollTop = 0;
    if (this.item == undefined || this.item == null) { // coming from share click of users
      this.bShare = true
      this.arouter.queryParams.subscribe(param =>{
        this.detail_id=param.detail_id;
        if (this.detail_id == undefined || this.detail_id == null) {
          this.router.navigate(['dashboard'])
          return
        }
        this.getItem()
      });
    } else  { // data coming from the user click on the card
      // this.getBidRange()
      this.bind()
      this.bindRef()
    }
    // this.bidPrice = this.item.price
    // this.bidlow =  this.bidhigh = this.item.price
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
  }

  bindRef() {
    this.urlReferral =   this.urlReferral = "I am so excited to share this rare digital collectable I found on EtherArt, \n " + this.getBaseURL() +  "/detail?detail_id=" + this.item.detail_id+" \n EtherArt has just launched a very special collection to celebrate the 75th Anniversary of India’s Independence and India’s victories, Join us now to celebrate this special occasion."
    this.shareOnWhatsappApp = "whatsapp://send?text=I am so excited to share this rare digital collectable I found on EtherArt, \n "+ this.getBaseURL() + "/detail?detail_id="+this.item.detail_id+" \n EtherArt has just launched a very special collection to celebrate the 75th Anniversary of India’s Independence and India’s victories, Join us now to celebrate this special occasion."
    this.shareOnWhatsappApp = this.sanitizer.bypassSecurityTrustUrl(this.shareOnWhatsappApp);
  }
  // open Login on click of Buy if not logged in
  openLogin() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    const modalDialog = this.dialog.open(ModalloginComponent,{
      panelClass: 'dialog-container-custom'
    });
  }

  buyClicked() {
    if (this.getLoggedInUserId() == null) {
      this.openLogin() ;
      return
    }
    this.buyBtnDisable = true;
    this.router.navigate(['cart'], {state: this.item})
    this.buyBtnDisable = false;
  }

  bidClicked() {
    if (this.getLoggedInUserId() == null) {
      this.openLogin() ;
      return
    }
    this.bidNow = true
    try {
      let obj = {item_id: this.item.detail_id , bid_price : this.bidPrice} ;
      obj['bid_json'] = JSON.stringify(obj) ;
      this.orderService.bid(obj).subscribe(
        data => {
          alert("Successfully placed the bid")
          this.bidNow = false
        }
      );
    } catch (e) {
      alert("error!!!")
      this.bidNow = false
      this.handleExcception(e);
    }
  }

  getItem() {
    let input = {
      id: this.detail_id
    };
    try {
      this.collectionService.getItemByID(input).subscribe(
        data => {
          this.item =  data
          this.doPostFetch()
        }
      );
    } catch (e) {
      alert("error!!!")
      this.handleExcception(e);
    }
    return;
  }

  doPostFetch() {
    this.getBids()
    this.getSales()
    this.getActivities()
  }

  getBids() {
    let obj = {"ids" : this.item.detail_id}
    try {
      this.collectionService.getItemBids(obj).subscribe(
        data => {
          this.bids = data
          this.embedBids()
          this.getBidRange()
          this.allFetchCount ++
          this.preBind()
        }
      );
    } catch (e) {
      this.handleExcception(e);
    }
  }

  embedBids() {
    if (this.bids != null) {
      this.item.bids = []
      this.bids.forEach(element => {
        this.item.bids.push(element)
      });
    }
  }

  getBidRange() {
    if (this.item.bids != null){
      let bidObj = Utils.getBidRange(this.item.bids, this.getLoggedInUserId())
      if (bidObj.high >this.item.purchased_price ) {
        this.bidPrice = bidObj.high
        this.bidhigh = this.bidPrice
      } else {
        this.bidPrice = this.item.purchased_price + 50
        this.bidhigh = this.bidPrice
      }
    } else {
      this.bidPrice = this.item.purchased_price + 50
    }
  }

  getSales() {
    let obj = {"ids" : this.item.detail_id}
    try {
      this.orderService.getSaleDataById(obj).subscribe(
        data => {
          this.sales = data
          this.embedSales()
          this.allFetchCount ++
          this.preBind()
        }
      );
    } catch (e) {
      this.handleExcception(e);
    }
  }

  embedSales() {
    if (this.sales != null) {
      this.item.sale = []
      this.sales.forEach(element => {
          this.item.sale.push(element)
      });
    }
  }

  getActivities() {
    let obj = {"ids" : this.item.detail_id}
    try {
      this.cartService.getActivityDataById(obj).subscribe(
        data => {
          this.activities = data
          this.embedActivities()
          this.allFetchCount ++
          this.preBind()
        }
      );
    } catch (e) {
      this.handleExcception(e);
    }
  }

  embedActivities() {
    this.item.activity = []
    if (this.activities != null) {
      this.activities.forEach(element => {
        this.item.activity.push(element)
      });
    }
  }

  preBind() {
    if (this.allFetchCount == 3) {
      this.bind()
      this.bindRef()
    }
  }

  bind() {
    document.body.scrollTop = 0
    if (this.item != undefined && this.item != null ) {
      this.collection = Utils.getCollectionForNFT(this.item)
      if (this.collection != null) {
        this.description = this.collection.description == null ? "not available" : this.sanitizer.bypassSecurityTrustHtml(this.collection.description);
      }
      if (this.item.status == "ONBID") {
        this.showBid = true
        this.showBuy = false
        this.owner = this.item.owner_id == this.getLoggedInUserId()  ? "Me" : this.item.owner_id.toString(16)
        if (this.owner == "Me") {
          this.showBid = false
          this.showBuy = false
        }
      } else {
        this.showBid = false
        this.showBuy = true
        this.priceToShow = this.item.owner_id == null ? this.item.price : this.item.sale[0].price
      }


      this.collection_name = this.collection.title == null ? "" : this.collection.title
      this.likeIcon = this.item.activity == null ? "favorite_border" : "favorite" ;
      this.like = parseInt(this.item.likes)

      this.url = this.item.url + "&s=700"
      this.itemid = this.item.detail_id
      if (this.item.owner_id == null)
        this.owner = "EtherArt"
      else
        this.owner = this.item.owner_id == this.getLoggedInUserId()  ? "Me" : this.item.owner_id.toString(16)

      // if (this.item.owner_id == null) {
      //   this.item.url = "assets/mystery.png"
      //   this.url = this.item.url
      // } else {
      //   this.itemid = this.item.detail_id
      //   this.owner = this.item.owner_id == this.getLoggedInUserId()  ? "Me" : this.item.owner_id.toString(16)
      // }
      this.btcValue = (this.priceToShow / Utils.getBTCRate()).toFixed(7).toString()
    }
  }

  onMove() {
    this.bIsShowing = true ;
  }

  onMouseOut() {
    this.bIsShowing = false ;
  }

  preview(item) {
    let message = new Message(item, "preview");
    this.itemMsgService.changeMessage(message);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    if(!this.isMob) {
      dialogConfig.height = "100vh";
      dialogConfig.width = "100vw";
    }
    if(this.isMob) {
      dialogConfig.height = "100vh";
      dialogConfig.width = "100vw";
    }
    this.dialog.open(PreviewComponent, dialogConfig);
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
  showDateYYYY(dt,char) {
    return Utils.convertDBDateShortyyyymmdd(dt,char)
  }
}
