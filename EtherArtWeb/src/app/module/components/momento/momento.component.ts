import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../base.component";

@Component({
  selector: 'app-momento',
  templateUrl: './momento.component.html',
  styleUrls: ['./momento.component.css']
})
export class MomentoComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
