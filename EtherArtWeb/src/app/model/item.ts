import { mixinInitialized } from "@angular/material/core"
import { ItemStatus } from "../utils/Constants"
import { Utils } from "../utils/Utils"
import { Bid } from "./bid"

export class Item {

  private itemObj : any
  private userid : any
  private urlAuthenticity = "https://rinkeby.etherscan.io/tx/"

  constructor(item: any, userid) {
    this.itemObj = item
    this.userid = userid
    this.initialize()
  }

  initialize() {
    // process itemObj and set property
    this.title = this.itemObj.title
    this._desc = this.itemObj.description
    // this._date = Utils.convertDBDateShort(this.itemObj.,'/')
    this._bidlow = this._bidhigh = this.itemObj.price
    this._likeIconSrc = this.itemObj.activity == null ? "favorite_border" : "favorite" ;
    this.getBidRange()
    this._hashCode = this.itemObj.txn_hash
  }

  getBidRange() {
    if (this.itemObj.bids != null){
      this._bids = this.itemObj.bids
      let bidObj = Utils.getBidRange(this.itemObj.bids, this.userid)
      this._bidlow = bidObj.low
      this._bidhigh = bidObj.high
    }
  }

  getItemStatus() {
    if (this.itemObj.owner_id != null) {
      this.isMyItem =  this.itemObj.owner_id == this.userid  ? true : false
      if (this.itemObj.sale == null) {
        this.owner = this.isMyItem ?  "Me" : this.itemObj.owner_id.toString(16)
        this._status = ItemStatus.Owned
        this.bidPrice = this.bidhigh > this.itemObj.price ? this.bidhigh : this.itemObj.price + 50
        this._iconSrc = "assets/bid.svg"
      } else {
        // this.status = "Owner Sale"
        this.owner = this.isMyItem ?  "Me" : this.itemObj.owner_id.toString(16)
        this._status = ItemStatus.OwnerSale
        this._iconSrc = "assets/sale.svg"
      }
    }
  }

  private _date: string
  public get date(): string {
    return this._date
  }
  public set date(value: string) {
    this._date = Utils.convertDBDateShort(value,'/')
  }

  private _title: string
  public get title(): string {
    return this._title
  }
  public set title(value: string) {
    this._title = value
  }
  private _desc: string
  public get desc(): string {
    return this._desc
  }
  public set desc(value: string) {
    this._desc = value
  }
  private _status: number
  public get status(): number {
    return this._status
  }
  public set status(value: number) {
    this._status = value
  }
  private _collectionName: string
  public get collectionName(): string {
    return this._collectionName
  }
  public set collectionName(value: string) {
    this._collectionName = value
  }
  private _itemid: number
  public get itemid(): number {
    return this._itemid
  }
  public set itemid(value: number) {
    this._itemid = value
  }
  private _owner: number
  public get owner(): number {
    return this._owner
  }
  public set owner(value: number) {
    this._owner = value
  }
  private _iconSrc: string
  public get iconSrc(): string {
    return this._iconSrc
  }
  public set iconSrc(value: string) {
    this._iconSrc = value
  }
  private _purchasePrice: number
  public get purchasePrice(): number {
    return this._purchasePrice
  }
  public set purchasePrice(value: number) {
    this._purchasePrice = value
  }
  private _bidPrice: number
  public get bidPrice(): number {
    return this._bidPrice
  }
  public set bidPrice(value: number) {
    this._bidPrice = value
  }
  private _askPrice: number
  public get askPrice(): number {
    return this._askPrice
  }
  public set askPrice(value: number) {
    this._askPrice = value
  }
  private _bidlow: number
  public get bidLow(): number {
    return this._bidlow
  }
  public set bidLow(value: number) {
    this._bidlow = value
  }
  private _bidhigh: number
  public get bidhigh(): number {
    return this._bidhigh
  }
  public set bidhigh(value: number) {
    this._bidhigh = value
  }
  private _numLikes: number
  public get numLikes(): number {
    return this._numLikes
  }
  public set numLikes(value: number) {
    this._numLikes = value
  }
  private _likeIconSrc: string
  public get likeIconSrc(): string {
    return this._likeIconSrc
  }
  public set likeIconSrc(value: string) {
    this._likeIconSrc = value
  }
  private _bids: [Bid]
  public get bids(): [Bid] {
    return this._bids
  }
  public set bids(value: [Bid]) {
    this._bids = value
  }
  private _activity: []
  public get activity(): [] {
    return this._activity
  }
  public set activity(value: []) {
    this._activity = value
  }

  private _isMyItem: boolean
  public get isMyItem(): boolean {
    return this._isMyItem
  }
  public set isMyItem(value: boolean) {
    this._isMyItem = value
  }

  public get urlAuthentity() {
    return this.urlAuthenticity + this._hashCode
  }

  private _hashCode : string
  public get hashCode(): string {
    return this._hashCode
  }
  public set hashCode(value: string) {
    this._hashCode = value
  }
}
