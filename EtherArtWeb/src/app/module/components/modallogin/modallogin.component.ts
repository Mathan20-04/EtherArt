import {Component, OnInit, Output, EventEmitter, HostListener} from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { BaseComponent } from "../base.component";
import { AuthService } from "src/app/service/auth.service";
import { SharedDataServiceService } from "src/app/service/shared-data-service.service";
import { Message } from "src/app/utils/message";
import {Router} from "@angular/router";
import {CollectionService} from "../../../service/collection.service";

@Component({
  selector: "app-modallogin",
  templateUrl: "./modallogin.component.html",
  styleUrls: ["./modallogin.component.css"],
})
export class ModalloginComponent extends BaseComponent implements OnInit {
  public isLoggedIn : boolean = false;
  public showLogin : boolean = false ;
  public showReferral : boolean = false ;
  public showSignUp: boolean = true ;

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<ModalloginComponent>,
    public sharedDataService : SharedDataServiceService,
    ) {
    super()
  }

  ngOnInit(): void {
    this.sharedDataService.currentMessage.subscribe(
      message => (this.change(message)));
  }

  close(): void {
    this.dialogRef.close();
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  /* handle message from header */
  change(message : Message) {
    if (message != null ) {
      if (message.sender == "signup" || message.sender == "login" ) {
        this.dialogRef.close()
      }
    }
  }

  makeLoginVisible(visible: boolean) {
    this.showLogin = true ;
    this.showReferral = false ;
    this.showSignUp = false ;
  }

  makeinitSignUpVisible(visible: boolean) {
    this.showLogin = false ;
    this.showReferral = false ;
    this.showSignUp = true ;
  }
}
