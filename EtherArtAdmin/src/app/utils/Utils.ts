import {AppComponent} from '../app.component';
import {isDevMode} from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { MatPseudoCheckbox } from '@angular/material/core';

export class Utils {
  public static pageSize = 15;


  static getCurrentDateForDB() {
    let d = new Date();
    let dt = d.getDate();
    let mn = d.getMonth() + 1;
    let yy = d.getFullYear();
    return dt + '/' + mn + '/' + yy;
  }

  static getCurrentDayInNumber() {
    let d = new Date();
    let dt = d.getDate();
    return dt;
  }
  static getDayOfWeek() {
    let d = new Date();
    let day = d.getDay();
    return day;
  }

  static getCurrentMonth() {
    let d = new Date();
    let mn = d.getMonth() + 1;
    return mn;
  }

  static getCurrentYear() {
    let d = new Date();
    return d.getFullYear();
  }

  static isFutureFY(mnth) {
    let d = new Date();
    let mn = d.getMonth() + 1;
    // console.log("month passed is ") ;
    // console.log(mnth) ;
    // console.log(mn) ;

    if (mn >= 4) { // current calendar year 20 .. for example current month is 8
      if (mnth > mn) {
        return false ; // check current month with month passed for example 9 and current month is 8
      } else {
        return true ; // check current month with month passed for example 5 and current month is 8
      }
    } else { // next calendar year 21
      if (mnth <= mn || mnth >= 4) {
        return false ;
      } else {
        return true ;
      }
    }
  }
  static getMonthName(mn) {
    switch (mn) {
      case 1:
        return 'Jan' ;
        break ;
      case 2:
        return 'Feb' ;
        break ;
      case 3:
        return 'Mar' ;
        break ;
      case 4:
        return 'Apr' ;
        break ;
      case 5:
        return 'May' ;
        break ;
      case 6:
        return 'Jun' ;
        break ;
      case 7:
        return 'Jul' ;
        break ;
      case 8:
        return 'Aug' ;
        break ;
      case 9:
        return 'Sep' ;
        break ;
      case 10:
        return 'Oct' ;
        break ;
      case 11:
        return 'Nov' ;
        break ;
      case 12:
        return 'Dec' ;
        break ;
      default:
        return '';
        break ;
    }
  }

  static convertDate(input) {
    if (input == undefined || input == '') {
      return '';
    }
    let d = new Date(input);
    let dt = d.getDate();
    let mn = d.getMonth() + 1;
    let yy = d.getFullYear();
    return dt + '/' + mn + '/' + yy;

  }

  static convertDateFromServerToSystem(input) { // input is always in the form dd/mm/yyyy
    if (input == undefined || input == '') {
      return new Date();
    }
    var splitted = input.split('/');
    let d = new Date(Number(splitted[2]), Number(splitted[1]) - 1, Number(splitted[0]));

    return d;
  }

  static convertDateFromServerToStrddmmyyyy(input) { // input is always in the form dd/mm/yyyy
    if (input == undefined || input == '') {
      return new Date();
    }
    var splitted = input.split(' ');
    return splitted[0];
  }

  static convertDBDateShort(input,splitChar) : string { // dd/mm/yyyy hh:mm:ss
    if (input == undefined || input == '') {
      return new Date().toString();
    }
    var items = input.split(splitChar);
    return  items[0]   + "/" + items[1] + "/" + items[2].substr(2,2)
  }

  static convertDBDateShortyyyymmdd(input,splitChar) : string { // yyyy-mm-dd format
    if (input == undefined || input == '') {
      return new Date().toString();
    }
    var items = input.split(splitChar);
    return  items[2].split(' ')[0]   + "/" + items[1] + "/" + items[0].substr(2,2)
  }


  static convertddmmyyyytoyyyymmdd(input,splitChar) : string {
    if (input == undefined || input == '') {
      return new Date().toString();
    }
    var items = input.split(splitChar);
    return items[0].substr(0,4)+  "-" + items[1] + "-" +items[2].split(' ')[0] + ' '+'00'+':'+'00'+':'+'00';
  }


  static replaceChar(str, pos, replaceWith) {
    str = this.setCharAt(str, pos, replaceWith);
    return str;
  }

  static convertUTC() {
    let date = new Date().getUTCFullYear().toString().padStart(2,'0')+ "-"
        + (new Date().getMonth()+1).toString().padStart(2,'0') + "-"
        + new Date().getUTCDate().toString().padStart(2,'0')+" "
        + new Date().getUTCHours().toString().padStart(2,'0')+ ":"
        + new Date().getUTCMinutes().toString().padStart(2,'0') + ":"
        + new Date().getUTCSeconds().toString().padStart(2,'0')
    return date;
  }

