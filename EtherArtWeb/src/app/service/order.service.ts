import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {ApiService} from './api.service';
import {DataService} from './data.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseService {

  private urlAdd = 'main/order/checkout-session'; // add
  private urlConfirm = 'main/order/confirm'; // confirm order
  private urlBid = 'main/bid/add'; // bid for an item
  private urlBidGet = 'main/bid/get-list-object-page';
  private urlSale = 'main/sale/add'; // sale
  private urlGetTrans = 'main/order/get-list-object-page'; // actual purchases
  private urlGetPurchase = 'main/order/get-list-object-page'; // actual orders
  private urlGetSale = 'main/collection/my-sales'; // my sales
  private urlGetCollWisePurchase = 'main/order/collections'; // collection wise item purchased
  private urlPause = 'main/collection/item/action' ; // pause the sale
  private urlGetSaleById = 'main/sale/items-sale';
  private urlGetAvailability = 'main/order/item/is-available'

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

  add(params: any): Observable<any> {
    return this.postCommon(this.urlAdd, params,true)
      .pipe(
        map(data => {
          return data;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  checkAvialble(params: any) {
    return this.getListCommon(this.urlGetAvailability, params,false)
      .pipe(
        map(data => {
          return data;
        }),
        catchError(ex => {
          // console.log(ex.message)
          return throwError(ex.message);
        })
      );
  }
  confirm(params: any): Observable<any> {
    return this.postCommon(this.urlConfirm, params,false)
      .pipe(
        map(data => {
          return data;
        }),
        catchError(ex => {
          // console.log(ex.message)
          return throwError(ex.message);
        })
      );
  }

  bid(params: any) : Observable<any> {
    return this.postCommon(this.urlBid,params,true)
      .pipe(
        map(data => {
          return data;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  sale(params: any) : Observable<any> {
    return this.postCommon(this.urlSale,params,true)
      .pipe(
        map(data => {
          return data;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  myTransaction(params: any) : Observable<any> {
    return this.getListCommon(this.urlGetTrans,params,true)
    .pipe(
      map(data => {
        return data;
      }),
      catchError(ex => {
        return throwError(ex);
      })
    );
  }

  myPurchase(params: any) : Observable<any> {
    return this.getListCommon(this.urlGetPurchase,params,true)
    .pipe(
      map(data => {
        return data;
      }),
      catchError(ex => {
        return throwError(ex);
      })
    );
  }

  mySale(params: any) : Observable<any> {
    return this.getListCommon(this.urlGetSale,params,true)
    .pipe(
      map(data => {
        return data;
      }),
      catchError(ex => {
        return throwError(ex);
      })
    );
  }

  myCollectionWisePurchase() : Observable<any> {
    return this.getListCommon(this.urlGetCollWisePurchase,null,true)
    .pipe(
      map(data => {
        return data;
      }),
      catchError(ex => {
        return throwError(ex);
      })
    );
  }

  myBid(params: any) : Observable<any> {
    return this.getListCommon(this.urlBidGet,params,true)
    .pipe(
      map(data => {
        return data;
      }),
      catchError(ex => {
        return throwError(ex);
      })
    );
  }

  pause(params: any) : Observable<any> {
    return this.postCommon(this.urlPause,params,true)
      .pipe(
        map(data => {
          return data;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  getSaleDataById(params: any) : Observable<any> {
    return this.getListCommon(this.urlGetSaleById,params,false)
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
