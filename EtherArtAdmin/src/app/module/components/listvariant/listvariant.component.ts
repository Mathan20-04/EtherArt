
import { Component, Input, OnInit } from '@angular/core';
import { SharedDataServiceService } from 'src/app/service/shared-data-service.service';
import { BaseComponent } from '../base.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-listvariant',
  templateUrl: './listvariant.component.html',
  styleUrls: ['./listvariant.component.css']
})
export class ListvariantComponent extends BaseComponent implements OnInit {
  @Input() list: Array<any> = [];
  @Input() partId: number = -1 ;
  public variantlist: Array<any> = [];
  public partItem:any;
  public collectionItem:any;
  public addBtn = false;
  constructor(public router:Router, private sharedDataService : SharedDataServiceService) {
    super()
  }

  ngOnInit(): void {
    this.sharedDataService.currentMessage.subscribe(
      message => (this.filterList(message)));
  }

  filterList(msg) {
    if (msg.sender == "part") {
      if (msg.data != null) {
        this.partId = msg.data.part_id;
      this.partItem = msg.data;
      this.variantlist = this.list.filter((item:any)=>{ return item.part_id == this.partId;})
      } else {
        this.partId = null
        this.partItem = null
        this.variantlist = null;
      }
      
    }
    if(msg.sender == "collection") {
        this.collectionItem = msg.data;
    }
  }

  onImageDblClick(item) {
      let obj = {
          action: 'Update',
          item:item,
          partItem:this.partItem,
          collectionItem:this.collectionItem
      }
    this.router.navigate(['/variant/'],{state: obj});
  }

  addNewVariant() {
      let obj = {
          action: 'New',
          partId : this.partId,
          collectionItem:this.collectionItem,
          partItem: this.partItem
      }
    this.router.navigate(['/variant/'],{ state : obj});
  }
}
