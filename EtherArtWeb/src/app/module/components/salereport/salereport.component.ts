import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/service/general.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-salereport',
  templateUrl: './salereport.component.html',
  styleUrls: ['./salereport.component.css']
})
export class SalereportComponent extends BaseComponent implements OnInit {

  public  salesList : Array<any> = [] ;
  public  transList : Array<any> = [] ;
  constructor(public genService: GeneralService) {
    super()
  }

  ngOnInit(): void {
    this.getSalesReport();
  }

  getSalesReport() {
    try {
      let obj = {from_date: null, to_date : null, q: null, page_num: 1, page_size:100} ;
      this.genService.getSalesReport(obj).subscribe(
        data => {
          this.salesList = data.data ;
        }
      );
    } catch (e) {
      this.handleExcception(e);
    }
  }

  clicked(user) {
    // this.getTransList(user.user_id)
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
