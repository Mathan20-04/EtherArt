import {Component, HostListener, OnInit, Output,EventEmitter} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {PayoutService} from "../../../service/payout.service";
import {BaseComponent} from "../base.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.css']
})
export class AddPaymentComponent extends BaseComponent implements OnInit {
  @Output() childButtonEvent = new EventEmitter();

  public form: FormGroup;
  public paymentOption = ['UPI','NetBanking','Credit/Debit'];
  public payMethod : any;
  public months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  public bankList = [];
  public add = false;
  public userInfo:any;
  public paymentMethod = {
    userId : '',
    bankId : '',
    accNum : '',
    reAccNum : '',
    accHolderName : '',
    ifscCode : '',
    cardNum : '',
    reCardNum:'',
    expiresOn : '',
    cardType : '',
    upiId : '',
    reupiId:'',
  };

  // for stripe payment method
  public isIN = true ;
  public countryCode = "IN"
  public email = ""

  constructor(
    public payoutService :PayoutService,
    public snackBar : MatSnackBar,
  ) {
    super();
  }

  public codes = [
    {"code" : 'AF' , "name": 'Afghanistan'},
    {"code" : 'AX' , "name": 'Aland Islands'},
    {"code" : 'AL' , "name": 'Albania'},
    {"code" : 'DZ' , "name": 'Algeria'},
    {"code" : 'AS' , "name": 'American Samoa'},
    {"code" : 'AD' , "name": 'Andorra'},
    {"code" : 'AO' , "name": 'Angola'},
    {"code" : 'AI' , "name": 'Anguilla'},
    {"code" : 'AQ' , "name": 'Antarctica'},
    {"code" : 'AG' , "name": 'Antigua and Barbuda'},
    {"code" : 'AR' , "name": 'Argentina'},
    {"code" : 'AM' , "name": 'Armenia'},
    {"code" : 'AW' , "name": 'Aruba'},
    {"code" : 'AU' , "name": 'Australia'},
    {"code" : 'AT' , "name": 'Austria'},
    {"code" : 'AZ' , "name": 'Azerbaijan'},
    {"code" : 'BS' , "name": 'Bahamas'},
    {"code" : 'BH' , "name": 'Bahrain'},
    {"code" : 'BD' , "name": 'Bangladesh'},
    {"code" : 'BB' , "name": 'Barbados'},
    {"code" : 'BY' , "name": 'Belarus'},
    {"code" : 'BE' , "name": 'Belgium'},
    {"code" : 'BZ' , "name": 'Belize'},
    {"code" : 'BJ' , "name": 'Benin'},
    {"code" : 'BM' , "name": 'Bermuda'},
    {"code" : 'BT' , "name": 'Bhutan'},
    {"code" : 'BO' , "name": 'Bolivia'},
    {"code" : 'BQ' , "name": 'Bonaire, Sint Eustatius and Saba'},
    {"code" : 'BA' , "name": 'Bosnia and Herzegovina'},
    {"code" : 'BW' , "name": 'Botswana'},
    {"code" : 'BV' , "name": 'Bouvet Island'},
    {"code" : 'BR' , "name": 'Brazil'},
    {"code" : 'IO' , "name": 'British Indian Ocean Territory'},
    {"code" : 'BN' , "name": 'Brunei Darussalam'},
    {"code" : 'BG' , "name": 'Bulgaria'},
    {"code" : 'BF' , "name": 'Burkina Faso'},
    {"code" : 'BI' , "name": 'Burundi'},
    {"code" : 'KH' , "name": 'Cambodia'},
    {"code" : 'CM' , "name": 'Cameroon'},
    {"code" : 'CA' , "name": 'Canada'},
    {"code" : 'CV' , "name": 'Cape Verde'},
    {"code" : 'KY' , "name": 'Cayman Islands'},
    {"code" : 'CF' , "name": 'Central African Republic'},
    {"code" : 'TD' , "name": 'Chad'},
    {"code" : 'CL' , "name": 'Chile'},
    {"code" : 'CN' , "name": 'China'},
    {"code" : 'CX' , "name": 'Christmas Island'},
    {"code" : 'CC' , "name": 'Cocos (Keeling) Islands'},
    {"code" : 'CO' , "name": 'Colombia'},
    {"code" : 'KM' , "name": 'Comoros'},
    {"code" : 'CG' , "name": 'Congo'},
    {"code" : 'CD' , "name": 'Congo, the Democratic Republic of the'},
    {"code" : 'CK' , "name": 'Cook Islands'},
    {"code" : 'CR' , "name": 'Costa Rica'},
    {"code" : 'CI' , "name": 'Cote dIvoire'},
    {"code" : 'HR' , "name": 'Croatia'},
    {"code" : 'CU' , "name": 'Cuba'},
    {"code" : '' , "name": ''},
    {"code" : 'CY' , "name": 'Cyprus'},
    {"code" : 'CZ' , "name": 'Czech Republic'},
    {"code" : 'DK' , "name": 'Denmark'},
    {"code" : 'DJ' , "name": 'Djibouti'},
    {"code" : 'DM' , "name": 'Dominica'},
    {"code" : 'DO' , "name": 'Dominican Republic'},
    {"code" : 'EC' , "name": 'Ecuador'},
    {"code" : 'EG' , "name": 'Egypt'},
    {"code" : 'SV' , "name": 'El Salvador'},
    {"code" : 'GQ' , "name": 'Equatorial Guinea'},
    {"code" : 'ER' , "name": 'Eritrea'},
    {"code" : 'EE' , "name": 'Estonia'},
    {"code" : 'ET' , "name": 'Ethiopia'},
    {"code" : 'FK' , "name": 'Falkland Islands (Malvinas)'},
    {"code" : 'FO' , "name": 'Faroe Islands'},
    {"code" : 'FJ' , "name": 'Fiji'},
    {"code" : 'FI' , "name": 'Finland'},
    {"code" : 'FR' , "name": 'France'},
    {"code" : 'GF' , "name": 'French Guiana'},
    {"code" : 'PF' , "name": 'French Polynesia'},
    {"code" : 'TF' , "name": 'French Southern Territories'},
    {"code" : 'GA' , "name": 'Gabon'},
    {"code" : 'GM' , "name": 'Gambia'},
    {"code" : 'GE' , "name": 'Georgia'},
    {"code" : 'DE' , "name": 'Germany'},
    {"code" : 'GH' , "name": 'Ghana'},
    {"code" : 'GI' , "name": 'Gibraltar'},
    {"code" : 'GR' , "name": 'Greece'},
    {"code" : 'GL' , "name": 'Greenland'},
    {"code" : 'GD' , "name": 'Grenada'},
    {"code" : 'GP' , "name": 'Guadeloupe'},
    {"code" : 'GU' , "name": 'Guam'},
    {"code" : 'GT' , "name": 'Guatemala'},
    {"code" : 'GG' , "name": 'Guernsey'},
    {"code" : 'GN' , "name": 'Guinea'},
    {"code" : 'GW' , "name": 'Guinea-Bissau'},
    {"code" : 'GY' , "name": 'Guyana'},
    {"code" : 'HT' , "name": 'Haiti'},
    {"code" : 'HM' , "name": 'Heard Island and McDonald Islands'},
    {"code" : 'VA' , "name": 'Holy See (Vatican City State)'},
    {"code" : 'HN' , "name": 'Honduras'},
    {"code" : 'HK' , "name": 'Hong Kong'},
    {"code" : 'HU' , "name": 'Hungary'},
    {"code" : 'IS' , "name": 'Iceland'},
    {"code" : 'IN' , "name": 'India'},
    {"code" : 'ID' , "name": 'Indonesia'},
    {"code" : 'IR' , "name": 'Iran, Islamic Republic of'},
    {"code" : 'IQ' , "name": 'Iraq'},
    {"code" : 'IE' , "name": 'Ireland'},
    {"code" : 'IM' , "name": 'Isle of Man'},
    {"code" : 'IL' , "name": 'Israel'},
    {"code" : 'IT' , "name": 'Italy'},
    {"code" : 'JM' , "name": 'Jamaica'},
    {"code" : 'JP' , "name": 'Japan'},
    {"code" : 'JE' , "name": 'Jersey'},
    {"code" : 'JO' , "name": 'Jordan'},
    {"code" : 'KZ' , "name": 'Kazakhstan'},
    {"code" : 'KE' , "name": 'Kenya'},
    {"code" : 'KI' , "name": 'Kiribati'},
    {"code" : 'KP' , "name": 'Korea, Democratic Peoples Republic of'},
    {"code" : 'KR' , "name": 'Korea, Republic of'},
    {"code" : 'KW' , "name": 'Kuwait'},
    {"code" : 'KG' , "name": 'Kyrgyzstan'},
    {"code" : 'LA' , "name": 'Lao Peoples Democratic Republic'},
    {"code" : 'LV' , "name": 'Latvia'},
    {"code" : 'LB' , "name": 'Lebanon'},
    {"code" : 'LS' , "name": 'Lesotho'},
    {"code" : 'LR' , "name": 'Liberia'},
    {"code" : 'LY' , "name": 'Libya'},
    {"code" : 'LI' , "name": 'Liechtenstein'},
    {"code" : 'LT' , "name": 'Lithuania'},
    {"code" : 'LU' , "name": 'Luxembourg'},
    {"code" : 'MO' , "name": 'Macao'},
    {"code" : 'MK' , "name": 'Macedonia, the Former Yugoslav Republic of'},
    {"code" : 'MG' , "name": 'Madagascar'},
    {"code" : 'MW' , "name": 'Malawi'},
    {"code" : 'MY' , "name": 'Malaysia'},
    {"code" : 'MV' , "name": 'Maldives'},
    {"code" : 'ML' , "name": 'Mali'},
    {"code" : 'MT' , "name": 'Malta'},
    {"code" : 'MH' , "name": 'Marshall Islands'},
    {"code" : 'MQ' , "name": 'Martinique'},
    {"code" : 'MR' , "name": 'Mauritania'},
    {"code" : 'MU' , "name": 'Mauritius'},
    {"code" : 'YT' , "name": 'Mayotte'},
    {"code" : 'MX' , "name": 'Mexico'},
    {"code" : 'FM' , "name": 'Micronesia, Federated States of'},
    {"code" : 'MD' , "name": 'Moldova, Republic of'},
    {"code" : 'MC' , "name": 'Monaco'},
    {"code" : 'MN' , "name": 'Mongolia'},
    {"code" : 'ME' , "name": 'Montenegro'},
    {"code" : 'MS' , "name": 'Montserrat'},
    {"code" : 'MA' , "name": 'Morocco'},
    {"code" : 'MZ' , "name": 'Mozambique'},
    {"code" : 'MM' , "name": 'Myanmar'},
    {"code" : 'NA' , "name": 'Namibia'},
    {"code" : 'NR' , "name": 'Nauru'},
    {"code" : 'NP' , "name": 'Nepal'},
    {"code" : 'NL' , "name": 'Netherlands'},
    {"code" : 'NC' , "name": 'New Caledonia'},
    {"code" : 'NZ' , "name": 'New Zealand'},
    {"code" : 'NI' , "name": 'Nicaragua'},
    {"code" : 'NE' , "name": 'Niger'},
    {"code" : 'NG' , "name": 'Nigeria'},
    {"code" : 'NU' , "name": 'Niue'},
    {"code" : 'NF' , "name": 'Norfolk Island'},
    {"code" : 'MP' , "name": 'Northern Mariana Islands'},
    {"code" : 'NO' , "name": 'Norway'},
    {"code" : 'OM' , "name": 'Oman'},
    {"code" : 'PK' , "name": 'Pakistan'},
    {"code" : 'PW' , "name": 'Palau'},
    {"code" : 'PS' , "name": 'Palestine, State of'},
    {"code" : 'PA' , "name": 'Panama'},
    {"code" : 'PG' , "name": 'Papua New Guinea'},
    {"code" : 'PY' , "name": 'Paraguay'},
    {"code" : 'PE' , "name": 'Peru'},
    {"code" : 'PH' , "name": 'Philippines'},
    {"code" : 'PN' , "name": 'Pitcairn'},
    {"code" : 'PL' , "name": 'Poland'},
    {"code" : 'PT' , "name": 'Portugal'},
    {"code" : 'PR' , "name": 'Puerto Rico'},
    {"code" : 'QA' , "name": 'Qatar'},
    {"code" : 'RE' , "name": 'RÃ©union'},
    {"code" : 'RO' , "name": 'Romania'},
    {"code" : 'RU' , "name": 'Russian Federation'},
    {"code" : 'RW' , "name": 'Rwanda'},
    {"code" : 'BL' , "name": 'Saint Barthalemy'},
    {"code" : 'SH' , "name": 'Saint Helena, Ascension and Tristan da Cunha'},
    {"code" : 'KN' , "name": 'Saint Kitts and Nevis'},
    {"code" : 'LC' , "name": 'Saint Lucia'},
    {"code" : 'MF' , "name": 'Saint Martin (French part)'},
    {"code" : 'PM' , "name": 'Saint Pierre and Miquelon'},
    {"code" : 'VC' , "name": 'Saint Vincent and the Grenadines'},
    {"code" : 'WS' , "name": 'Samoa'},
    {"code" : 'SM' , "name": 'San Marino'},
    {"code" : 'ST' , "name": 'Sao Tome and Principe'},
    {"code" : 'SA' , "name": 'Saudi Arabia'},
    {"code" : 'SN' , "name": 'Senegal'},
    {"code" : 'RS' , "name": 'Serbia'},
    {"code" : 'SC' , "name": 'Seychelles'},
    {"code" : 'SL' , "name": 'Sierra Leone'},
    {"code" : 'SG' , "name": 'Singapore'},
    {"code" : 'SX' , "name": 'Sint Maarten (Dutch part)'},
    {"code" : 'SK' , "name": 'Slovakia'},
    {"code" : 'SI' , "name": 'Slovenia'},
    {"code" : 'SB' , "name": 'Solomon Islands'},
    {"code" : 'SO' , "name": 'Somalia'},
    {"code" : 'ZA' , "name": 'South Africa'},
    {"code" : 'GS' , "name": 'South Georgia and the South Sandwich Islands'},
    {"code" : 'SS' , "name": 'South Sudan'},
    {"code" : 'ES' , "name": 'Spain'},
    {"code" : 'LK' , "name": 'Sri Lanka'},
    {"code" : 'SD' , "name": 'Sudan'},
    {"code" : 'SR' , "name": 'Suriname'},
    {"code" : 'SJ' , "name": 'Svalbard and Jan Mayen'},
    {"code" : 'SZ' , "name": 'Swaziland'},
    {"code" : 'SE' , "name": 'Sweden'},
    {"code" : 'CH' , "name": 'Switzerland'},
    {"code" : 'SY' , "name": 'Syrian Arab Republic'},
    {"code" : 'TW' , "name": 'Taiwan, Province of China'},
    {"code" : 'TJ' , "name": 'Tajikistan'},
    {"code" : 'TZ' , "name": 'Tanzania, United Republic of'},
    {"code" : 'TH' , "name": 'Thailand'},
    {"code" : 'TL' , "name": 'Timor-Leste'},
    {"code" : 'TG' , "name": 'Togo'},
    {"code" : 'TK' , "name": 'Tokelau'},
    {"code" : 'TO' , "name": 'Tonga'},
    {"code" : 'TT' , "name": 'Trinidad and Tobago'},
    {"code" : 'TN' , "name": 'Tunisia'},
    {"code" : 'TR' , "name": 'Turkey'},
    {"code" : 'TM' , "name": 'Turkmenistan'},
    {"code" : 'TC' , "name": 'Turks and Caicos Islands'},
    {"code" : 'TV' , "name": 'Tuvalu'},
    {"code" : 'UG' , "name": 'Uganda'},
    {"code" : 'UA' , "name": 'Ukraine'},
    {"code" : 'AE' , "name": 'United Arab Emirates'},
    {"code" : 'GB' , "name": 'United Kingdom'},
    {"code" : 'US' , "name": 'United States'},
    {"code" : 'UM' , "name": 'United States Minor Outlying Islands'},
    {"code" : 'UY' , "name": 'Uruguay'},
    {"code" : 'UZ' , "name": 'Uzbekistan'},
    {"code" : 'VU' , "name": 'Vanuatu'},
    {"code" : 'VE' , "name": 'Venezuela, Bolivarian Republic of'},
    {"code" : 'VN' , "name": 'Viet Nam'},
    {"code" : 'VG' , "name": 'Virgin Islands, British'},
    {"code" : 'VI' , "name": 'Virgin Islands, U.S.'},
    {"code" : 'WF' , "name": 'Wallis and Futuna'},
    {"code" : 'EH' , "name": 'Western Sahara'},
    {"code" : 'YE' , "name": 'Yemen'},
    {"code" : 'ZM' , "name": 'Zambia'},
    {"code" : 'ZW' , "name": 'Zimbabwe'},
  ]



