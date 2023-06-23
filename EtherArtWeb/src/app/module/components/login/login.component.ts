import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { BaseComponent } from "../base.component";
import { AuthService } from "../../../service/auth.service";
import { Router } from "@angular/router";
import { SharedDataServiceService } from "src/app/service/shared-data-service.service";
import { Message } from "src/app/utils/message";
import {fas} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent extends BaseComponent implements OnInit {
  @Output() loggedIn: EventEmitter<number> = new EventEmitter();
  public input = { email_mobile: "", password: "", country_dial_code: "" };

  public isIn: boolean = false;

  // initial setting
  public showPhone: boolean = true;
  public showLogin: boolean = true;

  // when user clicks forgot password
  public showForgot: boolean = false;

  // after validation of otp
  public showVerify: boolean = false;

  // to show reset
  public showReset: boolean = false;
  // for binding otp
  public otp = "";

  // for binding the pwd 1 and 2
  public fpwd = "";
  public frpwd = "";
  public signInBtnDisable = false;
  public sendOTPBtnDisable = false;
  public verifyOTPBtnDisable = false;
  public resetBtnDisable = false;
  public enable = true ;
  constructor(
    public router: Router,
    public authService: AuthService,
    public sharedDataService: SharedDataServiceService
  ) {
    super();
  }

  ngOnInit() {}

  // get country code and mobile number
  parsePhone(phone: any) {
    let dialCode: String = phone.dialCode;
    let mobile: String = phone.e164Number;
    let m = mobile.replace(dialCode.toString(), "");
    let d = dialCode.replace("+", "");
    this.input.email_mobile = m;
    this.input.country_dial_code = d;
  }

  // for login
  login() {
    let obj = {};
    if (this.phoneForm.status == "VALID") {
      this.parsePhone(this.phoneForm.value.phone);
    } else {
      alert("please enter your phone number");
      return;
    }
    this.signInBtnDisable = true;
    obj["auth_json"] = JSON.stringify(this.input);
    this.authService.authenticate(obj).subscribe(
      (data) => {
        console.log(data)
        if (data == null) {
          alert("Invalid credentials!");
          this.signInBtnDisable = false;
          return;
        }
        if (data["token"] != "") {
          console.log(data)
          this.isIn = true;
          this.signInBtnDisable =  false
          // this is for parent dashboard to show refer component
          this.loggedIn.emit();
          // this is for header to enable the person icon
          let message = new Message(data, "login");
          this.sharedDataService.changeMessage(message);
          this.isLoggedIn = true;
          this.loggedInUserName = data.data.first_name;
        } else {
          this.signInBtnDisable =  false
        }
      },
      (error) => {
        alert("Invalid user credentials!")
        this.signInBtnDisable =  false
      }
    );
  }

  showSignUp() {
    this.loggedIn.emit();
  }

  // enable forgot view
  forgot() {
    this.showForgot = true;
    this.showLogin = false;
  }

  sendOTP() {
    try {
      let otpobj = { country_dial_code: -1, mobile: -1 };
      if (this.phoneForm.status == "VALID") {
        this.parsePhone(this.phoneForm.value.phone);
      } else {
        alert("please enter your correct phone number");
        return;
      }
      this.sendOTPBtnDisable = true;
      otpobj.country_dial_code = parseInt(this.input.country_dial_code);
      otpobj.mobile = parseInt(this.input.email_mobile);
      let obj = {};
      obj["otp_json"] = JSON.stringify(otpobj);
      this.authService.otpForgot(obj).subscribe((data) => {
        this.showPhone = false;
        this.showForgot = false;
        this.showVerify = true;
        this.sendOTPBtnDisable = false;
        setTimeout(()=>{this.enable=false},10000)
      },error => {
        alert(error)
        this.sendOTPBtnDisable = false;
      });
    } catch (e) {
      this.sendOTPBtnDisable = false;
      this.handleExcception(e);
    }
  }

  verifyOTP() {
    try {
      this.verifyOTPBtnDisable = true;
      let otpobj = { country_dial_code: -1, mobile: "", otp: -1 };
      otpobj.country_dial_code = parseInt(this.input.country_dial_code);
      otpobj.mobile = this.input.email_mobile;
      otpobj.otp = parseInt(this.otp);
      let obj = {};
      obj["otp_json"] = JSON.stringify(otpobj);
      this.authService.verify(obj).subscribe((data) => {
        this.showPhone = false;
        this.showForgot = false;
        this.showVerify = false;
        this.showReset = true;
        this.verifyOTPBtnDisable = false;
      },error =>  {
        alert(error);
        this.verifyOTPBtnDisable = false;
        }
      );
    } catch (e) {
      alert(e);
      this.verifyOTPBtnDisable = false;
      this.handleExcception(e);
    }
  }

  makeLoginVisible() {
    this.showLogin = true;
    this.showForgot = false;
    this.showVerify = false;
    this.showReset = false;
  }

  resetPWD() {
    try {
      // let regpassword = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/);
      // if(regpassword.test(this.fpwd)) {
      //   console.log("valid");
      // } else {
      //   alert("Please enter valid password")
      //   return;
      // }
      // if (this.fpwd != this.frpwd) {
      //   alert("Entered passwords are not matching!");
      //   return;
      // }
      this.resetBtnDisable = true;
      let otpobj = { country_dial_code: -1, mobile: "", password: "" };
      otpobj.country_dial_code = parseInt(this.input.country_dial_code);
      otpobj.mobile = this.input.email_mobile;
      otpobj.password = this.fpwd;
      let obj = {};
      obj["pwd_json"] = JSON.stringify(otpobj);
      this.authService.resetPwd(obj).subscribe((data) => {
        alert("password updated. Please login with new password");
        this.showLogin = true;
        this.showPhone = true;
        this.showReset = false;
        this.resetBtnDisable = false;
      },error =>  {
        alert(error)
      });
    } catch (e) {
      alert(e)
      this.resetBtnDisable = false;
      this.handleExcception(e);
    }
  }

  verifyCancel() {
    this.showLogin = true;
    this.showForgot = false;
    this.showVerify = false;
    this.showReset = false;
    this.showPhone = true
  }
}
