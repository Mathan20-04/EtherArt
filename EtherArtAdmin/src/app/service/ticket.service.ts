import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {ApiService} from './api.service';
import {DataService} from './data.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TicketService extends BaseService {

  private urlGetTicketTypes = 'main/ticket/types'; // get ticket types
  private urlGetTicketStatus = 'main/ticket/status'; // ticket status
  private urlAddTicket = 'main/ticket/add'; // add new ticket
  private urlUpdateTicket = 'main/ticket/update'; // update ticket
  private urlGetTickets = 'main/ticket/get-list-object-page'; // searchable get tickets paginated
  private urlAddTicketActivity = 'main/ticket-activity/add'; //add ticket activity

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
    return 'ticket';
  }

  updateTicket(params: any): Observable<any> {
    return this.postCommon(this.urlUpdateTicket, params,true)
        .pipe(
            map(data => {
              return data;
            }),
            catchError(ex => {
              return throwError(ex);
            })
        );
  }

  getTicketTypes(params: any) : Observable<any> {
    return this.getListCommon(this.urlGetTicketTypes,params,false,true)
        .pipe(
            map(data => {
              return data;
            }),
            catchError(ex => {
              return throwError(ex);
            })
        );
  }

  getTicketStatus(params: any) : Observable<any> {
    return this.getListCommon(this.urlGetTicketStatus,params,true)
        .pipe(
            map(data => {
              return data;
            }),
            catchError(ex => {
              return throwError(ex);
            })
        );
  }

  getTickets(params: any) : Observable<any> {
    return this.getListCommon(this.urlGetTickets,params,true)
        .pipe(
            map(data => {
              return data;
            }),
            catchError(ex => {
              return throwError(ex);
            })
        );
  }

  addTicketActivity(params: any) : Observable<any> {
    return this.postCommon(this.urlAddTicketActivity,params,true)
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
