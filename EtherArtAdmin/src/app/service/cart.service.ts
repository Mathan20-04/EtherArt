import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {ApiService} from './api.service';
import {DataService} from './data.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService extends BaseService {

  private urlAdd = 'main/cart/add';
  private urlRemove = 'main/cart/remove-item';
  private urlGet = 'main/cart/get';
  private urlGetTrans = 'main/order/collections';
  private urlLike = 'main/item-activity/add'

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
          console.log(data);
          return data;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  like(params: any): Observable<any> {
    return this.postCommon(this.urlLike, params,true)
      .pipe(
        map(data => {
          console.log(data);
          return data;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

}
