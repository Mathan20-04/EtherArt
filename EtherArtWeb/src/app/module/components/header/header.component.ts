import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/service/auth.service";
import { CollectionService } from "src/app/service/collection.service";
import { DataService } from "src/app/service/data.service";
import { GeneralService } from "src/app/service/general.service";
import { MenuserviceService } from "src/app/service/menuservice.service";
import { SharedDataServiceService } from "src/app/service/shared-data-service.service";
import { AppConstants, VisualMode } from "src/app/utils/Constants";
import { Message } from "src/app/utils/message";
import { BaseComponent } from "../base.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ModalloginComponent} from "../modallogin/modallogin.component";
import {GuideEtherartComponent} from "../guide-etherart/guide-etherart.component";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent extends BaseComponent implements OnInit {
  public user = "";
  public count = 0;
  public logoPath = "assets/ether-logo-night.png";
  public menuCollList: Array<any> = [];
  public authDone ;
  public joinPage = false;
  constructor(
    private dataSevice: DataService,
    private sharedDataService: SharedDataServiceService,
    private authService: AuthService,
    private collectionService: CollectionService,
    private generalService: GeneralService,
    private menuMsgService: MenuserviceService,
    public dialog: MatDialog,
    private router: Router) {
    super();
    this.checkVersion()
    this.authDone  = this.checkAuthentication()
  }

  ngOnInit(): void {
    this.getColection();
    this.getConfiguration();
    this.sharedDataService.currentMessage.subscribe((message) =>
      this.change(message)
    );
    this.autoLogin()
  }

  openDashboard() {
    if(window.location.pathname != '/join')
      this.router.navigate(['dashboard'])
  }

  private autoLogin() {
    if (this.authDone == 1) {
      console.log("auth done")
      this.loggedIn.emit();
      this.isLoggedIn = true
      let message = new Message(DataService.getDataFromLocal(AppConstants.DATA), "login");
      this.sharedDataService.changeMessage(message);
    }
  }

  changeVisualMode(night: Boolean) {
    this.logoPath =
      night == true ? "assetsether-logo-night.png" : "assetsether-logo-day.png";
    this.visualMode = night == true ? VisualMode.night : VisualMode.day;
  }

  change(message: Message) {
    if (message != null) {
      if (
        message.sender == "login" ||
        message.sender == "hide" ||
        message.sender == "signup"
      ) {
        this.isLoggedIn = true
      }
      if (message.sender == "item") {
        this.count++;
      }
      if (message.sender == "join") {
        this.joinPage = true;
      }
    }
  }

  getColection() {
    let input = {
      q: "",
      o: "CREATEDASC",
      page_num: 1,
      page_size: 100,
    };
    try {
      this.collectionService.getCollection(input).subscribe((data) => {
        if (data != null) {
          if (data.data != null) {
            data.data.forEach(col => {
              if (col.status == 'ACTIVE') {
                let obj = {}
                obj['name'] = col.title == null ? col.collection_id : col.title
                obj['id'] = col.collection_id
                this.menuCollList.push(obj)
              }
            });
          }
        }
      });
    } catch (e) {
      alert("error!!!");
      this.handleExcception(e);
    }
    return;
  }

  onReserve() {
    this.router.navigate(['rare'])
  }
  isLoggedInPath(path) {
    let ret = false
    switch (path) {
      case '/myaccount':
      case '/favourite':
      case '/mytickets':
      case '/withdraw':
        ret = true
        break ;
      defulat:
        break ;
    }
    return ret;
  }
  logout() {
    this.authService.logOut();
    let message = new Message(null, "logout");
    this.sharedDataService.changeMessage(message);
    this.user = "";
    this.isLoggedIn = false
    this.loggedInUserName = ""
    this.router.navigate(["/"]);
    this.authCount = 0;
  }

  getConfiguration() {
    if (this.configuration == null) {
      let input = {
        collection_id: "",
      };
      try {
        this.generalService.getConfiguraton(input).subscribe((data) => {
          this.configuration = data;
        });
      } catch (e) {
        alert("error!!!");
        this.handleExcception(e);
      }
    }
    return;
  }

  onMenuClick(item) {
    if (this.router.url != '/collection') {
      this.router.navigate(['/collection'], {state: item})
    } else {
      let msg = new Message(item, "Menu")
      this.menuMsgService.changeMessage(msg)
    }

  }
  openLoginModal() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    this.dialog.open(ModalloginComponent, {
      panelClass:'dialog-container-custom'
    });
  }
  openGuide() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-guide";
    if(!this.isMob){
      dialogConfig.height = "96vh";
      dialogConfig.width = "40vw";
    }
    if(this.isMob){
      dialogConfig.height = "90vh";
      dialogConfig.width = "100vw";
    }
    this.dialog.open(GuideEtherartComponent,dialogConfig);
  }
}
