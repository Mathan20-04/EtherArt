import { Component, Input, OnInit } from '@angular/core';
import { CollectionService } from 'src/app/service/collection.service';
import { Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listcollection',
  templateUrl: './listcollection.component.html',
  styleUrls: ['./listcollection.component.css']
})
export class ListcollectionComponent extends BaseComponent implements OnInit {
  @Input() list: Array<any> = [];
  @Output() itemSelectedEvent = new EventEmitter<number>();
  public selectedImageId;
  constructor(
    public collectionService: CollectionService,
    private router: Router,
    ) {
    super();
  }

  ngOnInit() {
    if (this.list != null && this.list.length >0)
      this.selectedImageId = this.list[0].image_id
  }

  onImageClick(item) {
    this.selectedImageId = item.image_id;
    this.itemSelectedEvent.emit(item)
  }

  onImageDblClick(item) {
    let obj = {
        action: 'Update',
        item:item
    }
    this.router.navigate(['image'],{state: obj});
  }

  addNew() {
      let obj = {
          action: 'New'
      }
      this.router.navigate(['image'],{ state : obj});
  }
}

