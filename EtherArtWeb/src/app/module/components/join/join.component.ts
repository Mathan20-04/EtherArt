import { Component, OnInit } from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {SharedDataServiceService} from "../../../service/shared-data-service.service";
import {AuthService} from "../../../service/auth.service";
import {Message} from "../../../utils/message";
import {BaseComponent} from "../base.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent extends BaseComponent implements OnInit {

  public isOTP;
  public mobileNumber;
  public disable = false
  public otp;
  public userData;
  public password;
  public rePassword
  public signUpBtnDisable = false;
  public sendOTPBtnDisable = false;
  public timeup = false ;
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
    otp: ""
  } ;
  customOptions:OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    autoplay: true,
    navSpeed:700,
    autoplaySpeed:1000,
    center: true,
    // navText: ['<i class=\'fa fa-angle-left\'></i>', '<i class=\'fa fa-angle-right\'></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      },
      1140 : {
        items: 3
      }
    },
    // nav: true
  }

  constructor(
    public sharedDataService: SharedDataServiceService,
    public authService: AuthService,
    public router : Router) {
    super();
    let message = new Message(1,"join");
    this.sharedDataService.changeMessage(message);
  }

  ngOnInit(): void {
  }


  parsePhone(phone: any) {
    let dialCode : String = phone.dialCode;
    let mobile : String = phone.e164Number ;
    let m = mobile.replace(dialCode.toString(),"")
    let d = dialCode.replace("+","");
    this.data.ccode = d ;
    this.data.mobile = m ;
  }

  sendOTP() {
    if (this.phoneForm.status != "VALID") {
      alert("please enter the valid phone number!")
      return
    }
    this.sendOTPBtnDisable = true;
    let phone = this.phoneForm.value.phone  ;
    this.parsePhone(phone)
    let signUpObject: any = {};
    signUpObject.first_name = "" ;
    signUpObject.last_name = "" ;
    signUpObject.age = "";
    signUpObject.email = "";
    signUpObject.mobile = this.data.mobile ;
    signUpObject.password = "" ;
    signUpObject.referred_by ="";
    signUpObject.country_dial_code =this.data.ccode;
    signUpObject.profile_picture = "" ;
    signUpObject.bio = "fb" ;
    let obj = {}
    obj['user_json'] = JSON.stringify(signUpObject);
    this.authService.sendOTP(obj).subscribe(
      data => {
        this.isOTP = true ;
        this.timeup=true
        this.disable = true
        this.userData = data ;
        this.sendOTPBtnDisable = false;
        setTimeout(()=>{this.enable=false},10000)
        console.log(data);
      }, error => {
        alert(error);
        this.sendOTPBtnDisable = false;
      }
    );
  }

  signUp() {
    // let regpassword = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/);
    // if(regpassword.test(this.data.password)) {
    //   console.log("valid");
    // } else {
    //   alert("Please enter valid password")
    //   return;
    // }
    if(this.data.otp == '') {
      alert("Please enter otp")
      return;
    }
    if (this.data.password != this.data.rPassword) {
      alert("check password. You have entered different passwords!!!");
      return;
    }
    this.signUpBtnDisable = true;
    let verifyOTPObject: any = {};
    verifyOTPObject['user_id']= this.userData.user_id ;
    verifyOTPObject['otp'] = this.data.otp ;
    verifyOTPObject['password'] = this.data.password;
    let obj = {}
    obj['verify_json'] = JSON.stringify(verifyOTPObject);
    this.authService.activate(obj,this.data.mobile, this.data.password).subscribe(
      data => {
        alert('Signed Up Successfully');
        this.loggedIn.emit(data);
        console.log(data)
        this.signUpBtnDisable = false;
        let message = new Message(data,"signup");
        this.sharedDataService.changeMessage(message);
        this.router.navigate(['dashboard'])
      }, error1 => {
        alert('Wrong OTP, please enter correct OTP!!!');
        this.signUpBtnDisable = false;
      }
    );

  }

  cancelSignup() {
    this.isOTP =! this.isOTP;
  }

}
