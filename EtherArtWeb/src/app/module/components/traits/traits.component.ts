import {Component, HostListener, OnInit} from '@angular/core';
import {BaseComponent} from "../base.component";
import {CollectionService} from "../../../service/collection.service";
import {MatDialogRef} from "@angular/material/dialog";
import { ItemmsgService } from 'src/app/service/itemmsg.service';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-traits',
  templateUrl: './traits.component.html',
  styleUrls: ['./traits.component.css']
})
export class TraitsComponent extends BaseComponent implements OnInit {

  public item;
  public msg;
  public traitItem = [];
  public parts = [] ;
  constructor(
    public itemMsgService:ItemmsgService,
    public collectionService:CollectionService,
    public dialogRef: MatDialogRef<TraitsComponent>) {
    super();
    this.itemMsgService.currentMessage.subscribe(
      message => (this.msg=message));
    if(this.msg.sender == "traits")
      this.item = this.msg.data;
  }

  ngOnInit(): void {
    this.getPartsAndVariants();
  }

  getPartsAndVariants() {
    let obj = { id: this.item.collection_id };

    try {
      this.collectionService.getPartsAndVariants(obj).subscribe((data) => {
        // this.items = data.parts
        if(data != null) {
          this.parts = data.parts
          console.log(this.parts)
        }
        this.getItemRarity()
      });
    } catch (e) {
      alert("error!!!");
      this.handleExcception(e);
    }
  }

  getVariantRepImage(element) {
    let part = this.parts.filter((part) => part.part_id == element.part_id);
    if (part.length >0) {
      let variant = part[0].variations.filter((variant) => variant.variation_id == element.variation_id)
      if (variant.length > 0) {
        return variant[0].rep_url == null ? element.variation_url + '&s=700' : variant[0].rep_url + '&s=700'
      }
    }
    return element.variation_url + '&s=700'
  }
  getItemRarity() {
    let obj = {
      item_id : this.item.detail_id
    }
    this.collectionService.getItemsRarity(obj).subscribe(
      data=>{
        console.log(data)
        data.forEach(element => {
          // element['url_700'] =   this.item.owner_id == null ? 'assets/mystery.jpeg' : this.getVariantRepImage(element)
          // element['showTitle'] = this.item.owner_id == null ? 'xxx' : element.part_title
          element['url_700'] =   this.getVariantRepImage(element)
          element['showTitle'] = element.title
          let part = this.parts.filter((part) => part.part_id == element.part_id && part.search_show == 1)
          if (part.length > 0)
            this.traitItem.push(element)
        });
        console.log(this.traitItem)
        // this.traitItem = data;
      },error => {
        alert(error);
      }
    )
  }

  close(): void {
    this.dialogRef.close();
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

}
