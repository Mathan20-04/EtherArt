import {Injectable} from '@angular/core';
import {Utils} from '../utils/Utils';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() {
  }

  /*
  * var curDate = new Date();

      var addDate = curDate.setDate(curDate.getDate() - 2) ;
      var expDate = new Date(addDate) ;

      console.log(new Date(addDate).toUTCString());

      if (new Date().toUTCString() > expDate.toUTCString()){
        console.log("exp");
      } else {
        console.log("not exp") ;
      }
  * */

  public static setDataInLocal(key, value) {
    let val : string = String(value).toString()
    const encryptedData = Utils.encryptString(val);
    if (encryptedData != '' && encryptedData != null) {

      localStorage.setItem(key, encryptedData);
    }
    return;
  }

  public static getDataFromLocal(key) {
    const value = localStorage.getItem(key);
    if (value == '' || value == null) {
      return null;
    }
    const decryptedData = Utils.decryptString(value);
    return decryptedData;
  }

  public static deleteFromLocal(key) {
    localStorage.removeItem(key);
  }

  getUnique(listObject, primaryKey) {

    const unique = listObject
      .map(e => e[primaryKey])
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter(e => listObject[e]).map(e => listObject[e]);

    return unique;
  }

  /*
  * This methos is used to filter the list of master datas by ids
  * Returns the list of master objects and the list of ids which are not in cache
  *
  * @params dataObject
  * @params ids
  * @params primaryKey
  * */
  getFilteredList(dataObject, ids: string, primaryKey: string) {

    if (typeof (ids) == "number") {
      ids = String(ids);
    }
    var idsList = ids.split(',');
    var objectList = [];
    var notFoundIds = [];
    var returnObject = {};

    if (dataObject == null) {
      returnObject['data'] = objectList;
      returnObject['ids'] = notFoundIds;
      return returnObject;
    }

    for (var i = 0; i < idsList.length; i++) {
      var filteredData = dataObject.filter((data) => (data[primaryKey] == idsList[i]));
      if (filteredData == null) {
        if (idsList[i] != '' && idsList[i] != null) {
          notFoundIds.push(idsList[i]);
        }
      } else {
        if (filteredData.length > 0) {
          objectList.push(...filteredData);
        } else {
          if (idsList[i] != '' && idsList[i] != null) {
            notFoundIds.push(idsList[i]);
          }
        }
      }
    }

    returnObject['data'] = objectList;
    returnObject['ids'] = notFoundIds;

    // return objectList;
    return returnObject;
  }

  getFilteredListByKey(dataObject, key: string, val: string) {
    var objectList = [];

    if (dataObject == null) {
      return objectList;
    }

    objectList = dataObject.filter((data) => (data[key] == val));
    return objectList;
  }

  /*
  * This method is used to store only masters
  * Its stores as a individual object
  * Id as a key and the object as a value
  * */
  public putInCache(objectKey, data, primaryKey) {

    /**
     * Check if data is already there for a key
     * if data exists then extend the list then filter for unique objects
     */


    /*
    * dataObject = {'exp':'date', 'data':[{},{}] }
    * */

    var curDate = new Date();
    var addDate = curDate.setDate(curDate.getDate() + 2);
    var expDate = new Date(addDate);

    var sessionData = sessionStorage.getItem(objectKey);
    if (sessionData == null) {
      let dataObject = {};
      dataObject['exp'] = expDate;
      dataObject['data'] = data;
      // sessionStorage.setItem(objectKey, JSON.stringify(dataObject));
      var encryptedData = Utils.encryptString(JSON.stringify(dataObject));
      sessionStorage.setItem(objectKey, encryptedData);
    } else {
      sessionData = Utils.decryptString(sessionData);
      var sessionDataObject = JSON.parse(sessionData)['data'];
      sessionDataObject.push(...data);
      sessionDataObject = this.getUnique(sessionDataObject, primaryKey);
      let dataObject = {};
      dataObject['exp'] = expDate;
      dataObject['data'] = sessionDataObject;
      // sessionStorage.setItem(objectKey, JSON.stringify(dataObject));
      var encryptedData = Utils.encryptString(JSON.stringify(dataObject));
      sessionStorage.setItem(objectKey, encryptedData);
    }

    var localData = localStorage.getItem(objectKey);
    if (localData == null) {
      let dataObject = {};
      dataObject['exp'] = expDate;
      dataObject['data'] = data;
      // localStorage.setItem(objectKey, JSON.stringify(dataObject));
      var encryptedData = Utils.encryptString(JSON.stringify(dataObject));
      localStorage.setItem(objectKey, encryptedData);
    } else {
      localData = Utils.decryptString(localData);
      var localDataObject = JSON.parse(localData)['data'];
      localDataObject.push(...data);
      localDataObject = this.getUnique(localDataObject, primaryKey);
      let dataObject = {};
      dataObject['exp'] = expDate;
      dataObject['data'] = localDataObject;
      // localStorage.setItem(objectKey, JSON.stringify(dataObject));
      var encryptedData = Utils.encryptString(JSON.stringify(dataObject));
      localStorage.setItem(objectKey, encryptedData);
    }

    return null;
  }

  /*
  * This method is used to get the master data only
  * It filters the data and returs the list of object and the list Ids which are not in cache
  * */
  public getCached(objectKey, primaryKey, ids = null) {
    var data = null;
    data = sessionStorage.getItem(objectKey);
    if (data == null) {
      data = localStorage.getItem(objectKey);
    }

    if (data != null) {
      data = Utils.decryptString(data);
      let dt = JSON.parse(data)['exp'];
      let expDate = new Date(dt);
      if (new Date() > expDate) {
        sessionStorage.removeItem(objectKey);
        localStorage.removeItem(objectKey);
        data = null;
      } else {
        data = JSON.parse(data)['data'];
      }
    }

    if (data != null) {
      if (ids != null && ids !== '') {
        /* Filter by ids */
        data = this.getFilteredList(data, ids, primaryKey);
        return data;
      } else {
        let dataObject = {};
        dataObject['data'] = data;
        dataObject['ids'] = [];
        return dataObject;
      }
    } else {
      return null;
    }
  }

  /*
  * This method is used to generate the key for a cache
  * */
  private generateCacheKey(objectKey, params, url) {
    var cacheKey: string = objectKey;
    cacheKey = cacheKey.replace('/', '');

    // url = url.replace('/', '');
    // url = url.replace('-', '');

    cacheKey += url;

    if (params != null && params != '') {
      for (let key of Object.keys(params)) {
        var val = String(params[key]);
        val = val.replace('/', '');
        cacheKey += val;
      }
    }

    return cacheKey;
  }

  /*
  * This method is used to get the data from the cache
  * This stores any data in cache
  * It fetches the data by key (Key is generated with concatenated url and params)
  * */
  public getCachedData(objectKey, params, url) {
    var data = null;

    var cacheKey = this.generateCacheKey(objectKey, params, url);

    data = sessionStorage.getItem(cacheKey);
    if (data == null) {
      data = localStorage.getItem(cacheKey);
    }

    if (data != null) {
      data = Utils.decryptString(data);
      let dt = JSON.parse(data)['exp'];
      let expDate = new Date(dt);
      if (new Date() > expDate) {
        sessionStorage.removeItem(cacheKey);
        localStorage.removeItem(cacheKey);
        data = null;
      } else {
        data = JSON.parse(data)['data'];
      }
    }

    if (data != null) {
      return data;
    } else {
      return null;
    }
  }

  /*
  * This method is used to put any kinda data in cache
  * Key is generated with concatenated URL and the params
  * */
  public putDataInCache(objectKey, params, url, data) {
    /**
     * Check if data is already there for a key
     * if data exists then extend the list then filter for unique objects
     */


    /*
    * dataObject = {'exp':'date', 'data':[{},{}] }
    * */

    var curDate = new Date();
    var addDate = curDate.setDate(curDate.getDate() + 2);
    var expDate = new Date(addDate);

    var cacheKey = this.generateCacheKey(objectKey, params, url);

    let dataObject = {};
    dataObject['exp'] = expDate;
    dataObject['data'] = data;
    // sessionStorage.setItem(cacheKey, JSON.stringify(dataObject));
    // localStorage.setItem(cacheKey, JSON.stringify(dataObject));
    let encryptedData = Utils.encryptString(JSON.stringify(dataObject));
    sessionStorage.setItem(cacheKey, encryptedData);
    localStorage.setItem(cacheKey, encryptedData);

    return null;
  }

  /*
  * This is a generic method, can be used to get the cached data by using key from anywhere
  * */
  getCachedByProperty(objectKey, key, val) {
    var data = null;
    data = sessionStorage.getItem(objectKey);
    if (data == null) {
      data = localStorage.getItem(objectKey);
    }

    if (data != null) {
      data = Utils.decryptString(data);
      let dt = JSON.parse(data)['exp'];
      let expDate = new Date(dt);
      if (new Date() > expDate) {
        sessionStorage.removeItem(objectKey);
        localStorage.removeItem(objectKey);
        data = null;
      } else {
        data = JSON.parse(data)['data'];
      }
    }

    if (data != null) {
      /* Filter by key */
      data = this.getFilteredListByKey(data, key, val);
      if (data.length <= 0) {
        return null;
      } else {
        return data;
      }
    } else {
      return null;
    }
  }

  /**
   * This method is used to clear the session and local storage by Key
   * @param key
   */
  public clearCache(key) {
    if (key != '' && key != null) {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
      return true;
    } else {
      return false;
    }
  }
