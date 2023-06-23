import { Component, OnInit } from '@angular/core';
import {CollectionService} from "../../../service/collection.service";
import {SharedDataServiceService} from "../../../service/shared-data-service.service";
import {Utils} from "../../../utils/Utils";
import {Message} from "../../../utils/message";
import {BaseComponent} from "../base.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-variantrarity',
  templateUrl: './variantrarity.component.html',
  styleUrls: ['./variantrarity.component.css']
})
export class VariantrarityComponent extends BaseComponent implements OnInit {
  public collectionList: Array<any> = [];
  public partList: Array<any> = [];
  public variantList: Array<any> = [];
  public isloaded = false
  public selectVariant = ""
  public collection : any ;
  public selectedImageId = -1 ;
  public selectedPartId = -1 ;
  public selectedCollection:any;
  public isChecked : Array<any> = [] ;
  public checkedVariations: Array<any> = [];
  public loading = false;
  constructor(public collectionService: CollectionService,
            public router : Router,
              public sharedDataService: SharedDataServiceService) {
    super()
    let state = this.router.getCurrentNavigation().extras.state;
    if(state != null) {
      this.collection = state.item;
    } else {
      this.router.navigate(["/"])
    }
    this.getVariantRarity()
  }

  ngOnInit(): void {
  }

  getVariantRarity() {
    let input = {
      collection_id: this.collection.collection_id
    };
    try {
      // this.loading = true;
      this.collectionService.getVariantRarity(input).subscribe(
          data => {
            // paginated item contains two keys
            // data and pages
            // pages contains {total_records and total_pages}
            // data is specific to object
            this.variantList = data ;
            this.variantList.forEach(item => {
              item['isChecked'] = false;
            })
            // console.log(this.variantList)
            // this.loading = false;
            
          }
      );
    } catch (e) {
      alert("error!!!")
      this.handleExcception(e);
    }
    return;
  }

  checked(event, item) {
    if (event.currentTarget.checked) {
      item.isChecked = true;
      this.isChecked.push(item.variation_id)
      let idx = this.checkedVariations.findIndex(
          (i) => i.part_id == item.part_id
      );
      if (idx != -1) {
        this.checkedVariations[idx].isChecked = false;
        this.checkedVariations.splice(idx, 1);
      }
      this.checkedVariations.push(item);
    } else {
      item.isChecked = false;
      let id = this.checkedVariations.findIndex(
          (i) => i.variation_id == item.variation_id
      );
      this.checkedVariations.splice(id, 1);
    }
  }

  search() {
    if(this.isChecked.length == 0) {
      this.selectVariant = '';
    } else {
      this.selectVariant = this.isChecked.toString()
    }

    let obj = {item:this.selectVariant}
    this.router.navigate(['itemrarity'],{state:obj});
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
      collection['tototal_collectiontal'] = item.total_collection
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
              this.variantList.push(variant)
            });
          }
          this.partList.push(itempart)
        });
      }
      this.collectionList.push(collection)
    });
    this.isloaded = true
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
  }
}
