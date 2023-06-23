import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppConstants } from '../utils/Constants';
import { ApiService } from './api.service';
import { BaseService } from './base.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService {

  private url_getReportConfiguration = 'main/report/get-list-object';
  private url_getReportDetails = 'main/report/report'
  private url_getHelperData = 'main/report/helper-data'
  
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
    return 'report';
  }

  getReportConfiguration(params): Observable<any> {
    return this.getListCommon(this.url_getReportConfiguration, params, true,false)
      .pipe(
        map(data => {
          DataService.setDataInLocal(AppConstants.REPORT_LIST, JSON.stringify(data));
          return data;
        }),
      catchError(ex => {
        return throwError(ex);
      })
    );
  }

  getReportDetails(params): Observable<any> {
    return this.getListCommon(this.url_getReportDetails, params, true,false)
      .pipe(
        map(data => {
          return data;
        }),
      catchError(ex => {
        return throwError(ex);
      })
    );
  }

  getDropDowns(params): Observable<any> {
    console.log(params)
    return this.getListCommon(this.url_getHelperData, params,true,false)
      .pipe(
        map(data => {
          console.log(data)
        return data;
        }),
      catchError(ex => {
        return throwError(ex);
      })
    );
  }
}
