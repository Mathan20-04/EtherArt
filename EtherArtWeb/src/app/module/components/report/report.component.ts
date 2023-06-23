import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/service/general.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent extends BaseComponent implements OnInit {

  public  userList : Array<any> = [] ;
  public  transList : Array<any> = [] ;
  constructor(public genService: GeneralService) {
    super()
  }

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList() {
    try {
      let obj = {from_date: null, to_date : null, q: null, page_num: 1, page_size:100} ;
      this.genService.getUserList(obj).subscribe(
        data => {
          this.userList = data.data ;
        }
      );
    } catch (e) {
      this.handleExcception(e);
    }
  }

  clicked(user) {
    this.getTransList(user.user_id)
  }
  getTransList(id) {
    try {
      let obj = {id: id} ;
      this.genService.getTransList(obj).subscribe(
        data => {
          this.transList = data ;
        }
      );
    } catch (e) {
      this.handleExcception(e);
    }
  }

}
