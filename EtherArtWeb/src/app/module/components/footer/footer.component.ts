import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {BaseComponent} from "../base.component";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent extends BaseComponent implements OnInit {

  constructor(public router:Router) {
    super();
  }

  ngOnInit(): void {
  }

  helpCenter() {
    this.router.navigate(['help-center']);
  }

}
