import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../base.component";
import { Router } from "@angular/router";
import { TicketService } from "../../../service/ticket.service";
import { Utils } from "../../../utils/Utils";
import {
  MatDialog,
  MatDialogConfig,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { AddCommentComponent } from "../add-comment/add-comment.component";
import { ViewTicketComponent } from "../view-ticket/view-ticket.component";
import {ItemmsgService} from "../../../service/itemmsg.service";
import {Message} from "../../../utils/message";

@Component({
  selector: "app-mytickets-page",
  templateUrl: "./mytickets-page.component.html",
  styleUrls: ["./mytickets-page.component.css"],
})
export class MyticketsPageComponent extends BaseComponent implements OnInit {
  public ticketList: any;
  public mobile;
  public email;
  public ticketTypes = [];
  public isDialogOpen = false;
  public pageSize = 15
  public pageNum = 1 ;

  constructor(
    private router: Router,
    public itemMsgService : ItemmsgService,
    private ticketService: TicketService,
    public dialog: MatDialog
  ) {
    super();
    // console.log(this.modalData)
  }

  ngOnInit(): void {
    let data = this.getLoggedInUserInfo();
    if (data != null) {
      this.email = data.email;
      this.mobile = data.mobile;
      this.getTypes();
    }
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

  openHelpCenter() {
    this.router.navigate(["help-center"]);
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


  getTicketList() {
    let obj = {
      from_date: "",
      to_date: "",
      status: "",
      page_num: this.pageNum,
      page_size: this.pageSize,
    };
    this.ticketService.getMyTickets(obj).subscribe(
      (data) => {
        if (data != null)
          this.ticketList = data.data;
      },
      (error) => {
        alert(error);
      }
    );
  }

  showDateYYYY(dt, char) {
    return Utils.convertDBDateShortyyyymmdd(dt, char);
  }

  openAddComment(ticket) {
    let message = new Message(ticket, "addComment");
    this.itemMsgService.changeMessage(message);
    if (!this.isDialogOpen) {
      this.isDialogOpen = true;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.id = "modal-add-comment";
      if(!this.isMob) {
        dialogConfig.width = "35vw";
        dialogConfig.height = "70vh";
      }
      dialogConfig.data = ticket;
      const dialogRef = this.dialog.open(AddCommentComponent, dialogConfig);
      dialogRef.afterClosed().subscribe((data) => {
        this.isDialogOpen = false;
      });
    }
  }

  openViewTicket(ticket) {
    let message = new Message(ticket, "addComment");
    this.itemMsgService.changeMessage(message);
    if (!this.isDialogOpen) {
      this.isDialogOpen = true;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.id = "modal-view-ticket";
      if(!this.isMob) {
        dialogConfig.width = "90vw";
        dialogConfig.height = "100vh";
      }
      dialogConfig.data = ticket;
      const dialogRef = this.dialog.open(ViewTicketComponent, dialogConfig);
      dialogRef.afterClosed().subscribe((data) => {
        this.isDialogOpen = false;
      });
    }
  }
}
