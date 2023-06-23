import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../base.component";
import {CountryISO} from "ngx-intl-tel-input";
import {Chart, registerables} from "chart.js";
import {Utils} from "../../../utils/Utils";
import {TicketService} from "../../../service/ticket.service";
import {ViewticketsComponent} from "../viewtickets/viewtickets.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {Message} from "../../../utils/message";
import {SharedDataServiceService} from "../../../service/shared-data-service.service";
import {AddCommentComponent} from "../add-comment/add-comment.component";

@Component({
  selector: 'app-tickets-page',
  templateUrl: './tickets-page.component.html',
  styleUrls: ['./tickets-page.component.css']
})
export class TicketsPageComponent extends BaseComponent implements OnInit {
  public ticketList: any;
  public chart:any;
  public typeChart:any;
  public countryiso = CountryISO.India;
  public phoneNum;
  public isfilterOpen = false;
  public ticketTypes = [];
  public isDialogOpen = false;
  /* chart data */
  x = ['Open','New','WIP']
  y = [26,12,8]

  /* typeChart data */
  x1=['Account','wallet','buy','bid and sale','general']
  y1=[13,28,13,8,4]

  constructor(private ticketService :TicketService,
              public dialog: MatDialog,
              private sharedDataService:SharedDataServiceService) {
    super();
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.getTypes();

    if (this.chart != null) {
      this.chart.destroy()
    }
    if(this.typeChart != null ) {
      this.typeChart.destroy()
    }

    this.chart = new Chart('canvas', {
      type: "bar",
      data: {
        labels: this.x,
        datasets: [
          {
            label: '',
            data:this.y,
            borderColor:'#FF0000',
            backgroundColor:'#FF0000',
          }
        ]
      },options: {
        responsive: true,
        plugins: {
          legend: {
            display : false,
            position:'top'
          },
        }
      },
    })

    this.typeChart =  new Chart('typeChart', {
      type: "bar",
      data: {
        labels: this.x1,
        datasets: [
          {
            label: '',
            data:this.y1,
            borderColor:'#00a2ed',
            backgroundColor:'#00a2ed',
          }
        ]
      },options: {
        responsive: true,
        plugins: {
          legend: {
            display : false,
            position: 'top',
          },
        }
      },
    })
  }

  filterOpen() {
    this.isfilterOpen = ! this.isfilterOpen
  }

  getTypes() {
    this.ticketService.getTicketTypes(null).subscribe(
        (data) => {
          this.ticketTypes = data;
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
          if(data != null) {
            this.ticketList = data.data;
          }
        },
        (error) => {
          alert(error);
        }
    );
  }

  showTypeDesc(id) {
    let ret = "";
    for (let i = 0; i < this.ticketTypes.length; i++) {
      if (this.ticketTypes[i].ticket_type_id == id) {
        ret = this.ticketTypes[i].ticket_type;
        i = this.ticketTypes.length;
      }
    }
    return ret;
    // let idx = this.ticketTypes.findIndex((item) => (5 == item.ticket_type_id))
    // console.log(idx)
    // if (idx >= 0)

    // return ret
  }


  showDateYYYY(dt, char) {
    return Utils.convertDBDateShortyyyymmdd(dt, char);
  }

  openAddComment(ticket) {
    let message = new Message(ticket, "addComment");
    this.sharedDataService.changeMessage(message);
    if (!this.isDialogOpen) {
      this.isDialogOpen = true;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.id = "modal-add-comment";
      dialogConfig.width = "500px";
      dialogConfig.height = "400px";
      dialogConfig.data = ticket;
      const dialogRef = this.dialog.open(AddCommentComponent, dialogConfig);
      dialogRef.afterClosed().subscribe((data) => {
        this.isDialogOpen = false;
      });
    }
  }


  openViewTicket(ticket) {
    if (!this.isDialogOpen) {
      this.isDialogOpen = true;
      let message = new Message(ticket, "addComment");
      this.sharedDataService.changeMessage(message);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.id = "modal-view-ticket";
      dialogConfig.width = "70vw";
      dialogConfig.height = "95vh";
      dialogConfig.data = ticket;
      const dialogRef = this.dialog.open(ViewticketsComponent, dialogConfig);
      dialogRef.afterClosed().subscribe((data) => {
        this.isDialogOpen = false;
      });
    }
  }
}
