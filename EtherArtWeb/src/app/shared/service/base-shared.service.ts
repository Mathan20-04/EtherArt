import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {SharedObject} from '../../model/shared-object.model';

@Injectable({
  providedIn: 'root'
})
export class BaseSharedService {

  // protected sharedObject: SharedObject = new SharedObject();

  // private leftMsg = new BehaviorSubject(this.sharedObject);
  // leftToRight = this.leftMsg.asObservable();

  // private rightMsg = new BehaviorSubject(this.sharedObject);
  // rightToLeft = this.rightMsg.asObservable();

  // private sharedObjectSubject = new BehaviorSubject(this.sharedObject);
  // generalSharedObject = this.sharedObjectSubject.asObservable();

  // constructor() {
  //   this.sharedObject = new SharedObject();
  // }

  // onDestroy() {
  //   this.sharedObject = new SharedObject();
  //   this.leftMsg.next(this.sharedObject);
  //   this.rightMsg.next(this.sharedObject);
  //   // this.leftMsg = new BehaviorSubject(this.sharedObject);
  //   // this.rightMsg = new BehaviorSubject(this.sharedObject);
  // }

  // leftToRightMsg(message: any, action: any, conf: any) {
  //   let sharedObject = new SharedObject();
  //   sharedObject.data = message;
  //   sharedObject.action = action;
  //   sharedObject.configuration = conf;
  //   this.leftMsg.next(sharedObject);
  // }

  // rightToLeftMsg(message: any, action: any, conf: any) {
  //   let sharedObject = new SharedObject();
  //   sharedObject.data = message;
  //   sharedObject.action = action;
  //   sharedObject.configuration = conf;
  //   this.rightMsg.next(sharedObject);
  // }

  // shareGeneralObject(object: any, action: any, conf: any) {
  //   let sharedObject = new SharedObject();
  //   sharedObject.data = object;
  //   sharedObject.action = action;
  //   sharedObject.configuration = conf;
  //   this.sharedObjectSubject.next(sharedObject);
  // }

  // // unsubscribe() {
  // //   this.sharedObject = new SharedObject();
  // // }

}
