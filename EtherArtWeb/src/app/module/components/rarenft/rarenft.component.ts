import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef,MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HowtogetComponent} from "../howtoget/howtoget.component";

@Component({
  selector: 'app-rarenft',
  templateUrl: './rarenft.component.html',
  styleUrls: ['./rarenft.component.css']
})
export class RarenftComponent implements OnInit {

  constructor(public dialog: MatDialog,) { }

  ngOnInit(): void {
  }

  howToGet() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "350px";
    dialogConfig.width = "360px";
    this.dialog.open(HowtogetComponent, dialogConfig);
  }
}
