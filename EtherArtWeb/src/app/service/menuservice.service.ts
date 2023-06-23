import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from 'rxjs/internal/Subject';
import { Message } from '../utils/message';

@Injectable({
  providedIn: 'root'
})
export class MenuserviceService {

  constructor() { }
  //Using any
  public message: Message = null;
  private messageSource = new  BehaviorSubject(this.message);

  currentMessage = this.messageSource.asObservable();
  changeMessage(data: Message) {
    this.messageSource.next(data)
  }
}
