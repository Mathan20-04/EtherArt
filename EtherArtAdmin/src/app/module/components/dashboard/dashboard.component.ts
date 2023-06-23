import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { DataService } from 'src/app/service/data.service';
import { SharedDataServiceService } from 'src/app/service/shared-data-service.service';
import { Message } from 'src/app/utils/message';
import { BaseComponent } from '../base.component';
import { ModalloginComponent } from '../modallogin/modallogin.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  public trending = "trending"
  public recent = "recent"
  public isLoggedIn : boolean = false;
  public showLogin : boolean = false ;
  public showReferral : boolean = false ;
  public showSignUp: boolean = true ;

  constructor(
    public dialog: MatDialog,
    public sharedDataService : SharedDataServiceService) {
    super()
  }

  ngOnInit(): void {
    this.sharedDataService.currentMessage.subscribe(
      message => (this.change(message)));
    if (this.getLoggedInUserId() == null) {
      this.openLogin() ;
      return
    }
  }

  change(message : Message) {
    if (message != null ) {
      if (this.getLoggedInUserId() == null) {
        this.openLogin() ;
        return
      }
    }
  }

  

  openLogin() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "350px";
    dialogConfig.width = "360px";
    this.dialog.open(ModalloginComponent, dialogConfig);
  }
}
