import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedDataServiceService } from 'src/app/service/shared-data-service.service';
import { BaseComponent } from '../base.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listpart',
  templateUrl: './listpart.component.html',
  styleUrls: ['./listpart.component.css']
})
export class ListpartComponent extends BaseComponent implements OnInit {
  @Input() list: Array<any> = [];
  @Input() imageId: number = -1 ;
  @Output() partSelectedEvent = new EventEmitter<number>();
  
  public partList : Array<any> = [] ;
  public collectionItem:any;
  public selectedPartId ;
  constructor(public router: Router, private sharedDataService : SharedDataServiceService) {
    super()
  }

  ngOnInit(): void {
    this.sharedDataService.currentMessage.subscribe(
      message => (this.filterList(message)));
  }

  filterList(msg) {
    if (msg.sender == "collection") {
      this.imageId = msg.data.image_id
      this.collectionItem = msg.data;
      this.partList = this.list.filter((item:any)=>{ return item.image_id == this.imageId;})
      if (this.partList.length >0) {
        this.partSelectedEvent.emit(this.partList[0])
        this.selectedPartId = this.partList[0].part_id
      } else {
        this.partSelectedEvent.emit(null)
      }
    }

  }

  onImageClick(item) {
    this.selectedPartId = item.part_id
    this.partSelectedEvent.emit(item)
  }

  onImageDblClick(item) {
    let obj = {
        action: 'Update',
        item : item,
        collectionItem:this.collectionItem
    }
    this.router.navigate(['/part/'],{ state : obj});
  }

  addNew() {
    let obj = {
      action: 'New',
      imageId : this.imageId,
      collectionItem:this.collectionItem
    }
      this.router.navigate(['/part/'],{ state : obj});
  }
}
