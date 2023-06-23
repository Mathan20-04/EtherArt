import {Component, HostListener, AfterViewChecked, ElementRef, ViewChild, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {BaseComponent} from "../base.component";
import {TicketService} from "../../../service/ticket.service";
import {ItemmsgService} from "../../../service/itemmsg.service";
import {Utils} from "../../../utils/Utils";

@Component({
  selector: 'app-view-ticket',
  templateUrl: './view-ticket.component.html',
  styleUrls: ['./view-ticket.component.css']
})
export class ViewTicketComponent extends BaseComponent implements OnInit {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  public comments: any;
  public msg: any
  public ticket: any;
  public mobile;
  public ticketList: any;
  public Activities: Array<any> = [];
  public currentUserId ;

  constructor(
    public dialogRef: MatDialogRef<ViewTicketComponent>,
    public ticketService: TicketService,
    public itemMsgService: ItemmsgService,) {
    super();
    this.itemMsgService.currentMessage.subscribe(
      message => (this.msg = message));
    if (this.msg.sender == "addComment") {
      this.ticket = this.msg.data
    }
    this.ticket.activities.forEach(item=>{
      this.Activities.unshift(item)
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
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
      let postObj = {
        ticket_id: this.ticket.ticket_id,
        status: this.ticket.status,
        assign_to: '',
        reach_medium: '',
        source:'CONSUMER',
        comments: this.comments
      }
      let obj = {};
      obj['ticket_activity_json'] = JSON.stringify(postObj);
      this.ticketService.addTicketActivity(obj).subscribe(
        data => {
          this.comments = ''
          data.created_on = Utils.convertUTC()
          data.created_by = this.getLoggedInUserId()
          this.Activities.push(data);
          this.scrollToBottom()
        }, error => {
          alert(error);
        }
      )
    }
  }

  backToTicketList() {
    this.dialogClose()
  }

}
