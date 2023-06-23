import { Component, OnInit } from '@angular/core';
import {Utils} from "../../../utils/Utils";
import {BaseComponent} from "../base.component";
import {CollectionService} from "../../../service/collection.service";
import {Router} from "@angular/router";
import { TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.css']
})
export class ConfigureComponent extends BaseComponent implements OnInit {
  public collectionList: Array<any> = [];
  public partList: Array<any> = [];
  public variantList: Array<any> = [];
  public selectedImageId;
  public selectedFirstPartId;
  public selectedSecondPartId;
  public count = 0;
  public parts: Array<any> = [];
  public firstVariationList: Array<any> = [];
  public secondVariationList: Array<any> = [];
  public isClicked = true;
  public selectedImageConstraints: Array<any> = [];
  public constraintArr: Array<any> = [];
  public load = false;
  public postConstraint: Array<any> = [];
  public constraintExists : boolean = false ;
  public deleteConstraintArr: Array<any> = [];

  constructor(public collectionService: CollectionService, public router: Router) {
    super();
  }

  ngOnInit(): void {
    this.getCollection();
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
            this.processData(data.data)
          }
      );
    } catch (e) {
      alert("error!!!")
      this.handleExcception(e);
    }
    return;
  }

  processData(data: any) {
    let collection = {}
    this.collectionList.push(collection)
    data.forEach(item => {
      let collection = {}
      collection['image_id'] = item.image_id
      collection['created_date'] = Utils.convertDBDateShort(item.created_date, '-')
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

  }

  changeImage(imgId) {
    this.selectedImageId = imgId;
    this.parts = this.partList.filter((item: any) => {
      return item.image_id == this.selectedImageId;
    })
    if (this.selectedImageId != '') {
      let obj = {
        image_id: this.selectedImageId
      };
      this.collectionService.getImageConstraint(obj).subscribe(
          data => {
            this.selectedImageConstraints = data
          }, error => {
            alert(error)
          }
      )
    }
    this.reset()
  }

  reset() {
    this.firstVariationList = []
    this.secondVariationList = []
    this.constraintArr =[]
    this.load = false
    this.constraintExists = false

  }

  changeFirstPart(firstPartId) {
    this.selectedFirstPartId = firstPartId;
    this.firstVariationList = this.variantList.filter((item: any) => {
      return item.part_id == this.selectedFirstPartId
    })
    this.renderCheckBox()
  }

  changeSecondPart(secondPartId) {
    this.selectedSecondPartId = secondPartId;
    this.secondVariationList = this.variantList.filter((item: any) => {
      return item.part_id == this.selectedSecondPartId
    })
    this.renderCheckBox()
  }

  renderCheckBox() {
    this.load = false
    let l1 = this.firstVariationList.length
    let l2 = this.secondVariationList.length
    if (l1 > 0 && l2 > 0) {
      for (let i = 0; i < l1; i++) {
        let a1 = []
        for (let j = 0; j < l2; j++) {
          let v1 = this.firstVariationList[i].variation_id
          let v2 = this.secondVariationList[j].variation_id
          a1.push(this.constraintExist(v1,v2))
          this.constraintExists = true
        }
        this.constraintArr.push(a1)
      }
      this.load = true
    }
  }

  constraintExist(v1,v2) : any {
    if (this.selectedImageConstraints != null ) {
      for (let item of this.selectedImageConstraints) {
        if (
            (item.first_variation_id == v1 && item.second_variation_id == v2) ||
            (item.first_variation_id == v2 && item.second_variation_id == v1)) {
          return true
        }
      }
    }
    return false
  }

  constraintExistForDelete(v1,v2) : any {
    if (this.selectedImageConstraints != null) {
      for (let item of this.selectedImageConstraints) {
        if (
            (item.first_variation_id == v1 && item.second_variation_id == v2) ||
            (item.first_variation_id == v2 && item.second_variation_id == v1)) {
          return  item.constraint_id
        }
      }
    }
    return -1
  }

  saveConstraint() {
    console.log(this.constraintArr)
    // return 
    if(this.selectedImageId != undefined && this.selectedFirstPartId != undefined && this.selectedSecondPartId != undefined) {
      for (let i = 0; i < this.constraintArr.length; i++) {
        let arr = this.constraintArr[i];
        for (let j = 0; j < arr.length; j++) {
          if (arr[j] == true) {
            let postObj = {};
            postObj['image_id'] = this.selectedImageId;
            postObj['first_variation_id'] = this.firstVariationList[i].variation_id;
            postObj['second_variation_id'] = this.secondVariationList[j].variation_id;
            this.postConstraint.push(postObj)
          } else {
            let id = this.constraintExistForDelete(this.firstVariationList[i].variation_id,this.secondVariationList[j].variation_id)
            if (id != -1) {
              let postObj = {};
              postObj['constraint_id'] = id;
              this.deleteConstraintArr.push(postObj)
            }
          }
        }
      }
      let obj = {};
      obj['image_constraints_json'] = JSON.stringify(this.postConstraint);
      this.collectionService.addImageConstraint(obj).subscribe(
          data => {
            if (this.deleteConstraintArr.length > 0) {
              this.deleteConstraint()
            } else {
              alert("Constraints Added Successfully");
            }
          },error => {
            alert("Error!!!");
          }
      )
    } else {
      alert("please select required fields")
    }

  }

  deleteConstraint() {
    let obj = {};
    obj['image_constraints_json'] = JSON.stringify(this.deleteConstraintArr);
    this.collectionService.deleteImageConstraint(obj).subscribe(
        data => {
          alert("Constraints Updated Successfully");
        },error => {
          alert("Error!!!");
        }
    )
  }
}
