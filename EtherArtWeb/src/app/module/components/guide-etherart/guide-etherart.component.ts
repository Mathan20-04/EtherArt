import {Component, HostListener, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {BaseComponent} from "../base.component";

@Component({
  selector: 'app-guide-etherart',
  templateUrl: './guide-etherart.component.html',
  styleUrls: ['./guide-etherart.component.css']
})
export class GuideEtherartComponent extends BaseComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<GuideEtherartComponent>,
    public router: Router) {
    super();
  }

  ngOnInit(): void {
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  close() {
    this.dialogRef.close();
  }
  openFaq() {
    this.dialogRef.close();
    this.router.navigate(['faq'])
  }
}
