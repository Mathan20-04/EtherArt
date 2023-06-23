import { Injectable } from '@angular/core';
import {BaseService} from "./base.service";
import {ApiService} from "./api.service";
import {DataService} from "./data.service";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {AppConstants} from "../utils/Constants";

@Injectable({
  providedIn: 'root'
})
export class PayoutService extends BaseService{

  private urlGetBankList = 'main/bank/get-list';
  private urlGetPayoutStatus = 'main/payout-request/status';
  private urlAddUserPayoutMethod = 'main/payment-method/add';
  private urlAddUserStripe = 'main/payment-method/addStripe';
  private urlUpdateUserPayoutMethod = 'main/payment-method/update';
  private urlGetUserPaymentMethod = 'main/payment-method/get-list-object';
  private urlAddPayoutReq = 'main/payout-request/add';
  private urlUpdatePayoutReq = 'main/payout-request/update';
  private urlGetPayoutReqCustomer = 'main/payout-request/get-list-object-page';
  private urlGetPayoutReqAdmin = 'main/payout-request/ad/get-list-object-page';

  constructor(apiService: ApiService, dataService: DataService) {
    super(apiService,dataService);
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
    return 'payout';
  }

  getBankList(params): Observable<any> {
    return this.getListCommon(this.urlGetBankList, params, true)
      .pipe(
        map(data => {
          return data;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  getPayoutStatus(params): Observable<any> {
    return this.getListCommon(this.urlGetPayoutStatus, params, true)
      .pipe(
        map(data => {
          return data;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }


  addUserPayoutMethod(params: any) : Observable<any> {
    return this.postCommon(this.urlAddUserPayoutMethod,params,true)
      .pipe(
        map(data => {
          return data ;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  addUserStripe(params: any) : Observable<any> {
    return this.postCommon(this.urlAddUserStripe,params,true)
      .pipe(
        map(data => {
          return data ;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  updateUserPayoutMethod(params: any) : Observable<any> {
    return this.postCommon(this.urlUpdateUserPayoutMethod,params,true)
      .pipe(
        map(data => {
          return data ;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  getUserPaymentMethod(params): Observable<any> {
    return this.getListCommon(this.urlGetUserPaymentMethod, params, true)
      .pipe(
        map(data => {
          return data;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  addPayoutRequest(params: any) : Observable<any> {
    return this.postCommon(this.urlAddPayoutReq,params,true)
      .pipe(
        map(data => {
          return data ;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  updatePayoutRequest(params: any) : Observable<any> {
    return this.postCommon(this.urlUpdatePayoutReq,params,true)
      .pipe(
        map(data => {
          return data ;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  getPayoutRequestCustomer(params): Observable<any> {
    return this.getListCommon(this.urlGetPayoutReqCustomer, params, true)
      .pipe(
        map(data => {
          return data;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  getPayoutRequestAdmin(params): Observable<any> {
    return this.getListCommon(this.urlGetPayoutReqAdmin, params, true)
      .pipe(
        map(data => {
          return data;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

}
