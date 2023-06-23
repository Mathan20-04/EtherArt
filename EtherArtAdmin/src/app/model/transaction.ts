export class Transaction {
  private _orderID: number;
  public get orderID(): number {
    return this._orderID;
  }
  public set orderID(value: number) {
    this._orderID = value;
  }
  private _orderDate: string;
  public get orderDate(): string {
    return this._orderDate;
  }
  public set orderDate(value: string) {
    this._orderDate = value;
  }
  private _itemID: number;
  public get itemID(): number {
    return this._itemID;
  }
  public set itemID(value: number) {
    this._itemID = value;
  }
  private _itemURL: string;
  public get itemURL(): string {
    return this._itemURL;
  }
  public set itemURL(value: string) {
    this._itemURL = value;
  }
  private _price: number;
  public get price(): number {
    return this._price;
  }
  public set price(value: number) {
    this._price = value;
  }
  private _cashback: number;
  public get cashback(): number {
    return this._cashback;
  }
  public set cashback(value: number) {
    this._cashback = value;
  }
  private _payed: number;
  public get payed(): number {
    return this._payed;
  }
  public set payed(value: number) {
    this._payed = value;
  }
}
