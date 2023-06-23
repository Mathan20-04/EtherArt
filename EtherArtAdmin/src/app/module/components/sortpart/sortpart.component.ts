import { Component, OnInit } from '@angular/core';
import {map} from "rxjs/operators";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Observable} from "rxjs";
import {BaseComponent} from "../base.component";
import {GeneralService} from "../../../service/general.service";
import {Utils} from "../../../utils/Utils";
import {Message} from "../../../utils/message";
import {SharedDataServiceService} from "../../../service/shared-data-service.service";
import {CollectionService} from "../../../service/collection.service";

@Component({
  selector: 'app-sortpart',
  templateUrl: './sortpart.component.html',
  styleUrls: ['./sortpart.component.css']
})
export class SortpartComponent extends BaseComponent implements OnInit {
  public collectionList: Array<any> = [];
  public partList: Array<any> = [];
  public showPartList: Array<any> = [];
  public selectedImageId = -1 ;
  public selectedPartId = -1 ;
  public selectedCollection:any;
  public canSort = true ;
  constructor( public sharedDataService: SharedDataServiceService, public collectionService:CollectionService) {
    super();
    this.getCollection();
  }
  ngOnInit() {

  }


  getCollection() {
    let input = {
      q: "",
      page_num: 1,
      page_size: 100,
    };
    try {
      this.collectionService.getImages(input).subscribe(
          data => {
            // paginated item contains two keys
            // data and pages
            // pages contains {total_records and total_pages}
            // data is specific to object
            this.processData(data.data)
          }
      );
    } catch (e) {
      alert("error!!!")
      this.handleExcception(e);
    }
    return;
  }

  onClickImage(item,image_id) {
    this.filter(image_id);
    if (item.total_collection > 0) {
      alert("Already collections are done! Cant change the part sort now!")
      this.canSort = false ;
    } else 
      this.canSort = true;
  }

  filter(image_id) {
    this.showPartList = this.partList.filter((item:any)=>{ return item.image_id == image_id;})
    this.selectedImageId = image_id;
  }
  processData(data:any) {
    data.forEach(item => {
      let collection = {}
      collection['image_id'] = item.image_id
      collection['created_date'] = Utils.convertDBDateShort(item.created_date,'-')
      collection['title'] = item.title
      collection['description'] = item.description
      collection['metadata'] = item.metadata
      collection['price'] = item.price
      collection['width'] = item.width
      collection['length'] = item.length
      collection['total'] = item.total
      collection['total_collection'] = item.total_collection
      collection['url'] = item.url
      collection['numparts'] = 0
      if (item.parts != null) {
        let parts = item.parts
        collection['numparts'] = parts.length
        parts.forEach(part => {
          let itempart = {}
          itempart['image_id'] = part.image_id
          itempart['part_id'] = part.part_id
          itempart['metadata'] = part.metadata
          itempart['part_order'] = part.part_order
          itempart['title'] = part.title
          itempart['category_id'] = part.category_id
          itempart['url'] = part.url
          itempart['numvariants'] = 0

          this.partList.push(itempart)
        });
      }
      this.collectionList.push(collection)
    });
    this.selectedImageId = this.collectionList[0].image_id
    this.filter(this.selectedImageId)
  }

  drop(event: CdkDragDrop<{title: string; icon: string}[]>) {
    if (!this.canSort) {
      alert("Can't sort now! Already images are generated!")
      return 
    }
    moveItemInArray(this.showPartList, event.previousIndex, event.currentIndex);
  }

  updatePartOrder() {
    if (this.canSort == false) {
      alert("Parts already sorted and images are generated!")
      return ;
    }
    let partList:any = [];
    for(let i = 0 ; i < this.showPartList.length ; i++) {
      let obj = {};
      obj['part_id'] = this.showPartList[i].part_id;
      obj['order'] = i + 1;
      partList.push(obj);
    }
    this.collectionService.updatePartOrder(partList).subscribe(
        data=>{
          alert("part ordered successfully");
        }
    )
  }
}
