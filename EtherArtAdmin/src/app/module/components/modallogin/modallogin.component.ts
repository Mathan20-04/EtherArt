import {Component, OnInit, Output, EventEmitter, HostListener} from '@angular/core';import { MatDialogRef } from '@angular/material/dialog';
import { BaseComponent } from '../base.component';
import { AuthService } from 'src/app/service/auth.service';
import { SharedDataServiceService } from 'src/app/service/shared-data-service.service';
import { Message } from 'src/app/utils/message';

@Component({
  selector: 'app-modallogin',
  templateUrl: './modallogin.component.html',
  styleUrls: ['./modallogin.component.css']
})
export class ModalloginComponent extends BaseComponent implements OnInit {

  @Output() loggedIn: EventEmitter<number> =   new EventEmitter();
  public input = {email_mobile: '', password: '', country_dial_code: ''};

  public isIn : boolean = false ;

  // initial setting
  public showPhone : boolean = true ;
  public showLogin : boolean = true ;

  // when user clicks forgot password
  public showForgot: boolean = false ;

  // after validation of otp
  public showVerify: boolean = false ;

  // to show reset
  public showReset: boolean = false ;

  // for binding otp
  public otp = ''

  // for binding the pwd 1 and 2
  public fpwd = ''
  public frpwd = ''

  constructor(public dialogRef: MatDialogRef<ModalloginComponent>,
    public authService: AuthService,
    public sharedDataService: SharedDataServiceService) {
    super()
   }

  ngOnInit(): void {
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  // get country code and mobile number
  parsePhone(phone: any) {
    let dialCode : String = phone.dialCode;
    let mobile : String = phone.e164Number ;
    let m = mobile.replace(dialCode.toString(),"")
    let d = dialCode.replace("+","");
    this.input.email_mobile = m ;
    this.input.country_dial_code = d ;
  }

  // for login
  login() {
    // try {
      let obj = {} ;
      if (this.phoneForm.status == "VALID") {
        this.parsePhone(this.phoneForm.value.phone);
      } else {
        alert("please enter your phone number");
        return;
      }
      obj['auth_json'] = JSON.stringify(this.input) ;
      this.authService.authenticate(obj).subscribe(
        data => {
          if (data == null) {
            alert("Invalid credentials!")
            return ;
          }
          if (data['token'] != '') {
            let roles = data.data.roles
                if (roles != null) {
                  // if (roles.length < 2) {
                  //   alert("Access denied!")
                  //   return ;
                  // }
                }
            this.isIn = true ;
            // this is for parent dashboard to show refer component
            this.loggedIn.emit();
            // this is for header to enable the person icon
            let message = new Message(data,"login");
            this.sharedDataService.changeMessage(message);
            this.isLoggedIn = true
            this.loggedInUserName = data.data.first_name
            this.closeModal();
          } else {
            alert('Invalid Credentials!');
          }
        },
        error => {
          alert("error!!!")
        }
      )

    // } catch (e) {
    //   alert("error!!!")
    //   this.handleExcception(e);
    // }
  }

  showSignUp() {
    this.loggedIn.emit();
  }

  // enable forgot view
  forgot() {
    this.showForgot = true ;
    this.showLogin = false ;
  }

  sendOTP() {
    try {
      let otpobj = {country_dial_code:-1,mobile:-1}
      if (this.phoneForm.status == "VALID") {
        this.parsePhone(this.phoneForm.value.phone);
      } else {
        alert("please enter your correct phone number");
        return;
      }
      otpobj.country_dial_code = parseInt(this.input.country_dial_code)
      otpobj.mobile = parseInt(this.input.email_mobile)
      let obj = {}
      obj['otp_json'] = JSON.stringify(otpobj) ;
      this.authService.otpForgot(obj).subscribe(
        data => {
          this.showPhone = false ;
          this.showForgot = false ;
          this.showVerify = true ;
        }
      );
    } catch (e) {
      alert("error!!!")
      this.handleExcception(e);
    }
  }

  verifyOTP() {
    try {
      let otpobj = {country_dial_code:-1,mobile:'', otp:-1}
      otpobj.country_dial_code = parseInt(this.input.country_dial_code)
      otpobj.mobile = this.input.email_mobile
      otpobj.otp = parseInt(this.otp)
      let obj = {}
      obj['otp_json'] = JSON.stringify(otpobj) ;
      this.authService.verify(obj).subscribe(
        data => {
          this.showPhone = false ;
          this.showForgot = false ;
          this.showVerify = false ;
          this.showReset = true ;
        }
      );
    } catch (e) {
      alert("error!!!")
      this.handleExcception(e);
    }
  }

  makeLoginVisible() {
    this.showLogin = true ;
    this.showForgot = false;
    this.showVerify = false;
    this.showReset = false;
  }


  resetPWD() {
    try {
      if (this.fpwd != this.frpwd) {
        alert("Entered passwords are not matching!")
        return
      }
      let otpobj = {country_dial_code:-1,mobile:'', password:''}
      otpobj.country_dial_code = parseInt(this.input.country_dial_code)
      otpobj.mobile = this.input.email_mobile
      otpobj.password = this.fpwd
      let obj = {}
      obj['pwd_json'] = JSON.stringify(otpobj) ;
      this.authService.resetPwd(obj).subscribe(
        data => {
          alert("password updated. Please login with new password")
          this.showLogin = true
          this.showPhone = true
          this.showReset = false
        }
      );
    } catch (e) {
      alert("error!!!")
      this.handleExcception(e);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