  ngOnInit(): void {
    this.userInfo = this.getLoggedInUserInfo();
    if(this.userInfo.country_dial_code == "91") {
      this.paymentOption = ['UPI','NetBanking']
      this.getBankList()
    } else {
      this.isIN = false
      this.email = this.userInfo.email
    }

    this.paymentMethod.userId = this.getLoggedInUserId()
  }

  addStripe() {
    let postObj = {
      country : this.countryCode,
      email : this.email
    }
    let obj = {};
    obj['user_payment_method_json'] = JSON.stringify(postObj);
    this.payoutService.addUserStripe(obj).subscribe(
      data => {
        console.log(data)
        window.location.href = data.link.url
      }, error => {
        alert(error);
      }
    )
  }

  onPaymethodChange(option){
    this.payMethod = option;
  }

  onCodeChange(val) {
    console.log(val)
    this.countryCode = val
  }

  onChangeBank(bank_id) {
    this.paymentMethod.bankId = bank_id
  }

  getBankList() {
    this.payoutService.getBankList(null).subscribe(
      data => {
        this.bankList = data;
      }, error => {
        alert(error);
      }
    )
  }

  addUPIPaymentMethod() {
    if(this.paymentMethod.userId != '' && this.paymentMethod.upiId != '' && this.paymentMethod.reupiId != '') {
      let regExp = new RegExp(/^[\w.-]+@[\w.-]+$/);
      if(regExp.test(this.paymentMethod.upiId)) {
        console.log("valid");
      } else {
        alert("Please enter valid UPI code")
        return;
      }
    } else {
      alert("please enter UPI id and re-enter UPI id")
    }
  }

