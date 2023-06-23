import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-reflink',
  templateUrl: './reflink.component.html',
  styleUrls: ['./reflink.component.css']
})
export class ReflinkComponent extends BaseComponent implements OnInit {

  constructor(
    private router: Router,
    private arouter : ActivatedRoute) {
      super()
  }

  ngOnInit(): void {
  }

  referClick() {
    this.router.navigate(['referral'])
  }
}
