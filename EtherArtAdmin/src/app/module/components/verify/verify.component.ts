import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../base.component";

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent extends BaseComponent implements OnInit {

  public userName;
  public joinedOn;
  public purchasedOn;
  public amountAvailable;
  public reqDate;
  public reqAmount;
  public payMode;
  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
