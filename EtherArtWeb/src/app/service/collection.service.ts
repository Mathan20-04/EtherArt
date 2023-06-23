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
export class CollectionService extends BaseService {

  private urlGetCollection = 'main/collection/get-list-object-page';
  private urlGetItemInCollection = 'main/collection/items-get-list-object-page';
  private urlGetMyFavourites = 'main/collection/favorites';
  private urlGetMyItems = 'main/collection/my-items';
  private urlGetItemByID = 'main/collection/item/get';
  private urlGetItemRatity = "main/collection/item/variations";
  private urlGetItemBids = "main/bid/current-bids";
  private urlGetImageParts = "main/image/get";
  private urlGetPrimaryBanner = "main/collection/item/primary";
  private urlGetMysteryItems = "main/collection/item/mystery";
  private urlGetListOfItemsInCollection = "main/collection/items-get-list-object-page";
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
    return true;
  }

  objectKey(): string {
    return 'collection';
  }

  getCollection(params): Observable<any> {
    return this.getListCommon(this.urlGetCollection, params, false,true)
      .pipe(
        map(data => {
          if(data!=null) {
            DataService.setDataInLocal(AppConstants.COLLECTION_LIST_KEY,JSON.stringify(data.data))
            return data;
          }
        }),
      catchError(ex => {
        return throwError(ex);
      })
    );
  }

  public static getCollectionListCached() {
    return JSON.parse(DataService.getDataFromLocal(AppConstants.COLLECTION_LIST_KEY));
  }

  getItemsInCollection(params): Observable<any> {
    return this.getListCommon(this.urlGetItemInCollection, params,false, false)
      .pipe(
        map(data => {
        return data;
        }),
      catchError(ex => {
        return throwError(ex);
      })
    );
  }

  getFavourites(params): Observable<any> {
    return this.getListCommon(this.urlGetMyFavourites, params,true,false)
      .pipe(
        map(data => {
        return data;
        }),
      catchError(ex => {
        return throwError(ex);
      })
    );
  }

  getMyItems(params): Observable<any> {
    return this.getListCommon(this.urlGetMyItems, params, true, false)
      .pipe(
        map(data => {
        return data;
        }),
      catchError(ex => {
        return throwError(ex);
      })
    );
  }

  getItemByID(params): Observable<any> {
    return this.getListCommon(this.urlGetItemByID, params, true, false)
      .pipe(
        map(data => {
        return data;
        }),
      catchError(ex => {
        return throwError(ex);
      })
    );
  }

  getItemsRarity(params): Observable<any> {
    return this.getListCommon(
      this.urlGetItemRatity,
      params,
      false,
      false
    ).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }
  getItemBids(params): Observable<any> {
    return this.getListCommon(
      this.urlGetItemBids,
      params,
      false,
      false
    ).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  getPartsAndVariants(params): Observable<any> {
    return this.getListCommon(
      this.urlGetImageParts,
      params,
      false,
      true
    ).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  getPrimaryBanner(params): Observable<any> {
    return this.getListCommon(
      this.urlGetPrimaryBanner,
      params,
      false,
      false
    ).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  getListOfItemsInCollection(params): Observable<any> {
    return this.getListCommon(
      this.urlGetListOfItemsInCollection,
      params,
      false,
      false
    ).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }
  getMysteryItem(params): Observable<any> {
    return this.getListCommon(
      this.urlGetMysteryItems,
      params,
      false,
      false
    ).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }
}

