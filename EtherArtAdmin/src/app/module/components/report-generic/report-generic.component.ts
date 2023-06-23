import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../base.component";
import {Router} from "@angular/router";
import { ReportService } from 'src/app/service/report.service';

@Component({
  selector: 'app-report-generic',
  templateUrl: './report-generic.component.html',
  styleUrls: ['./report-generic.component.css']
})
export class ReportGenericComponent extends BaseComponent implements OnInit {

  public uiControl;
  public obj;
  public reportData ;
  public isLoaded = false 
  public showreport = false 
  public columns: any = []
  public datas: any = []
  constructor(public router:Router, public reportService : ReportService) {
    super();
    let state = this.router.getCurrentNavigation().extras.state;
    if (state == null) {
      router.navigate(['/'])
    }
    this.obj = state ;
    if (state.configuration != null)
      this.uiControl = state.configuration.ui_controls;
  }

  ngOnInit(): void {
    this.addFields()
  }

  addFields() {
    if (this.uiControl != null && this.uiControl.length > 0)
      this.uiControl.forEach(element => {
        element.model = -1
        if (element.data_procedure != '' && element.dependent_control_id == '')
          this.getDataList(element,null) 
      });
      this.isLoaded = true
  }

  getDataList(item,value: null) {
    let params = { sp_name:item.data_procedure,
    sp_param :  value}
    try {
      item.list = []
      item.list.push({id:-1, value: 'Select'})
      this.reportService.getDropDowns(params).subscribe(
          data => {
            item.list.push(...data)
          }
      );
    } catch (e) {
      alert("error!!!")
      this.handleExcception(e);
    }
  }

  onChange(obj, val) {
    // check the dependent dropdown if any
    obj.model = val ;
    this.uiControl.forEach(element => {
      if (element.dependent_control_id == obj.id) {
        this.getDataList(element, obj.model)
        return 
      }
    });
  }

  showReport() {
    let params = { report_id: this.obj.report_id}
      try {
        if (this.uiControl != null) {
          this.uiControl.forEach(element => {
            params[element.query_key] = element.model == -1 ? '': element.model
          });
        } 
        

        this.reportService.getReportDetails(params).subscribe(
            data => {
              this.columns = []
              this.reportData = []
              let dt = this.replaceAll(data,"'","\"")
              this.reportData = JSON.parse(dt)
              this.process()
              this.showreport = true
            }
        );
      } catch (e) {
        alert("error!!!")
        this.handleExcception(e);
      }
  }

  process() {
    this.reportData.columns.forEach(col => {
      let i = {Name: '', Key:'',Type:''}
      let val = col.split(":")
      if (val.length > 0) {
        i.Name = val[0]
        i.Key = val[1]
        i.Type = val[2]
        this.columns.push(i)
      }
    });
  }

  replaceAll(str, find, replace) {
    var escapedFind=find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
  }

  align(item) {
    // console.log(item.Type)
    if (item.Type == 'FLOAT' || item.Type == 'INT') {
      return 'alignRight'
    } else {
      return ''
    }
  }
}
