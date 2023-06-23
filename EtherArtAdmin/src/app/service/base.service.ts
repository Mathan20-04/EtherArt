import {GeneralException, EtherBaseExcetion} from '../utils/exception';
import {ErrorCodes, ErrorMessages} from '../utils/Constants';
import {DataService} from './data.service';
import {Observable, throwError} from 'rxjs';
import {ApiService} from './api.service';
import {catchError, map} from 'rxjs/operators';
import {AppComponent} from '../app.component';


export abstract class BaseService {

  private apiService: ApiService;
  private dataService: DataService;
  private fileUploadURL = 'main/file/upload';

  protected url: string;

  /*
  * Set it to true if you want to add cookies in request headers by httpClient
  * Default is True
  * */
  protected enableCredentials: boolean;

  /*
  * Set it to true if data needs to be cached in pre<Get,GetList,getListPage>(By using url and parameters)
  * Default is false
  * */
  protected isDataCacheable: boolean;

  /*
  * If the URL is complete URL and callee does not want to append the base url, set this value true in pre<Get,GetList,Add,Update,Delete>
  * */
  protected isCompleteUrl: boolean;

  /*
  * If the response from the server is other than the JSON then  set value for this in pre<Get,GetList,Add,Update,Delete>
  * Ex : blob
  * */
  protected httpResponseType: string;

  protected isModelEnabled: boolean;

  protected _ids: string;

  constructor(apiService: ApiService, dataService: DataService) {
    this.apiService = apiService;
    this.dataService = dataService;

    /*
    * Setting default values for the global properties
    * */
    this.enableCredentials = true;
    this.isDataCacheable = false;
    this.isCompleteUrl = false;
    this.httpResponseType = null;
    this.isModelEnabled = false;
    this._ids = '';
  }

  protected handleException(exception: Error): void | any {
    console.log(exception)
    if (exception instanceof EtherBaseExcetion) {
      throw new GeneralException(exception.message, exception.errorCode, exception.errorObject);
    } else {
      throw new GeneralException(ErrorMessages.INTERNAL_ERROR, ErrorCodes.GENERAL_ERROR, exception);
    }
  }

  abstract isCacheable(): boolean;

  abstract objectKey(): string;

  abstract objectPrimaryKey(): string;

  abstract objectParentKey(): string;

  protected getByIdKey(): string {
    return 'id';
  }

  /**
   * This method is used to invalidate the cache by object ID
   * @param id
   */
  private invalidateCache(id) {
    if (this.isModelEnabled) {
      return;
    }
    if (this.isCacheable()) {
      if (id != "" && id != null) {
        this.dataService.clearCacheByObjectKey(this.objectKey(), this.objectPrimaryKey(), id);
      }
    }
  }

  /**
   * This method is used to invalidate the cache by object,
   * This method internally calls invalidateCache to clear the cache by id
   * @param dataObject
   */
  private invalidateCacheByObject(dataObject) {
    if (dataObject != null) {
      const id = dataObject[this.objectPrimaryKey()];
      if (id != "" && id != null) {
        this.invalidateCache(id);
      }
    }
  }

  /**
   * This function will invalidate whole cache by Object Key
   */
  private invalidateCacheObject() {
    if (this.isCacheable()) {
      this.dataService.clearCache(this.objectKey());
    }
  }

  /**
   * Invalidates cache by key
   * @param key
   */
  protected invalidateCacheByKey(key) {
    if (key != null && key != "") {
      this.inValidateModelInApp();
      this.dataService.clearCache(key);
    }
  }

  protected getModelFromApp() {
    if (this.isModelEnabled) {
      return;
    } else {
      return null;
    }
  }

  protected setModelInApp(listModel) {
    if (this.isModelEnabled) {
      return
    }
  }

  protected inValidateModelInApp() {
    if (this.isModelEnabled) {
      return
    }
  }

  protected getListByIdsKey(): string {
    return 'ids';
  }

  /**
   * Override this method in the child class
   * set the url for the request
   * set the enableCredentials for the request
   * this will be used in getById
   */
  protected preGetById() {
  }

