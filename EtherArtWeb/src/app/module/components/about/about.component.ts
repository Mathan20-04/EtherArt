import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../base.component";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent extends BaseComponent implements OnInit {

  public mode:any;
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
