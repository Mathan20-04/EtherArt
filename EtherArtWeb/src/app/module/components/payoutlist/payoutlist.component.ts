import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../base.component";

@Component({
  selector: 'app-payoutlist',
  templateUrl: './payoutlist.component.html',
  styleUrls: ['./payoutlist.component.css']
})
export class PayoutlistComponent extends BaseComponent implements OnInit {

  public isfilterOpen = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  filterOpen() {
    this.isfilterOpen = ! this.isfilterOpen
  }

}
