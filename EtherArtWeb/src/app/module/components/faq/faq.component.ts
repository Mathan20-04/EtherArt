import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../base.component";

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent extends BaseComponent implements OnInit {

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
