import {Injectable} from '@angular/core';
import {BaseService} from "./base.service";
import {ApiService} from "./api.service";
import {DataService} from "./data.service";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {AppConstants} from "../utils/Constants";

@Injectable({
    providedIn: 'root'
})
export class PayoutService extends BaseService {

    private urlGetAllPayoutRequest = 'main/payout-request/ad/get-list-object-page';
    private urlUpdatePayoutRequest = 'main/payout-request/update'
    // private urlTransferPayoutRequest = 'main/payout-request/transfer'
    private urlGetPayoutStatus = 'main/payout-request/status';
    private urlGetINRBalance = 'main/payout-request/balanceINR';
    private urlGetSale = 'main/collection/my-sales'; // my sales

    constructor(apiService: ApiService, dataService: DataService) {
        super(apiService, dataService);
    }

    objectParentKey(): string {
        return '';
    }

    objectPrimaryKey(): string {
        return '';
    }

    isCacheable(): boolean {
        return false;
    }

    objectKey(): string {
        return 'trend';
    }

    getAllPayoutRequest(params): Observable<any> {
        return this.getListCommon(this.urlGetAllPayoutRequest, params, true)
            .pipe(
                map(data => {
                    return data;
                }),
                catchError(ex => {
                    return throwError(ex);
                })
            );
    }

    updatePayoutRequest(params: any): Observable<any> {
        return this.postCommon(this.urlUpdatePayoutRequest, params, true)
            .pipe(
                map(data => {
                    return data;
                }),
                catchError(ex => {
                    return throwError(ex);
                })
            );
    }

    // transferPayoutRequest(params: any): Observable<any> {
    //     return this.postCommon(this.urlTransferPayoutRequest, params, true)
    //         .pipe(
    //             map(data => {
    //                 DataService.setDataInLocal(AppConstants.USER_OBJECT_KEY, JSON.stringify(data));
    //                 return data;
    //             }),
    //             catchError(ex => {
    //                 return throwError(ex);
    //             })
    //         );
    // }

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

    getINRBalance(params): Observable<any> {
        return this.getListCommon(this.urlGetINRBalance, params, true)
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
}
