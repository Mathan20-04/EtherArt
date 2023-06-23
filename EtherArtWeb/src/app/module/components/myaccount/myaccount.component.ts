import { Component, OnInit } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { BaseComponent } from '../base.component';
import {Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import { ItemmsgService } from 'src/app/service/itemmsg.service';
import { Message } from 'src/app/utils/message';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.css']
})
export class MyaccountComponent extends BaseComponent implements OnInit {

  public isMobile = this.isMobile();
  public showContainer = false;
  public selectedMenu = 0;
  public profileTab = "tab-pane active";
  public myreferalTab = "tab-pane";
  public collectableTab = "tab-pane";
  public walletTab = "tab-pane";
  public paymentMethodTab = "tab-pane";
  public selected = new FormControl(0);
  public showPayMethod = false

  constructor(public router:Router,
    public itemMsgService : ItemmsgService) {
    super();
     let obj : any = this.router.getCurrentNavigation().extras.state;
    if(obj != undefined) {
      if(obj.paymethod){
        this.paymentMethodTab = "tab-pane active";
        this.profileTab = "tab-pane"
        this.selected.setValue(4)
      }
      if(obj.collectables) {
        this.collectableTab = "tab-pane active";
        this.profileTab = 'tab-pane';
        this.selected.setValue(3)
      }
    }
    this.itemMsgService.currentMessage.subscribe(
      message => (this.onMessageRecv(message)));
  }

  onMessageRecv(msg: Message): void {
    if (msg == undefined || msg == null) {
      return
    }
    if (msg.sender == "walletCashBalance") {
      if (msg.data > 0)
        this.showPayMethod = true
    }
  }

  ngOnInit(): void {
  }

  menuClick(index) {
    if (this.selectedMenu == index) {
      this.selectedMenu = 0;
      this.showContainer = false;
    } else {
      this.selectedMenu = index;
      this.showContainer = true;
    }
  }
}
