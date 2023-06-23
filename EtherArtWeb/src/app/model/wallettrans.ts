export class Wallettrans {
  private _date: string;
  public get date(): string {
    return this._date;
  }
  public set date(value: string) {
    this._date = value;
  }
  private _desc: string;
  public get desc(): string {
    return this._desc;
  }
  public set desc(value: string) {
    this._desc = value;
  }
  private _cramount: number;
  public get cramount(): number {
    return this._cramount;
  }
  public set cramount(value: number) {
    this._cramount = value;
  }
  private _dramount: number;
  public get dramount(): number {
    return this._dramount;
  }
  public set dramount(value: number) {
    this._dramount = value;
  }
  private _balreward: number;
  public get balreward(): number {
    return this._balreward;
  }
  public set balreward(value: number) {
    this._balreward = value;
  }
  private _balcash: number;
  public get balcash(): number {
    return this._balcash;
  }
  public set balcash(value: number) {
    this._balcash = value;
  }
}
