export class Bid {
  private _date: String;
  public get BDate(): String {
    return this._date;
  }
  public set BDate(value: String) {
    this._date = value;
  }
  private _Item: string;
  public get Item(): string {
    return this._Item;
  }
  public set Item(value: string) {
    this._Item = value;
  }
  private _owner: string;
  public get Owner(): string {
    return this._owner;
  }
  public set Owner(value: string) {
    this._owner = value;
  }
  private _itemURL: string;
  public get itemURL(): string {
    return this._itemURL;
  }
  public set itemURL(value: string) {
    this._itemURL = value;
  }
  private _price: number;
  public get Price(): number {
    return this._price;
  }
  public set Price(value: number) {
    this._price = value;
  }
  private _askprice: string;
  public get AskPrice(): string {
    return this._askprice;
  }
  public set AskPrice(value: string) {
    this._askprice = value;
  }
  private _range: string;
  public get Range(): string {
    return this._range;
  }
  public set Range(value: string) {
    this._range = value;
  }
  private _count: number;
  public get Count(): number {
    return this._count;
  }

  public set Count(value: number) {
    this._count = value
  }
  public set payed(value: number) {
    this._count = value;
  }
}
