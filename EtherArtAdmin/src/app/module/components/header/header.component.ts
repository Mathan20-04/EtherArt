import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { iif } from "rxjs";
import { AuthService } from "src/app/service/auth.service";
import { CollectionService } from "src/app/service/collection.service";
import { DataService } from "src/app/service/data.service";
import { GeneralService } from "src/app/service/general.service";
import { ReportService } from "src/app/service/report.service";
import { SharedDataServiceService } from "src/app/service/shared-data-service.service";
import { AppConstants, VisualMode } from "src/app/utils/Constants";
import { Message } from "src/app/utils/message";
import { BaseComponent } from "../base.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ModalloginComponent} from "../modallogin/modallogin.component";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent extends BaseComponent implements OnInit {
  public user = "";
  public count = 0;
  public logoPath = "assets/ether-logo-night.png";
  public menuCollList: Array<any> = [
    { id: 4, name: "Monkey" },
  ];
  public reports: Array<any> = [];
  public track : any ;

  constructor(
    public dataSevice: DataService,
    public sharedDataService: SharedDataServiceService,
    public authService: AuthService,
    public collectionService: CollectionService,
    private generalService: GeneralService,
    private reportService: ReportService,
    public dialog: MatDialog,
    public router: Router
  ) {
    super();
    this.autoLogin();
    this.getColection();
    this.getConfiguration();
    this.getReportConfiguration()
  }

  ngOnInit(): void {
    this.sharedDataService.currentMessage.subscribe((message) =>
      this.change(message)
    );
  }

  private autoLogin() {
    if (this.authCount == 0) {
      let data = JSON.parse(
        DataService.getDataFromLocal(AppConstants.USER_OBJECT_KEY)
      );
      if (data != null) {
        let input = {
          country_dial_code: data.country_dial_code,
          email_mobile: data.mobile,
          password: DataService.getDataFromLocal(AppConstants.USER_PWD_KEY),
        };
        if (input.email_mobile != null) {
          try {
            let obj = {};
            if (input.password == null)
              input.password = ''
            obj["auth_json"] = JSON.stringify(input);
            this.authService.authenticate(obj).subscribe((data) => {
              if (data == null) {
                // alert("Invalid credentials!");
                return;
              }
              if (data["token"] != "") {
                let roles = data.data.roles 
                if (roles != null) {
                  if (roles.length < 2) {
                    this.logout()
                    alert("Access denied!")
                    return ;
                  }
                }
                this.loggedIn.emit();
                this.isLoggedIn = true
                this.loggedInUserName = data.data.first_name
                this.user = data.data.first_name;
                let message = new Message(data, "autologin");
                this.sharedDataService.changeMessage(message);
                this.authCount++;
              } else {
                // alert("Invalid Credentials!");
              }
            });
          } catch (e) {
            // alert("error!!!");
            this.handleExcception(e);
          }
        }
      }
      return;
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
        this.user = " " + message.data.data.first_name;
      }
      if (message.sender == "item") {
        this.count++;
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
      });
    } catch (e) {
      alert("error!!!");
      this.handleExcception(e);
    }
    return;
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

  getReportConfiguration() {
    try {
      // this.reports = this.getReportsConfiguration()
      // if (this.reports != null) {
      //   // this.getTrackReport()
      //   return ;
      // }
      this.reportService.getReportConfiguration(null).subscribe((data) => {
        this.reports = data
        // this.getTrackReport()
      });
    } catch (e) {
      alert("error!!!");
      this.handleExcception(e);
    }
    return;
  }

  getTrackReport(name) {
    let sales = this.reports.filter((rep) => {return rep.report_name == 'Tracking'}) 
    let track = sales[0].reports.filter((rep) => {return rep.report_name == name})
    this.track = track[0]
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

  reportClick(i, j) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/reportgeneric/'], {state: this.reports[i].reports[j]});
  });
  }

  trackReport() {
    this.getTrackReport('Overall')
    console.log(this.track)
    this.router.navigate(['/reportgeneric'], {state: this.track});
  }

  trackReportDetail() {
    this.getTrackReport('Banners')
    console.log(this.track)
    this.router.navigate(['/reportgeneric'], {state: this.track});
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
