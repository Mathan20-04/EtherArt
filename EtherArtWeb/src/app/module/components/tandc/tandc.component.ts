import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../base.component";

@Component({
  selector: 'app-tandc',
  templateUrl: './tandc.component.html',
  styleUrls: ['./tandc.component.css']
})
export class TandcComponent extends BaseComponent implements OnInit {

  public mode;
  constructor() {
    super()
  }

  ngOnInit(): void {
    if(this.isMob)
      this.mode = "mobile"
    else
      this.mode = "desktop"
    document.body.scrollTop = 0
  }

}