  static setCharAt(str, index, chr) {
    if (index > str.length - 1) {
      return str;
    }
    return str.substr(0, index) + chr + str.substr(index + 1);
  }

  static convertDateToUtc(date: Date) {
    return new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
  }
  static  currentDateInUTC(){
    var date=new Date();
    return this.convertDateToUtc(date);
  }


  static getUniqueIds(array) {
    let Ids: string = '';
    array.forEach(function concatenate(item) {
      // if (Ids == '') {
      //   Ids = item ;
      // } else {
      Ids = Ids + ',' + item;
      // }
    });
    return Ids;
  }

  static getUniqueIdsTwo(array) {
    let Ids: string = '';
    array.forEach(function concatenate(item) {
      if (Ids == '') {
        Ids = item ;
      } else {
      Ids = Ids + ',' + item;
      }
    });
    return Ids;
  }


  static debugPrint(message?: any) {
    if (isDevMode()) {
    }
  }

  static encryptString(str) {
    let encryptedData = '';
    if (str != null && str != '') {
      encryptedData = CryptoJS.AES.encrypt(str.trim(), '1234').toString();
    }
    return encryptedData;
  }

  static decryptString(str) {
    let decryptedData = '';
    if (str != null && str != '') {
      decryptedData = CryptoJS.AES.decrypt(str, '1234').toString(CryptoJS.enc.Utf8);
    }
    return decryptedData;
  }

  static convertKgToTons(val) {
    try {
      let num = val / 1000
      return num;
    } catch (e) {
      return 0;
    }
  }

  static getPaymentStatus() {
    var arr = [];
    this.addObjToStatusArr(arr, 'Open', 'OPEN');
    this.addObjToStatusArr(arr, 'Closed', 'CLOSED');
    return arr;
  }

  static addObjToStatusArr(arr, str, value) {
    var obj = {};
    obj['name'] = str;
    obj['id'] = value;
    arr.push(obj);
  }

  static isPDF(fileName: String) {
    var type = this.getMimeType(fileName).toString();
    if (type.toLowerCase() == 'pdf') {
      return true;
    } else {
      return false;
    }
  }

  static isXLS(fileName: String) {
    var type = this.getMimeType(fileName).toString();
    if (type.toLowerCase() == 'xls' || type.toLowerCase() == 'xlsx' || type == 'csv') {
      return true;
    } else {
      return false;
    }
  }

  static isImg(fileName: String) {
    var arr = ['jpg', 'jpeg', 'gif', 'png', 'pjpeg', 'ttif', 'icon', 'tif'];
    var type = this.getMimeType(fileName).toString();
    if (arr.indexOf(type.toLowerCase()) > -1) {
      return true;
    } else {
      return false;
    }
  }

  static getMimeType(fileName: String) {
    var type = '';
    var arr = fileName.split('.');
    if (arr.length > 0) {
      type = arr[1];

    }
    return type;
  }

  static setDefaultImgByName(fileName: String): String {
    var src = '';
    if (this.isPDF(fileName)) {
      src = 'assets/pdf.png';
    } else if (this.isXLS(fileName)) {
      src = 'assets/xls.png';
    } else if (this.isImg(fileName)) {
      src = 'assets/no-image.png';
    } else {
      src = 'assets/doc.png';
    }
    return src;
  }

  static convertDateTime(date: Date) {
    var fomate=""
    if (date != null) {
      try {
        var d = date.getDate();
        var m = (date.getMonth())+1;
        var y = date.getFullYear();
        var h = date.getHours();
        var i = date.getMinutes();
        var s = date.getSeconds();
        // console.log(m)
        fomate = d + "/" + m + "/" + y + " " + h + ":" + i + ":" + s;
      } catch (e) {
      }

    }
    return fomate;
  }

  static log(message?: any, ...optionalParams: any[]) : void {
    if (environment.production == false) {
      console.log(message,optionalParams);
    }
  }

  static alertMsg(str : String) {
    if (environment.production == false) {
      alert(str);
    }
  }

  static getBidRange(bids:[any] , user_id) {
    let obj = {low:0,high:0,cnt:0,isMine:0, amnt:0}
    bids.forEach(bid => {
      // console.log(bid.user_id + " bid user id")
      // console.log(user_id + " my id")
      if (bid.user_id == user_id) {
        obj.isMine = 1
        obj.amnt = bid.bid_price
      }
      if (bid.bid_price < obj.low)
        obj.low = bid.bid_price
      if (bid.bid_price > obj.high)
        obj.high = bid.bid_price
      obj.cnt++;
    });
    return obj
  }

  static generateRandomNumAsStr() : string {
    return Math.floor(Math.random() * 33554432).toString()
  }

  static generateRandomNum() : number {
    return Math.floor(Math.random() * 33554432)
  }

}
