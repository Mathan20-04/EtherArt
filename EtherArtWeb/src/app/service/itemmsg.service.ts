import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Message } from '../utils/message';

@Injectable({
  providedIn: 'root'
})
export class ItemmsgService {

  constructor() { }
  //Using any
  public message: Message = null;
  public subject = new Subject<any>();
  private messageSource = new  BehaviorSubject(this.message);

  currentMessage = this.messageSource.asObservable();
  changeMessage(data: Message) {
    this.messageSource.next(data)
  }
}

