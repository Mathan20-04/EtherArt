import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {BaseComponent} from "../base.component";
import {CollectionService} from "../../../service/collection.service";

@Component({
  selector: 'app-traits',
  templateUrl: './traits.component.html',
  styleUrls: ['./traits.component.css']
})
export class TraitsComponent extends BaseComponent implements OnInit {

  public item:any;
  public traitItem:any;

  constructor(public router:Router,public collectionService:CollectionService) {
    super();
    let state = this.router.getCurrentNavigation().extras.state;
    if (state != null) {
      this.item = state;
    }

  }

  ngOnInit(): void {
    this.getItemRarity();
  }

  getItemRarity() {
    let obj = {
      item_id : this.item.detail_id
    }
    this.collectionService.getItemsRarity(obj).subscribe(
        data=>{
          this.traitItem = data;
        },error => {
          alert(error);
        }
    )
  }

}
