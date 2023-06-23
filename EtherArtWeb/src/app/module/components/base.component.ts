import {EtherBaseExcetion} from '../../utils/exception';
import {AppConstants, VisualMode} from '../../utils/Constants';
import {Utils} from '../../utils/Utils';
import {Router} from '@angular/router';
import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {DataService} from "../../service/data.service";
import { AuthService } from 'src/app/service/auth.service';
import { Message } from 'src/app/utils/message';
import { SharedDataServiceService } from 'src/app/service/shared-data-service.service';
import { NONE_TYPE } from '@angular/compiler';
import {CountryISO, PhoneNumberFormat, SearchCountryField} from "ngx-intl-tel-input";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-base',
  template: `
  `,
  styles: [
  ]
})
export class BaseComponent {

  @Inject(Router) public baseRouter: Router;
  @Output() loggedIn: EventEmitter<number> =   new EventEmitter();

  private objectName: string;

  public version = environment.version;

  public isLoggedIn = false ;
  public loggedInUserName = ""
  public configuration : any ;
  public hasAccess: boolean = true;
  public hasCreateAccess: boolean = true;
  public hasReadAccess: boolean = true;
  public hasUpdateAccess: boolean = true;
  public hasDeleteAccess: boolean = true;
  public hasHierarchyAccess: boolean = true;

  public screenWidth = window.screen.width ;
  public visualMode = VisualMode.day ;

  public darkMode :boolean = false;

  public isMob = this.isMobile();

