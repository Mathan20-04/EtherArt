import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {ApiService} from './api.service';
import {DataService} from './data.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppConstants } from '../utils/Constants';

@Injectable({
  providedIn: 'root'
})
export class MyaccountService extends BaseService {

  private url_referrals = 'main/user/my-referrals';
  private url_userupdate = 'main/user/update';
  private url_useremailupdate = 'main/user/update-email';
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
    return 'myaccount';
  }

  getReferrals(params): Observable<any> {
    return this.getListCommon(this.url_referrals, params, true)
      .pipe(
        map(data => {
        return data;
        }),
      catchError(ex => {
        return throwError(ex);
      })
    );
  }

  updateProfile(params: any) : Observable<any> {
    return this.postCommon(this.url_userupdate,params,true)
      .pipe(
        map(data => {
          DataService.setDataInLocal(AppConstants.USER_OBJECT_KEY, JSON.stringify(data));
          return data ;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  updateEmailName(params: any) : Observable<any> {
    return this.postCommon(this.url_useremailupdate,params,true)
      .pipe(
        map(data => {
          return data ;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }
}

