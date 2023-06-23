import { Component, OnInit } from '@angular/core';
import {Chart, registerables} from "chart.js";

@Component({
  selector: 'app-update-house-price',
  templateUrl: './update-house-price.component.html',
  styleUrls: ['./update-house-price.component.css']
})
export class UpdateHousePriceComponent implements OnInit {
  public priceChart : any;
  public volumeChart : any;
  x = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,15,16,17,18,19,20,21,22,23,24,25]
  y = [134,145,165,155,167,185,234,254,267,289,321,334,346,356,378,389,399,444,432,445,465,476,486,492,567,654,645,764,754,854,864]
  z = [143,234,345,434,453,464,535,563,534,566,577,588,599,634,675,634,623,742,782,723,823,843,853,864,867,923,975,999,232,645]
  /* typeChart data */
  x1 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,15,16,17,18,19,20,21,22,23,24,25]
  y1 = [143,154,167,174,185,196,234,245,278,345,434,453,464,535,563,534,566,577,588,599,634,675,634,623,742,782,723,823,843,853,864,867,923,975,999,232,645]
  z1 = [134,145,165,155,167,185,234,254,267,289,321,334,346,356,378,389,399,444,432,445,465,476,486,492,567,654,645,764,754,854,864]
  a1 = [143,234,345,434,453,464,535,563,534,566,577,588,599,634,675,634,623,742,782,723,823,843,853,864,867,923,975,999,232,645]
  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {

    if (this.priceChart != null) {
      this.priceChart.destroy()
    }
    if(this.volumeChart != null ) {
      this.volumeChart.destroy()
    }

    this.priceChart = new Chart('priceChart', {
      type: "line",
      data: {
        labels: this.x,
        datasets: [
          {
            label: 'primary',
            data:this.y,
            borderColor:'#FF0000',
            backgroundColor:'#FF0000',
          },
          {
            label: 'secondary',
            data:this.z,
            borderColor:'#0000FF',
            backgroundColor:'#0000FF',
          }
        ]
      },options: {
        responsive: true,
        plugins: {
          legend: {
            display : true,
            position:'top'
          },
        }
      },
    })

    this.volumeChart =  new Chart('volumeChart', {
      type: "line",
      data: {
        labels: this.x1,
        datasets: [
          {
            label: 'primary sale',
            data:this.y1,
            borderColor:'#00a2ed',
            backgroundColor:'#00a2ed',
          },
          {
            label: 'secondary sale',
            data:this.z1,
            borderColor:'#FFC0CB',
            backgroundColor:'#FFC0CB',
          },
          {
            label: 'total sales',
            data:this.a1,
            borderColor:'#00ffCB',
            backgroundColor:'#00ffCB',
          }
        ]
      },options: {
        responsive: true,
        plugins: {
          legend: {
            display : true,
            position: 'top',
          },
        }
      },
    })
  }

}
