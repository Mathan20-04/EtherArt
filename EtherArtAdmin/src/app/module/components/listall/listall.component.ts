import { Component, OnInit } from '@angular/core';
import { CollectionService } from 'src/app/service/collection.service';
import { SharedDataServiceService } from 'src/app/service/shared-data-service.service';
import { Message } from 'src/app/utils/message';
import { Utils } from 'src/app/utils/Utils';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-listall',
  templateUrl: './listall.component.html',
  styleUrls: ['./listall.component.css']
})
export class ListallComponent extends BaseComponent implements OnInit {

  public collectionList: Array<any> = [];
  public partList: Array<any> = [];
  public variantList: Array<any> = [];
  public isloaded = false

  public selectedImageId = -1 ;
  public selectedPartId = -1 ;
  public selectedCollection:any;
  constructor(public collectionService: CollectionService,
    public sharedDataService: SharedDataServiceService) {
    super()

   }

  ngOnInit(): void {
    this.getCollection()
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
          if (data != null) 
            this.processData(data.data)
          this.isloaded = true
        }
      );
    } catch (e) {
      alert("error!!!")
      this.handleExcception(e);
    }
    return;
  }

  processData(data:any) {
    data.forEach(item => {
      let collection = {}
      collection['image_id'] = item.image_id
      collection['created_date'] = Utils.convertDBDateShortyyyymmdd(item.created_date,'-')
      collection['title'] = item.title
      collection['description'] = item.description
      collection['metadata'] = item.metadata
      collection['price'] = item.price
      collection['width'] = item.width
      collection['length'] = item.length
      collection['total'] = item.total
      collection['tototal_collectiontal'] = item.total_collection
      collection['url'] = item.url
      collection['numparts'] = 0
      collection['rarity_type'] = item.rarity_type
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
          itempart['search_show'] = part.search_show
          if (part.variations != null) {
            let variants = part.variations
            itempart['numvariants'] = variants.length
            variants.forEach(partvariant => {
              let variant = {}
              variant['variation_id'] = partvariant.variation_id
              variant['part_id'] = partvariant.part_id
              variant['metadata'] = partvariant.metadata
              variant['sub_category_id'] = partvariant.sub_category_id
              variant['title'] = partvariant.title
              variant['url'] = partvariant.url
              variant['rep_url'] = partvariant.rep_url
              this.variantList.push(variant)
            });
          }
          this.partList.push(itempart)
        });
      }
      this.collectionList.push(collection)
    });
    this.selectedCollectionItem(this.collectionList[0])
  }


  selectedCollectionItem($event : any) {
    let message = new Message($event, "collection");
    this.sharedDataService.changeMessage(message);
    this.selectedImageId = $event.image_id
    this.selectedCollection = $event;
  }

  selectedPartItem($event : any) {
      if ($event != undefined ) {
          let message = new Message($event, "part");
          this.sharedDataService.changeMessage(message);
          this.selectedPartId = $event.part_id
      }
      if ($event == null) {
          let message = new Message(null, "part");
          this.sharedDataService.changeMessage(message);
          this.selectedPartId = null
      }
  }
}