  public authCount = 0;
  public countryiso = CountryISO.India;
  maxLength:any ="15";
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedStates];
  phoneForm = new FormGroup({
    phone: new FormControl(undefined, [Validators.required])
  });

  PreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.UnitedStates];
  }

  constructor() {
    let theme = DataService.getDataFromLocal("Theme")
    if (theme != null)
      if (theme == 'light') {
        document.body.classList.value = "light-theme"
        this.darkMode = false;
      } else {
        document.body.classList.value = ""
        this.darkMode = true;
      }
  }

  toggleDarkTheme(): void {
    document.body.classList.toggle('light-theme');
    this.darkMode =! this.darkMode;
    if(document.body.classList.value == 'light-theme')
      DataService.setDataInLocal('Theme','light')
    else
      DataService.setDataInLocal('Theme','dark')
  }

  protected checkVersion() {
    let storedVersion = DataService.getDataFromLocal(AppConstants.VERSION);
    let currentVersion = environment.version
    if (currentVersion != storedVersion) {
      console.log("Clearning cache", currentVersion, storedVersion)
      this.clearCache()
      localStorage.removeItem(AppConstants.VERSION);
      DataService.deleteFromLocal (AppConstants.VERSION)
      DataService.setDataInLocal(AppConstants.VERSION, currentVersion)
    } else {
      console.log("Not Clearning cache", currentVersion, storedVersion)
    }
  }

  protected setObjectName(objectName: string) {
    this.objectName = objectName;
    this.checkAccess();
  }

  protected checkAccess() {

    if (this.objectName == "" || this.objectName == null || this.objectName == undefined) {
      return;
    }

    /**
     * Get the access from local/session storage
     */
    let accessString = DataService.getDataFromLocal(AppConstants.ACCESS_KEY);

    if (accessString == "" || accessString == null || accessString == undefined) {
      return;
    }
    let accessList = JSON.parse(accessString);

    let accessObject = accessList.filter((item) => item.object_name == this.objectName);
    if (accessObject == null || accessObject.length <= 0) {
      return;
    }

    this.hasAccess = true;
    if (accessObject[0].charAt(1) == "0") {
      this.hasCreateAccess = false;
    }
    if (accessObject[0].charAt(2) == "0") {
      this.hasReadAccess = false;
    }
    if (accessObject[0].charAt(3) == "0") {
      this.hasUpdateAccess = false;
    }
    if (accessObject[0].charAt(4) == "0") {
      this.hasDeleteAccess = false;
    }
    if (accessObject[0].charAt(5) == "0") {
      this.hasHierarchyAccess = false;
    }


    // for (let i = 0; i < accessList.length; i++) {
    //   if (accessList[i].object_name == this.objectName) {
    //     let access: string = accessList[i].access;
    //     this.hasAccess = true;
    //     if (access.charAt(0) == "0") {
    //       this.hasCreateAccess = false;
    //     }
    //     if (access.charAt(1) == "0") {
    //       this.hasReadAccess = false;
    //     }
    //     if (access.charAt(2) == "0") {
    //       this.hasUpdateAccess = false;
    //     }
    //     if (access.charAt(3) == "0") {
    //       this.hasDeleteAccess = false;
    //     }
    //     if (access.charAt(4) == "0") {
    //       this.hasHierarchyAccess = false;
    //     }
    //     break;
    //   }
    // }
  }

  public isMenuHidden(objectName) {
    return !this.hasObjectAccess(objectName);
  }

  public hasObjectAccess(objectName) {
    if (objectName == "" || objectName == null) {
      return true;
    }

    /**
     * Get the access from local/session storage
     */
    let accessString = DataService.getDataFromLocal(AppConstants.ACCESS_KEY);

    if (accessString == "" || accessString == null || accessString == undefined) {
      return true;
    }

    let accessList = JSON.parse(accessString);

    let accessObject = accessList.filter((item) => item.object_name == objectName);
    if (accessObject == null || accessObject.length <= 0) {
      return true;
    }

    let hasAccess = true;
    let access: string = accessObject[0].access;
    if (access.charAt(2) == "0") {
      hasAccess = false;
    }
    return hasAccess;

  }

  protected handleExcception(exception: Error) {
    console.log(exception);
    if (exception instanceof EtherBaseExcetion) {

    } else {

    }
  }

  protected checkAuthentication() {
    let authKey = localStorage.getItem(AppConstants.AUTH_KEY);
    if (authKey == '' || authKey == null)
      authKey = DataService.getDataFromLocal(AppConstants.AUTH_KEY);
    console.log("Auth key:", authKey)
    // console.log("Router", this.baseRouter)
    if (authKey == '' || authKey == null) {
      this.clearCache();
      return -1
    } else {
      const userData = DataService.getDataFromLocal(AppConstants.USER_OBJECT_KEY);
      if (userData == '' || userData == null) {
        this.clearCache();
      } else {
        const userObject = JSON.parse(userData);
        let exp: string = userObject['expires_on']; // String
        exp = Utils.replaceChar(exp, 10, 'T');
        const expDate = new Date(exp); // By passing exp string

        /* Get Current date and time (UTC) */
        const curDate = Utils.convertDateToUtc(new Date());

        if (curDate > expDate) {
          /* Either auto login or ask to login */
          this.clearCache();
        }
      }
    }
    return 1;
  }

  private clearCache() {

    localStorage.removeItem(AppConstants.AUTH_KEY);
    localStorage.removeItem(AppConstants.USER_OBJECT_KEY);
    localStorage.removeItem(AppConstants.USER_PWD_KEY);
    localStorage.removeItem(AppConstants.LOGIN_ID);


    DataService.deleteFromLocal(AppConstants.AUTH_KEY);
    DataService.deleteFromLocal(AppConstants.USER_OBJECT_KEY);
    DataService.deleteFromLocal(AppConstants.USER_PWD_KEY);
    DataService.deleteFromLocal(AppConstants.LOGIN_ID);

  }



  protected getLoggerInUser() {
    return JSON.parse(DataService.getDataFromLocal(AppConstants.USER_OBJECT_KEY));
  }

  protected getLoggedInUserId() {
    // const userData = JSON.parse(localStorage.getItem(AppConstants.USER_OBJECT_KEY));
    const userData = JSON.parse(DataService.getDataFromLocal(AppConstants.USER_OBJECT_KEY));
    if (userData != null)
      return userData.user_id;
    else
      return null
  }

  protected getLoggedInEntityId() {
    const userData = JSON.parse(DataService.getDataFromLocal(AppConstants.USER_OBJECT_KEY));
    // const userData = JSON.parse(localStorage.getItem(AppConstants.USER_OBJECT_KEY));
    return userData.entity_id;
  }

  protected getLoggedInUserInfo() {
    const userData = JSON.parse(DataService.getDataFromLocal(AppConstants.USER_OBJECT_KEY));
    // const userData = JSON.parse(localStorage.getItem(AppConstants.USER_OBJECT_KEY));
    return userData;
  }

  protected getBaseURL() {
    return location.origin;
  }

  protected isMobile() {
    return this.screenWidth <= 480 ;
  }
}
