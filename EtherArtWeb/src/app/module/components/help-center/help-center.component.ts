import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../base.component";
import {CountryISO} from "ngx-intl-tel-input";
import { TicketService } from 'src/app/service/ticket.service';
import {Utils} from "../../../utils/Utils";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-help-center',
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.css']
})
export class HelpCenterComponent extends BaseComponent implements OnInit {

  public countryiso = CountryISO.India;
  public phoneNum ;
  public email;
  public desc;
  public sub;
  public file ;
  public imageUrl ;
  public ticketTypes = [] ;
  public bDisablePhone = false ;
  public subTypes = [] ;
  public ticketSubTypeId = -1 ;
  public ticketTypeId = -1;
  public loading = false;
  public actionStatus = -1 ; // begun is 0,  1 is complete 500 is error
  public actionIcon = ""
  public submitLoads;
  constructor(
    private ticketService: TicketService,
    private router:Router,
    public snackBar: MatSnackBar) {
    super();
  }

  ngOnInit(): void {
    this.getTicketTypes()
    let data = this.getLoggedInUserInfo() ;
    if (data != null) {
      this.bDisablePhone = true
      this.email = data.email;
      this.phoneNum =  data.mobile;
      if (data.country_dial_code != '91') {
        this.countryiso = CountryISO.UnitedStates
      }
    }
  }

  getTicketTypes() {
    this.ticketService.getTicketTypes(null).subscribe(
      data=>{
        this.ticketTypes = data;
      },error => {
        alert(error);
      }
    )
  }

  changeType(type,event) {
    this.ticketTypeId = type.ticket_type_id
    this.subTypes = type.sub_types ;
    console.log(type)
    console.log(event)
  }

  upload(event) {
    this.file = event.target.files[0] ;
    var reader = new FileReader();
    reader.readAsDataURL(this.file)
    reader.onload = (_event) => {
        this.imageUrl = reader.result;
    }
  }

  checkMandatory() {
    // console.log("type",this.ticketTypeId,"subtype", this.ticketSubTypeId,"subj", this.sub,"des",this.desc)
    if (this.ticketTypeId == -1 || this.sub == undefined || this.ticketSubTypeId == -1 || this.desc == undefined ) {
      return false
    } else {
      return true
    }
  }

  submitTicket() {
    this.submitLoads = true
    if(this.checkMandatory()) {
      if (this.phoneForm.status == "VALID") {
        this.parsePhone(this.phoneForm.value.phone);
      } else {
        alert("please enter your phone number");
        return;
      }
      this.loading = true
      this.actionStatus = 0
      let obj = {
        country_dial_code : this.CountryISO,
        mobile_number : this.phoneNum,
        email_id : this.email,
        ticket_type : this.ticketTypeId,
        sub_ticket_type : this.ticketSubTypeId,
        ticket_description : this.desc,
        ticket_title : this.sub
      }

      this.ticketService.addTickets(obj,this.file,"ticket_json").subscribe(
        data => {
          this.actionStatus = 1
          this.loading = false;
          this.submitLoads = false;
          this.snackBar.open("Ticket Submitted Successfully", "", { duration: 2000 });
          this.router.navigate(['mytickets'])
        },error => {
          this.actionStatus = 500
          this.actionIcon = "error"
          this.loading = false;
          this.submitLoads = false;
          alert(error);
        }
      );
    } else {
      alert("please fill all the input fields are mandatory")
      this.submitLoads = false;
    }

  }

  parsePhone(phone: any) {
    this.CountryISO= phone.dialCode;
    this.phoneNum = phone.e164Number;
  }

  alertSelectIssue() {
    if(this.subTypes.length == 0) {
      alert("please select any one issue type")
      return;
    }
  }

  goback() {
    this.router.navigate(['dashboard'])
  }
}
