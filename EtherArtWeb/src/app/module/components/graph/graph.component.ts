import {Component, OnDestroy, OnInit} from '@angular/core';
import {Chart, registerables} from "chart.js";
import {Router} from "@angular/router";
import { GeneralService } from 'src/app/service/general.service';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Utils } from 'src/app/utils/Utils';


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit , OnDestroy {

  chart: any = null;
  /* original data */
  x = []
  y = []
  z = []

  /* filtered data */
  x1=[]
  y1=[]
  z1=[]

  constructor(
    private router: Router,
    private genSrvc: GeneralService,
    public http: HttpClient
    ) {
    Chart.register(...registerables);
  }

  ngOnDestroy(): void {
    if (this.chart != null) {
      this.chart.destroy()
    }
  }

  ngOnInit(): void {
    this.getGraphData();
  }

  buildChart() {
    if (this.chart != null) {
      this.chart.destroy()
    }
    console.log(this.chart)
    this.chart = new Chart('canvas', {
      type: "line",
      data: {
        labels: this.x1,
        datasets: [
          {
            label: "BTC",
            data: this.y1,
            backgroundColor: '#FF0000',
            borderColor: '#FF0000',
            fill: false,
          },
          {
            label: "Sensex",
            data: this.z1,
            backgroundColor: '#0000FF',
            borderColor: '#0000FF',
            fill: false,
          }
        ]
      }
    })
  }

  filter(num) {
    // alert(num)
    let len = this.x.length
    this.x1 = []
    this.z1 = []
    this.y1 =[]
    for (let i =0; i < num; i++) {
      this.x1.push(this.x[len-num+i])
      this.y1.push(this.y[len-num+i])
      this.z1.push(this.z[len-num+i])
    }
    this.buildChart()
  }
  getGraphData()  {
    try {
      let obj = {days: 772} ; // get last 2 years data
      this.genSrvc.getCryptoHistoricalData(obj).subscribe(
        data => {
          this.gen(data)
        }
      );
    } catch (e) {
      alert("Exception ! Graph data")
    }
  }
  gen(data) {
    data.forEach(item => {
      this.x.push(Utils.convertDBDateShortyyyymmdd(item.date,'-'))
      this.y.push(item.btc)
      this.z.push(item.sensex)
    });
    this.filter(356)
    Utils.setBTCRate(data[0].btc)
  }
}

