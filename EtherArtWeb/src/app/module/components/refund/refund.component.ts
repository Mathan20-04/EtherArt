import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../base.component";

@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.css']
})
export class RefundComponent extends BaseComponent implements OnInit {

  public mode;
  constructor() {
    super();
  }

  ngOnInit(): void {
    if(this.isMob)
      this.mode = "mobile"
    else
      this.mode = "desktop"
    document.body.scrollTop = 0
  }

}
