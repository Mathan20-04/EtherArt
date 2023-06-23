import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-walletitem',
  templateUrl: './walletitem.component.html',
  styleUrls: ['./walletitem.component.css']
})
export class WalletitemComponent extends BaseComponent implements OnInit {

  @Input() item : any ;
  public iconSrc : any
  constructor() {
    super()
  }

  ngOnInit(): void {
    switch (this.item.trans) {
      case "TRANSSIGNUPBONUS":
      case "TRANSUFT":
        this.iconSrc = "assets/earned.svg"
            break ;
      case "TRANSPURCHASE":
        this.iconSrc = "assets/redeem.svg" ;
        break ;
      case "TRANSSALE":
        this.iconSrc = "assets/sold.svg"

    }
  }

}
