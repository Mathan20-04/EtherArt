import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {TicketService} from "../../../service/ticket.service";
import {BaseComponent} from "../base.component";
import {SharedDataServiceService} from "../../../service/shared-data-service.service";
import {utils} from "protractor";
import {Utils} from "../../../utils/Utils";

@Component({
  selector: 'app-viewtickets',
  templateUrl: './viewtickets.component.html',
  styleUrls: ['./viewtickets.component.css']
})
export class ViewticketsComponent extends BaseComponent implements OnInit {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  public comments: any;
  public msg: any
  public ticket: any;
  public ticketList: any;
  public userData: any;
  public Activities: Array<any> = [];
  public currentUserId;
  public userRole = '';
  public ticketTypes = [];
  public commentBtn = false;
  constructor(
      public dialogRef: MatDialogRef<ViewticketsComponent>,
      public ticketService: TicketService,
      public sharedDataService: SharedDataServiceService
  ) {
    super();
    this.sharedDataService.currentMessage.subscribe(
        message => (this.msg = message));
    if (this.msg.sender == "addComment") {
      this.ticket = this.msg.data
    }
  }

  ngOnInit(): void {
    this.getTicketList()
  }


  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  dialogClose(): void {
    this.dialogRef.close();
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  addTicketActivity() {
    if (this.comments === undefined || this.comments === '' || this.comments === null) {
      alert("please enter your comments")
    } else {
      this.commentBtn = true;
      let postObj = {
        ticket_id: this.ticket.ticket_id,
        status: this.ticket.status,
        assign_to: '',
        reach_medium: '',
        source:'ADMIN',
        comments: this.comments
      }
      let obj = {};
      obj['ticket_activity_json'] = JSON.stringify(postObj);
      this.ticketService.addTicketActivity(obj).subscribe(
          data => {
            this.comments = '';
            this.commentBtn = false;
            data.created_on = Utils.convertUTC();
            data.created_by = this.getLoggedInUserId()
            this.Activities.push(data)
          }, error => {
            this.commentBtn = false;
            alert(error);
          }
      )
    }
  }

  getTicketList() {
    let obj = {
      from_date: "",
      to_date: "",
      status: "",
      mobile: "",
      email: "",
      is_assigned_to_me: "",
      is_all: "",
      page_num: "",
      page_size: "",
    };
    this.ticketService.getTickets(obj).subscribe(
        (data) => {
          this.ticketList = data.data;
          this.ticketList.forEach(item=>{
            if(item.ticket_id === this.ticket.ticket_id) {
              if(item.activities != null) {
                item.activities.forEach(item=>{
                  this.Activities.unshift(item)
                })
              }
            }
          })
        },
        (error) => {
          alert(error);
        }
    );
  }

  getTypes() {
    this.ticketService.getTicketTypes(null).subscribe(
        (data) => {
          this.ticketTypes = data;
          console.log(this.ticketTypes)
          this.getTicketList();
        },
        (error) => {
          alert(error);
        }
    );
  }

  showTicketType(ticket) {
    let ticketType = "";
    for (let i = 0; i < this.ticketTypes.length; i++) {
      if (this.ticketTypes[i].ticket_type_id == ticket.ticket_type) {
        ticketType = this.ticketTypes[i].ticket_type;
        i = this.ticketTypes.length;
      }
    }
    return ticketType;
  }

  backToTicketList() {
    this.dialogClose()
  }
}
