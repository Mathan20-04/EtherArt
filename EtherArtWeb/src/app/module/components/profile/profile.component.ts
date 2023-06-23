import {Component, OnInit} from '@angular/core';
import {BaseComponent} from '../base.component';
import {GeneralService} from 'src/app/service/general.service';
import {MyaccountService} from 'src/app/service/myaccount.service';
import {CountryISO} from 'ngx-intl-tel-input';
import {Utils} from 'src/app/utils/Utils';
import {DataService} from 'src/app/service/data.service';
import {LEADING_TRIVIA_CHARS} from '@angular/compiler/src/render3/view/template';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent extends BaseComponent implements OnInit {
  isEditing = true;
  public male = true;
  public checkWhatsApp = true;
  public yearSelected: number;
  public countryiso = CountryISO.India
  public whatsAppNum;
  public showMobile = ''
  public cityName = ''
  public stateName = ''
  public userInfo = {
    firstName: '',
    country_dial_code: '',
    lastName: '',
    mobileNum: '',
    email: '',
    state: '',
    city: '',
    pinCode: '',
    wNum: '',
    gender: 'M',
    birthYear: ''
  };
  public state = []
  public city = []
  public sCity = []
  public years = []

  constructor(
    private genService: GeneralService,
    private accntService: MyaccountService,
    public snackBar: MatSnackBar
  ) {
    super()
    let data = this.getLoggedInUserInfo();
    if (data != null) {
      this.showMobile = "+" + data.country_dial_code + " " + data.mobile
      this.userInfo.lastName = data.last_name;
      this.userInfo.firstName = data.first_name;
      this.userInfo.mobileNum = data.mobile;
      this.userInfo.email = data.email;
      this.userInfo.city = data.city;
      this.userInfo.pinCode = data.pin;
      this.userInfo.birthYear = data.yob;
      this.userInfo.wNum = data.whatsapp_number;
      this.whatsAppNum = this.userInfo.wNum
      this.checkWhatsApp = data.enable_whatsapp_notification == 1 ? true : false
      this.male = data.gender == "M" ? true : false
      this.userInfo.country_dial_code = data.country_dial_code
      if (this.userInfo.country_dial_code != '91') {
        this.countryiso = CountryISO.UnitedStates
      }
      this.phoneForm.controls['phone'].disable();
    }
    let lastyear: number = Utils.getCurrentYear() - 15
    for (let i = 1910; i < lastyear; i++)
      this.years.push(i)
    this.getGeoData()

  }

  ngOnInit() {
    this.male = true;
    if(this.userInfo.firstName == '')
      this.isEditing = true;
    else
      this.isEditing = false;
  }

  getStateName(id) {
    let userState = this.state.filter((item) => item.state_id == id)
    if (userState.length > 0) {
      return userState[0].state_name
    }
    return ""
  }

  editClicked() {
    console.log(this.userInfo)
    let m = ''
    let d = ''
    if (this.isEditing == false) {
      this.isEditing = true
      this.phoneForm.controls['phone'].enable();
      return;
    } else {
      if (!this.emailValidation())
        return
      if (this.checkWhatsApp) {
        let dialCode: String = this.whatsAppNum.dialCode;
        let mobile: String = this.whatsAppNum.e164Number;
        m = mobile.replace(dialCode.toString(), "")
        d = dialCode.replace("+", "");
      }

      let obj = {
        first_name: this.userInfo.firstName,
        last_name: this.userInfo.lastName,
        email: this.userInfo.email,
        enable_whatsapp_notification: this.checkWhatsApp ? 1 : 0,
        whatsapp_number: m,
        age: Utils.getCurrentYear() - parseInt(this.userInfo.birthYear),
        gender: this.userInfo.gender,
        state:this.userInfo.state,
        city: this.userInfo.city,
        yob: this.userInfo.birthYear,
        pin: this.userInfo.pinCode
      };
      console.log(obj)
      try {
        let sObj = {user_json: JSON.stringify(obj)};
        this.accntService.updateProfile(sObj).subscribe(
          data => {
            this.snackBar.open("Your Profile Updated Successfully!", "", {duration: 3000});
          });
      } catch (e) {
        this.handleExcception(e);
      }
      this.isEditing = false;
    }
  }

  showInput() {
    this.checkWhatsApp = !this.checkWhatsApp
    this.whatsAppNum = this.userInfo.mobileNum
  }

  selectMale() {
    this.userInfo.gender = "M";
    this.male = true;
  }

  selectFemale() {
    this.userInfo.gender = "F";
    this.male = false;
  }

  getGeoData() {
    let obj = {country_dial_code: 91}
    try {
      this.genService.getGeoData(obj).subscribe(
        data => {
          this.processGeoData(data)
        }
      );
    } catch (e) {
      this.handleExcception(e);
    }
  }

  processGeoData(states) {
    states.forEach(state => {
      let sObj = {state_id: null, state_name: null}
      sObj.state_id = state.state_id
      sObj.state_name = state.state_name
      this.state.push(sObj)
      let cities = state.cities
      cities.forEach(city => {
        let cObj = {state_id: null, city_id: null, city_name: null}
        cObj.state_id = sObj.state_id
        cObj.city_id = city.city_id
        cObj.city_name = city.city_name
        this.city.push(cObj)
      });
    });
    let userCity = this.city.filter((item) => item.city_id == this.userInfo.city)
    console.log(userCity)
    if (userCity.length > 0) {
      this.userInfo.state= userCity[0].state_id
      this.filterCities(userCity[0].state_id)
      this.userInfo.city = userCity[0].city_id
    }
  }

  onChangeYear(obj) {
    this.userInfo.birthYear = this.years[obj]
  }

  onChangeState(obj) {
    console.log(obj)
    let state = this.state.filter((st) => st.state_id == obj)
    this.filterCities(state[0].state_id)
  }

  onChangeCity(obj) {
    let city = this.city.filter((ct) => ct.city_id == obj)
    this.userInfo.city = city[0].city_id
    console.log(city, this.userInfo.city)
  }

  filterCities(id) {
    this.sCity = this.city.filter((city) => city.state_id == id)
  }

  emailValidation(): boolean {
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regexp.test(this.userInfo.email)) {
      return true
    } else {
      alert("Enter Valid Email Id");
      return false
    }
  }
}
