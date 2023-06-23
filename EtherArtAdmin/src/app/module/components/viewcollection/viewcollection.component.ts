import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {map} from "rxjs/operators";
import {BaseComponent} from "../base.component";
import {Utils} from "../../../utils/Utils";
import {ViewPage} from "../../../utils/Constants";
import {SharedDataServiceService} from "../../../service/shared-data-service.service";
import {CollectionService} from "../../../service/collection.service";
import {Router} from "@angular/router";
import {LEADING_TRIVIA_CHARS} from "@angular/compiler/src/render3/view/template";

@Component({
  selector: 'app-viewcollection',
  templateUrl: './viewcollection.component.html',
  styleUrls: ['./viewcollection.component.css']
})
export class ViewcollectionComponent extends BaseComponent  implements OnInit {

  public collectionList: Array<any> = [];
  public partList: Array<any> = [];
  public showPartList: Array<any> = [];
  public variantList: Array<any> = [];
  public selectedImageId = -1 ;
  public selectedPartId = -1 ;
  public selectedCollection:any;
  public releaseDate = '29/05/2022';
  public collection_id;
  public collectionListObject;
  public collections;
  public viewPage = ViewPage.Generate
  public releaseList : Array<any> = []
  public genList : Array<any> = []
  public loading = false;

  constructor(public router : Router,public sharedDataService: SharedDataServiceService, public collectionService:CollectionService) {
    super();
    switch (router.url) {
      case '/view' :
        this.viewPage = ViewPage.Generate
        break ;
      case '/release' :
        this.viewPage = ViewPage.Release
        break ;
      case '/rarity' :
        this.viewPage = ViewPage.Rarity
        break ;
      case '/browse' :
        this.viewPage = ViewPage.Browse
        break ;
    }
    this.getCollection();
  }

  ngOnInit() {
  }

  print() {
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
            console.log(data)
            this.processData(data.data)
            this.getCollections();
          }
      );
    } catch (e) {
      alert("error!!!")
      this.handleExcception(e);
    }
    return;
  }


  filterPartList(image_id) {
    this.showPartList = this.partList.filter((item:any)=>{ return item.image_id == image_id;})
    this.selectedImageId = image_id;
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
      collection['total_collection'] = item.total_collection
      collection['url'] = item.url
      collection['numparts'] = item.parts != null ? item.parts.length : 0
      let variant = 0
      if (item.parts != null) {
        let parts = item.parts
        parts.forEach(part => {
          if (part.variations != null) {
            variant = variant + part.variations.length
          }
        });
      }
      collection['numvariants'] = variant
      this.collectionList.push(collection)
    });

    this.selectedImageId = this.collectionList[0].image_id
    this.genList = this.collectionList;
    this.releaseList = this.collectionList;
  }

  generate(item) {
    let obj = {item:item}
    this.router.navigate(['generate'],{state:obj});
  }

  rarity(item) {
    let obj = {item:item}
    this.router.navigate(['variantrarity'],{state:obj});
  }

  view(item) {
    let obj = {
      item:item
    }
    this.router.navigate(['generatedCollections'],{state:obj})
  }

  addCollectionId(){
    this.collectionList.forEach((item)=>{
      let col_item = this.collectionListObject.filter((col_item) => col_item.image_id == item.image_id)
      if (col_item.length > 0) {
        item['collection_id'] = col_item[0].collection_id
        if (col_item[0].release_date != null){
          item['releaseDate'] = col_item[0].release_date.split(" ")[0]
        }
      }
      else
        item['collection_id'] = undefined
    })
    this.releaseList = this.collectionList.filter((item) => (item.total_collection > 0 ) )
    this.genList = this.collectionList.filter((item) => ( item.numparts > 2 && item.numvariants > 2 ) )
  }

  getCollections() {
    let obj = {
        q: '',
        o: '',
        page_num: 1,
        page_size: 1000
    };
    this.loading = true;
    this.collectionService.getCollections(obj).subscribe(
        data => {
          if (data != null) {
            this.collectionListObject = data['data'];
            this.addCollectionId();
          }  
          this.loading = false;
        }, error => {
          this.loading = false;
          alert("error!!!");
        }
    )
  }

  update(item) {
    if (item.collection_id != null && item.releaseDate) {
      try {
        let postObj = {
          collection_id: item.collection_id,
          release_date: Utils.convertddmmyyyytoyyyymmdd(item.releaseDate, '-')
        }
        let obj = {};
        obj['release_json'] = JSON.stringify(postObj);
        this.collectionService.updateRelaseDate(obj).subscribe(
            data => {
              alert("Release Date Updated SuccessFully");
            }, error => {
              alert("error!!!");
            })
      } catch (e) {
        alert("error!!!")
        this.handleExcception(e);
      }
    } else {
      alert("please enter release date")
    }

  }

}