  addNetBankingPaymentMethod() {
    if( this.paymentMethod.userId != '' && this.paymentMethod.bankId != '' &&
      this.paymentMethod.accNum != '' && this.paymentMethod.reAccNum != '' &&
      this.paymentMethod.accHolderName != '' &&
      this.paymentMethod.ifscCode != ''
    ) {
      let regExp = new RegExp(/^\d{9,18}$/);
      if(regExp.test(this.paymentMethod.accNum)) {
        console.log("valid");
      } else {
        alert("Please enter valid Account Number")
        return;
      }
      let regExpIFSC = new RegExp(/^[A-Z]{4}0[A-Z0-9]{6}$/);
      if(regExpIFSC.test(this.paymentMethod.ifscCode)) {
        console.log("valid");
      } else {
        alert("Please enter valid IFSC code")
        return;
      }
      if(this.paymentMethod.accNum == this.paymentMethod.reAccNum) {
        this.add = true
        let postObj = {
          user_id : this.paymentMethod.userId,
          bank_id : this.paymentMethod.bankId,
          account_number : this.paymentMethod.accNum,
          account_name : this.paymentMethod.accHolderName,
          ifsc_code : this.paymentMethod.ifscCode,
          card_number : "",
          expires_on : "",
          card_type : "",
          upi_id : ""
        }
        let obj = {};
        obj['user_payment_method_json'] = JSON.stringify(postObj);
        this.payoutService.addUserPayoutMethod(obj).subscribe(
          data => {
            console.log(data)
            if (data.error != undefined || data.error != null)
              this.snackBar.open(data.error, "", { duration: 2000 });
            else
              this.snackBar.open("payment method added successfully ", "", { duration: 2000 });
            this.add = false;
            this.childButtonEvent.emit(data)
            window.location.reload();
          },error => {
            alert(error)
            this.add = false;
          }
        )
      } else {
        alert("account number and re-enter account number does not matching")
      }
    } else {
      alert("please enter all the input fields are required")
    }
  }

