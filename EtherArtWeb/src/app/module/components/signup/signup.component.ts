import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/service/auth.service";
import { SharedDataServiceService } from "src/app/service/shared-data-service.service";
import { Config } from "src/app/utils/Constants";
import { Message } from "src/app/utils/message";
import { BaseComponent } from "../base.component";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from "ngx-intl-tel-input";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent extends BaseComponent implements OnInit {
  @Output() loggedIn: EventEmitter<any> = new EventEmitter();

  public isOTP: boolean = false;
  public sendOTPBtnDisable = false;
  public signUpBtnDisable = false;
  private userData: any;
  public enable = true ;
  public data = {
    fName: "",
    lName: "",
    age: "",
    email: "",
    mobile: "",
    ccode: "",
    password: "",
    rPassword: "",
    invitationCode: "",
    bio: "",
    otp: "",
  };

  constructor(
    public authService: AuthService,
    private router: Router,
    private arouter: ActivatedRoute,
    public sharedDataService: SharedDataServiceService
  ) {
    super();
    let incoming = this.router.getCurrentNavigation().extras.state;
    if (incoming != null) {
      this.phoneForm.controls.phone.setValue(incoming);
      this.parsePhone(incoming);
    }
  }

  ngOnInit(): void {
    this.arouter.queryParams.subscribe((param) => {
      this.data.invitationCode = param.code;
    });
  }

  parsePhone(phone: any) {
    let dialCode: String = phone.dialCode;
    let mobile: String = phone.e164Number;
    let m = mobile.replace(dialCode.toString(), "");
    let d = dialCode.replace("+", "");
    this.data.ccode = d;
    this.data.mobile = m;
  }

  sendOTP() {
    // let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    // if (regexp.test(this.data.email)) {
    //   console.log("valid")
    // } else {
    //   alert("Please enter valid email id");
    //   return;
    // }

    // let regpassword = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/);
    // if(regpassword.test(this.data.password)) {
    //   console.log("valid");
    // } else {
    //   alert("Please enter valid password")
    //   return;
    // }

    if (this.data.password != this.data.rPassword) {
      alert("check password. You have entered different passwords!!!");
      return;
    }

    // get phone number
    if (this.phoneForm.status != "VALID") {
      alert("please enter the valid phone number!");
      return;
    }
    this.sendOTPBtnDisable = true;
    let phone = this.phoneForm.value.phone;
    this.parsePhone(phone);
    let signUpObject: any = {};
    signUpObject.first_name = this.data.fName;
    signUpObject.last_name = this.data.lName;
    signUpObject.age = this.data.age;
    signUpObject.email = this.data.email;
    signUpObject.mobile = this.data.mobile;
    signUpObject.password = this.data.password;
    signUpObject.referred_by = this.data.invitationCode;
    signUpObject.country_dial_code = this.data.ccode;
    signUpObject.profile_picture = "";
    signUpObject.bio = "";
    let obj = {};
    obj["user_json"] = JSON.stringify(signUpObject);
    this.authService.sendOTP(obj).subscribe(
      (data) => {
        console.log(this.data);
        this.isOTP = true;
        this.userData = data;
        this.sendOTPBtnDisable = false;
        setTimeout(()=>{this.enable=false},10000)
      },
      (error1) => {
        alert("Error while Signing Up");
        this.sendOTPBtnDisable = false;
      }
    );
  }

  signUp() {
    this.signUpBtnDisable = true;
    let verifyOTPObject: any = {};
    verifyOTPObject.user_id = this.userData.user_id;
    verifyOTPObject.otp = this.data.otp;
    verifyOTPObject.password = this.data.password
    let obj = {};
    obj["verify_json"] = JSON.stringify(verifyOTPObject);
    this.authService.activate(obj,this.data.mobile, this.data.password).subscribe(
      (data) => {
        alert("Signed Up Successfully");
        this.signUpBtnDisable = false;
        this.loggedIn.emit(data);
        let message = new Message(data, "signup");
        this.sharedDataService.changeMessage(message);
        this.router.navigate(["dashboard"]);
      },
      (error1) => {
        alert("Wrong OTP, please enter correct OTP!!!");
        this.signUpBtnDisable = false;
      }
    );
  }
}
