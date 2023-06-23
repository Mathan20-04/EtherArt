import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {ApiService} from './api.service';
import {DataService} from './data.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeneralService extends BaseService {

  private url_getTrending = 'main/collection/trending';
  private url_getRecent = 'main/collection/recent';
  private urlCryptoHist = '/main/crypto-rates/get-list-object'
  private urlUserList = 'main/user/report/users'
  private urlTransList = 'main/user/report/user-referrals'
  private urlSalesList = 'main/user/report/sale'
  private urlGetConfiguration = 'main/collection-conf/get-list-object'
  private urlGetGeo = 'main/state/state-city'
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
    return 'trend';
  }

  getTrending(params): Observable<any> {
    return this.getListCommon(this.url_getTrending, params, true)
      .pipe(
        map(data => {
        return data;
        }),
      catchError(ex => {
        return throwError(ex);
      })
    );
  }

  getRecent(params): Observable<any> {
    return this.getListCommon(this.url_getRecent, params, true)
      .pipe(
        map(data => {
        return data;
        }),
      catchError(ex => {
        return throwError(ex);
      })
    );
  }

  getCryptoHistoricalData(params) : Observable<any> {
    return this.getListCommon(this.urlCryptoHist, params, true)
      .pipe(
        map(data => {
        return data;
        }),
      catchError(ex => {
        return throwError(ex);
      })
    );
  }

  getSalesReport(params) : Observable<any> {
    return this.getListCommon(this.urlSalesList, params, true)
      .pipe(
        map(data => {
        return data;
        }),
      catchError(ex => {
        return throwError(ex);
      })
    );
  }

  getUserList(params): Observable<any> {
    return this.getListCommon(this.urlUserList, params, true)
      .pipe(
        map(data => {
        return data;
        }),
      catchError(ex => {
        return throwError(ex);
      })
    );
  }

  getTransList(params): Observable<any> {
    return this.getListCommon(this.urlTransList, params, true)
      .pipe(
        map(data => {
        return data;
        }),
      catchError(ex => {
        return throwError(ex);
      })
    );
  }

  getConfiguraton(params): Observable<any> {
    return this.getListCommon(this.urlGetConfiguration, params, true)
      .pipe(
        map(data => {
        return data;
        }),
      catchError(ex => {
        return throwError(ex);
      })
    );
  }

  getGeoData(params) : Observable<any> {
    return this.getListCommon(this.urlGetGeo, params, false)
      .pipe(
        map(data => {
        return data;
        }),
      catchError(ex => {
        return throwError(ex);
      })
    );
  }

  getImageFromURL(url): Observable<any> {
    let param ={}
    return this.getListCommon(url,param,true,false,true,"blob")
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
