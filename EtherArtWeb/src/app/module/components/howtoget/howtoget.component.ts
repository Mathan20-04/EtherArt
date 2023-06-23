import {Component, HostListener, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {BaseComponent} from "../base.component";

@Component({
  selector: 'app-howtoget',
  templateUrl: './howtoget.component.html',
  styleUrls: ['./howtoget.component.css']
})
export class HowtogetComponent extends BaseComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<HowtogetComponent>) {
    super();
  }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

}