  /**
   * This methos hsould be used to get the data by id always
   * which always returns the single object
   * If the model is cacheable then it gets the data from cache and if data not in the cacche then it gets the data
   * from the sever and puts in the cahce
   *
   * @param id Id of the object
   * @returns the actual model or json
   */
  getById(id): Observable<any> {
    var paramsObject = {};
    paramsObject[this.getByIdKey()] = id;

    if (this.isCacheable()) {
      /* Get data from the cache */
      var data = this.dataService.getCached(this.objectKey(), this.objectPrimaryKey(), id);
      if (data != null) {
        return Observable.create(observer => {
          observer.next(this.postGetById(data['data'][0]));
          observer.complete();
        });
      }
    }

    this.preGetById();

    return this.apiService.getData(this.url, paramsObject, this.enableCredentials, this.isCompleteUrl, this.httpResponseType)
      .pipe(
        map(response => {

          if (this.isCacheable()) {
            /* Put data in cache */
            var respList = [];
            respList.push(response);
            this.dataService.putInCache(this.objectKey(), respList, this.objectPrimaryKey());
          }

          return this.postGetById(response);
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  /**
   * Override this method in the child class to convert json to model and return the model
   * @param responseJson
   */
  protected postGetById(responseJson) {
    return responseJson;
  }


  /**
   * Override this method in the child class
   * set the url for the request
   * set the enableCredentials for the request
   * This will be used in getListByIds
   */
  protected preGetListByIds() {
  }

  /**
   * This method should be used to get the data by id always
   * which always returns the single object
   * If the model is cacheable then it gets the data from cache and if data not in the cacche then it gets the data
   * from the sever and puts in the cahce
   *
   * @param ids Object Ids
   * @returns the list of actual model or json array
   */
  getListByIds(ids): Observable<any> {
    this._ids = ids;
    var paramsObject = {};
    paramsObject[this.getListByIdsKey()] = ids;

    if (ids == '') {
      const modelData = this.getModelFromApp();
      if (modelData != null) {
        if (modelData.length > 0) {
          return Observable.create(observer => {
            observer.next(modelData);
            observer.complete();
          });
        }
      }
    }

    var dataList = [];

    if (this.isCacheable()) {
      var data = this.dataService.getCached(this.objectKey(), this.objectPrimaryKey(), ids);
      if (data != null) {
        if (data['data'].length > 0) {
          dataList.push(...data['data']);
        }

        if (data['ids'].length > 0) {
          paramsObject[this.getListByIdsKey()] = data['ids'].toString();
        } else {
          return Observable.create(observer => {
            observer.next(this.postGetListByIds(data['data']));
            observer.complete();
          });
        }
      }
    }

    this.preGetListByIds();

    return this.apiService.getData(this.url, paramsObject, this.enableCredentials, this.isCompleteUrl, this.httpResponseType)
      .pipe(
        map(response => {


          if (this.isCacheable()) {
            /* Put data in cache */
            this.dataService.putInCache(this.objectKey(), response, this.objectPrimaryKey());
          }

          if (dataList.length > 0) {
            dataList.push(...response);
          } else {
            dataList = response;
          }

          return this.postGetListByIds(dataList);
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  /**
   * Override this method in the child class to convert json to model and return the model
   * @param responseJson
   */
  protected postGetListByIds(responseJson) {
    return responseJson;
  }

  /**
   * set the url
   * set isCredentialsEnabled
   * set isDataCacheable
   */
  protected preGet() {

  }

  /**
   * This method will be used to get the data
   * which always returns the single object
   * If the model is cacheable then it gets the data from cache and if data not in the cache then it gets the data
   * from the sever and puts in the cahce
   *
   * @param paramsObject key value pairs for the query params
   * @returns actual model or json
   */
  get(paramsObject): Observable<any> {
    this.preGet();

    if (this.isDataCacheable) {
      var data = this.dataService.getCachedData(this.objectKey(), paramsObject, this.url);
      if (data != null) {
        return Observable.create(observer => {
          observer.next(this.postGet(data));
          observer.complete();
        });
      }
    }

    return this.apiService.getData(this.url, paramsObject, this.enableCredentials, this.isCompleteUrl, this.httpResponseType)
      .pipe(
        map(response => {

          if (this.isDataCacheable) {
            /* Put data in cache */
            this.dataService.putDataInCache(this.objectKey(), paramsObject, this.url, response);
          }

          return this.postGet(response);
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  /**
   * Creates the model out of json and returns
   * Override this in the concrete class to create the actual model
   * @param responseJson
   */
  protected postGet(responseJson) {
    return responseJson;
  }

  /**
   * set the url
   * set isCredentialsEnabled
   * set isDataCacheable
   */
  protected preGetList() {
  }

  /**
   * This method will be used to get the list of data
   * which always returns the list of object
   * If the model is cacheable then it gets the data from cache and if data not in the cache then it gets the data
   * from the sever and puts in the cahce
   *
   * @param paramsObject key value pairs for the query params
   * @returns list of actual model or json array
   */
  getList(paramsObject): Observable<any> {
    this.preGetList();

    if (this.isDataCacheable) {
      var data = this.dataService.getCachedData(this.objectKey(), paramsObject, this.url);
      if (data != null) {
        return Observable.create(observer => {
          observer.next(this.postGetList(data));
          observer.complete();
        });
      }
    }

    return this.apiService.getData(this.url, paramsObject, this.enableCredentials, this.isCompleteUrl, this.httpResponseType)
      .pipe(
        map(response => {

          if (this.isDataCacheable) {
            /* Put data in cache */
            this.dataService.putDataInCache(this.objectKey(), paramsObject, this.url, response);
          }

          return this.postGetList(response);
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  /**
   * Creates the model out of json and returns
   * Override this in the concrete class to create the actual model
   * @param responseJson
   */
  protected postGetList(responseJson) {
    return responseJson;
  }

  /**
   * set the url
   * set isCredentialsEnabled
   * set isDataCacheable
   */
  protected preGetListPage() {

  }

  /**
   * This method will be used to get the list of paginated data
   * which always returns the list of object
   * If the model is cacheable then it gets the data from cache and if data not in the cache then it gets the data
   * from the sever and puts in the cahce
   *
   * @param paramsObject key value pairs for the query params
   * @returns list of actual model or json array
   */
  getListPage(paramsObject): Observable<any> {
    this.preGetListPage();

    if (this.isDataCacheable) {
      var data = this.dataService.getCachedData(this.objectKey(), paramsObject, this.url);
      if (data != null) {
        return Observable.create(observer => {
          observer.next(this.postGetListPage(data));
          observer.complete();
        });
      }
    }

    return this.apiService.getData(this.url, paramsObject, this.enableCredentials, this.isCompleteUrl, this.httpResponseType)
      .pipe(
        map(response => {

          if (this.isDataCacheable) {
            /* Put data in cache */
            this.dataService.putDataInCache(this.objectKey(), paramsObject, this.url, response);
          }

          return this.postGetListPage(response);
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  /**
   * Creates the model out of json and returns
   * Override this in the concrete class to create the actual model
   * @param responseJson
   */
  protected postGetListPage(responseJson) {
    return responseJson;
  }

  /**
   * This method will be used to get the list of data
   * which always returns the list of object
   * If the data is cacheable then it gets the data from cache and if data not in the cache then it gets the data
   * from the sever and puts in the cahce
   *
   * @param url key value pairs for the query params
   * @param paramsObject
   * @param enableCredentials
   * @param isDataCacheable
   * @param isCompleteUrl
   * @param responseType
   * @returns list of actual model or json array
   */
  protected getListCommon(url: string, paramsObject, enableCredentials: boolean, isDataCacheable: boolean = false, isCompleteUrl: boolean = false, responseType: string = null): Observable<any> {

    if (isDataCacheable) {
      var data = this.dataService.getCachedData(this.objectKey(), paramsObject, url);
      if (data != null) {
        return Observable.create(observer => {
          observer.next(data);
          observer.complete();
        });
      }
    }

    return this.apiService.getData(url, paramsObject, enableCredentials, isCompleteUrl, responseType)
      .pipe(
        map(response => {
          if (isDataCacheable) {
            /* Put data in cache */
            this.dataService.putDataInCache(this.objectKey(), paramsObject, url, response);
          }
          return response;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  /**
   * This method will be used to get the list of paginated data
   * which always returns the list of object
   * If the data is cacheable then it gets the data from cache and if data not in the cache then it gets the data
   * from the sever and puts in the cahce
   *
   * @param url key value pairs for the query params
   * @param paramsObject
   * @param enableCredentials
   * @param isDataCacheable
   * @param isCompleteUrl
   * @param responseType
   * @returns list of actual model or json array
   */
  protected getListPageCommon(url: string, paramsObject, enableCredentials: boolean, isDataCacheable: boolean = false, isCompleteUrl: boolean = false, responseType: string = null): Observable<any> {

    if (isDataCacheable) {
      var data = this.dataService.getCachedData(this.objectKey(), paramsObject, url);
      if (data != null) {
        return Observable.create(observer => {
          observer.next(data);
          observer.complete();
        });
      }
    }

    return this.apiService.getData(url, paramsObject, enableCredentials, isCompleteUrl, responseType)
      .pipe(
        map(response => {
          if (isDataCacheable) {
            /* Put data in cache */
            this.dataService.putDataInCache(this.objectKey(), paramsObject, url, response);
          }
          return response;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  /**
   * This method will be used to post the data to server
   *
   * @param url key value pairs for the query params
   * @param paramsObject
   * @param enableCredentials
   * @param isCompleteUrl
   * @param responseType
   * @returns list of actual model or json array
   */
  protected postCommon(url: string, paramsObject, enableCredentials: boolean, isCompleteUrl: boolean = false, responseType: string = null): Observable<any> {
    return this.apiService.postData(url, paramsObject, enableCredentials, isCompleteUrl, responseType)
      .pipe(
        map(response => {
          return response;
        }),
        catchError(ex => {
          console.log(ex)
          return throwError(ex);
        })
      );
  }

  /**
   * override this method to set the following
   * set the url
   * set isCredentialsEnabled
   */
  protected preAdd() {

  }

  /**
   * This method will be used to add the data
   * this uses preAdd() to get the url, enable credentials
   * uses postAdd to work onn the response data
   * @param paramsObject
   * @returns actual model or json array or object
   */
  add(paramsObject): Observable<any> {
    this.preAdd();
    return this.apiService.postData(this.url, paramsObject, this.enableCredentials, this.isCompleteUrl, this.httpResponseType)
      .pipe(
        map(response => {
          if (this.isCacheable()) {
            this.clearCache(this.objectKey());
          }
          return this.postAdd(response);
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  /**
   * Override this method to work on the response and return the object, that needs to be sent to callee
   * @param responseJson
   */
  protected postAdd(responseJson) {
    return responseJson;
  }

  /**
   * override this method to set the following
   * set the url
   * set isCredentialsEnabled
   */
  protected preUpdate() {

  }

  /**
   * This method will be used to update the data
   * this uses preUpdate() to get the url, enable credentials
   * uses postUpdate to work onn the response data
   * @param paramsObject
   * @returns actual model or json array or object
   */
  update(paramsObject): Observable<any> {
    this.preUpdate();
    return this.apiService.postData(this.url, paramsObject, this.enableCredentials, this.isCompleteUrl, this.httpResponseType)
      .pipe(
        map(response => {
          if (this.isCacheable()) {
            this.clearCache(this.objectKey());
          }
          return this.postUpdate(response);
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  /**
   * Override this method to work on the response and return the object, that needs to be sent to callee
   * @param responseJson
   */
  protected postUpdate(responseJson) {
    return responseJson;
  }

  /**
   * override this method to set the following
   * set the url
   * set isCredentialsEnabled
   */
  protected preDelete() {

  }

  /**
   * This method will be used to delete the data
   * this uses preDelete() to get the url, enable credentials
   * uses postDelete to work onn the response data
   * @param paramsObject
   * @returns actual model or json array or object
   */
  delete(paramsObject): Observable<any> {
    this.preDelete();
    return this.apiService.postData(this.url, paramsObject, this.enableCredentials, this.isCompleteUrl, this.httpResponseType)
      .pipe(
        map(response => {
          if (this.isCacheable()) {
            this.clearCache(this.objectKey());
          }
          return this.postDelete(response);
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  /**
   * Override this method to work on the response and return the object, that needs to be sent to callee
   * @param responseJson
   */
  protected postDelete(responseJson) {
    return responseJson;
  }

  /**
   * Upload file to server
   * @param files
   * @param url
   * @param params (json object)
   * @param jsonKey
   */
  uploadFile(file: File, url: string, params: any, jsonKey : string ) {
    return this.apiService.uploadFile(file, url, params,jsonKey)
      .pipe(
        map(response => {
          return response;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  uploadTwoFile(file: File,file1: File, file1key: string,  url: string, params: any, jsonKey : string ) {
    return this.apiService.uploadTwoFile(file,file1, file1key, url, params,jsonKey)
      .pipe(
        map(response => {
          return response;
        }),
        catchError(ex => {
          return throwError(ex);
        })
      );
  }

  updatePart( url: string, params: any, jsonKey : string ) {
    return this.apiService.updatePartOrder(url, params,jsonKey)
        .pipe(
            map(response => {
              return response;
            }),
            catchError(ex => {
              return throwError(ex);
            })
        )
  }

  generate( url: string, params: any, jsonKey : string ) {
    return this.apiService.generate(url, params,jsonKey)
        .pipe(
            map(response => {
              return response;
            }),
            catchError(ex => {
              return throwError(ex);
            })
        )
  }


  /**
   * This method should be used to clear the cache
   * If the object is cacheable then get the object key from the child class
   * If the Key is passed then this will always remove the cache by the key passed
   */
  clearCache(key = null) {
    this.inValidateModelInApp();
    if (key == null) {
      if (this.isCacheable()) {
        /* Delete data from cache */
        return this.dataService.clearCache(this.objectKey());
      } else {
        return false;
      }
    } else {
      return this.dataService.clearCache(key);
    }
  }
  // clear cache by key from bits

// clearing all cache
  clearAllCache() {
    this.dataService.clearAllCache();
  }

}
