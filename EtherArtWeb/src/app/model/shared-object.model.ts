export class SharedObject {

  private _data: any | null;
  private _action: any | null;
  private _configuration: any | null;


  get data(): any | null {
    return this._data;
  }

  set data(value: any | null) {
    this._data = value;
  }

  get action(): any | null {
    return this._action;
  }

  set action(value: any | null) {
    this._action = value;
  }

  get configuration(): any | null {
    return this._configuration;
  }

  set configuration(value: any | null) {
    this._configuration = value;
  }
}
