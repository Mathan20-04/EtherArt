import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {ApiService} from './api.service';
import {DataService} from './data.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WalletService extends BaseService {

  private urlGet = 'main/wallet/get';
  private urlGetTrans = 'main/wallet/detail';

  constructor(apiService: ApiService, dataService: DataService) {
    super(apiService, dataService);
  }

  objectParentKey(): string {
    return '';
  }

  objectPrimaryKey(): string {
    return '' ;
  }

  isCacheable(): boolean {
    return false;
  }

  objectKey(): string {
    return 'cart';
  }

  getMyWallet(params: any): Observable<any> {
    return this.getListCommon(this.urlGet, params,true)
      .pipe(
        map(data => {
          // console.log("wallet" + data);
          return data;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  getWalletTrans(params: any): Observable<any> {
    return this.getListCommon(this.urlGetTrans, params,true)
      .pipe(
        map(data => {
          // console.log("wallet trans" + data);
          return data;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }
}