// clear all cache
  public clearAllCache(){
    try {
      sessionStorage.clear();
      localStorage.clear();
    } catch (e) {
    }
  }
  /*
   * This method is used only for number or string as param not JSON
   * */
  public getStoreData(key, dataType = null) {
    let data;
    if (key != '' && key != null) {
      if (dataType == null ) {
        data = localStorage.getItem(key);
        return Utils.decryptString(data);
      } else {
        data =  Utils.decryptString(localStorage.getItem(key));
        return JSON.parse(data);
      }
    } else {
      return;
    }
  }

  public setStoreData(objectKey, dataObject, dataType = null) {
    var encryptedData;
    if (objectKey != '' && objectKey != null) {
      if (dataType == null) {
        encryptedData = Utils.encryptString(String(dataObject));
      } else {
        encryptedData = Utils.encryptString(JSON.stringify(dataObject));
      }
      return localStorage.setItem(objectKey, encryptedData);
    } else {
      return;
    }
  }

  /*
  * This method is used to delete cache by object key
  * */
  public clearCacheByObjectKey(objectKey, primaryKey, id) {
    var data = null;
    var expDate = null;
    data = localStorage.getItem(objectKey);
    if (data == null) {
      data = sessionStorage.getItem(objectKey);
    }

    if (data != null) {
      data = Utils.decryptString(data);
      let dt = JSON.parse(data)['exp'];
      expDate = JSON.parse(data)['exp'];
      let _expDate = new Date(dt);
      if (new Date() > _expDate) {
        sessionStorage.removeItem(objectKey);
        localStorage.removeItem(objectKey);
        data = null;
      } else {
        data = JSON.parse(data)['data'];
      }
    }

    if (data != null) {
      if (id != null && id !== '') {
        /* Filter by id */
        data = data.filter((_data) => (_data[primaryKey] != id));

        sessionStorage.removeItem(objectKey);
        localStorage.removeItem(objectKey);

        let dataObject = {};
        dataObject['exp'] = expDate;
        dataObject['data'] = data;
        var encryptedData = Utils.encryptString(JSON.stringify(dataObject));
        localStorage.setItem(objectKey, encryptedData);
        sessionStorage.setItem(objectKey, encryptedData);
        return true;
      }
    } else {
      return null;
    }
  }

}