  addCardPaymentMethod() {
    if(this.paymentMethod.userId != '' && this.paymentMethod.cardNum  != '' && this.paymentMethod.cardType != '' &&
        this.paymentMethod.expiresOn != '' && this.paymentMethod.reCardNum != ''
    ) {
      let regExp = new RegExp(/^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/);
      if(regExp.test(this.paymentMethod.cardNum)) {
        console.log("valid");
      } else {
        alert("Please enter valid Card Number");
        return;
      }
      if(this.paymentMethod.cardNum === this.paymentMethod.reCardNum) {
        this.add = true;
        let postObj = {
          user_id : this.paymentMethod.userId,
          bank_id : "",
          account_number : "",
          account_name : "",
          ifsc_code : "",
          card_number : this.paymentMethod.cardNum,
          expires_on : this.paymentMethod.expiresOn,
          card_type : this.paymentMethod.cardType,
          upi_id : ""
        };
        let obj = {};
        obj['user_payment_method_json'] = JSON.stringify(postObj);
        this.payoutService.addUserPayoutMethod(obj).subscribe(
            data => {
              this.snackBar.open("payment method added successfully ", "", { duration: 2000 });
              this.add = false;
              this.childButtonEvent.emit(data);
              window.location.reload();
            },error => {
              alert(error);
              this.add = false;
            }
        )
      } else {
        alert("card number and re-enter card number does not matching")
      }
    } else {
      alert("please enter all the input fields are required")
    }
  }

  cancel() {
    this.childButtonEvent.emit(false)
  }
}

