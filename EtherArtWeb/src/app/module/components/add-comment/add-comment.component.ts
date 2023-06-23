import {Component, HostListener, OnInit, Inject} from '@angular/core';
import {BaseComponent} from "../base.component";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {TicketService} from 'src/app/service/ticket.service';
import {ItemmsgService} from "../../../service/itemmsg.service";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent extends BaseComponent implements OnInit {

  public comments;
  public msg: any;
  public ticket: any;

  constructor(
    public dialogRef: MatDialogRef<AddCommentComponent>,
    public ticketService: TicketService,
    public itemMsgService: ItemmsgService,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private modalData: any) {
    super();
    this.itemMsgService.currentMessage.subscribe(
      message => (this.msg = message));
    if (this.msg.sender == "addComment") {
      this.ticket = this.msg.data
    }
  }

  ngOnInit(): void {
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
          this.snackBar.open("comment added successfully ", "", { duration: 2000 });
          this.dialogRef.close();
        }, error => {
          alert(error);
        }
      )
    }
  }



  backToTicketList() {
    this.dialogClose();
  }
}
