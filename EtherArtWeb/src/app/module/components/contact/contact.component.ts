import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../base.component";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent extends BaseComponent implements  OnInit {

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
