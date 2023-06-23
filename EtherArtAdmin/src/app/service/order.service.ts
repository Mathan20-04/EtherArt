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
          // console.log("order add: " + data);
          return data;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  confirm(params: any): Observable<any> {
    return this.postCommon(this.urlConfirm, params,true)
      .pipe(
        map(data => {
          // console.log("order add: " + data);
          return data;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  bid(params: any) : Observable<any> {
    return this.postCommon(this.urlBid,params,true)
      .pipe(
        map(data => {
          // console.log("order add: " + data);
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
          // console.log("order put on sale: " + data);
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
        // console.log("My orders" + data);
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
        // console.log("My orders" + data);
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
        // console.log("My sales" + data);
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
        // console.log("collection wise item count: " + data);
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
        // console.log("My Bid" + data);
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
          // console.log("item paused : " + data);
          return data;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

}
