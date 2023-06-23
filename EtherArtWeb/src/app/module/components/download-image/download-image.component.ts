import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {Utils} from "../../../utils/Utils";
import {CollectionService} from "../../../service/collection.service";
import {BaseComponent} from "../base.component";
import html2canvas from 'html2canvas';
import {deleteOutputDir} from "@angular-devkit/build-angular/src/utils";

@Component({
  selector: 'app-download-image',
  templateUrl: './download-image.component.html',
  styleUrls: ['./download-image.component.css']
})
export class DownloadImageComponent extends BaseComponent implements OnInit {

  public item;
  public collectionName;
  public collection;
  public traitItem : any = [];
  public parts = [] ;

  @ViewChild("screen") screen: ElementRef;
  @ViewChild("canvas") canvas: ElementRef;
  @ViewChild("downloadLink") downloadLink: ElementRef;

  constructor(private router:Router,
              private collectionService:CollectionService,
              // private exportAsService: ExportAsService
  ) {
    super();
    if (this.router.getCurrentNavigation().extras.state !=  undefined) {
      let obj = this.router.getCurrentNavigation().extras.state;
      this.item = obj.item
      this.collection = Utils.getCollectionForNFT(this.item)
      this.collectionName = this.collection.title == null ? "Collection Name" : this.collection.title
    }
  }

  ngOnInit(): void {
    document.body.scrollTop = 0;
    this.getPartsAndVariants();
  }

  downloadImage() {
    html2canvas(this.screen.nativeElement,{useCORS:true}).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL();
      this.downloadLink.nativeElement.download = "EtherArt #"+this.item.detail_id+".png";
      this.downloadLink.nativeElement.click();
    });
  }

  getPartsAndVariants() {
    let obj = { id: this.item.collection_id };
    try {
      this.collectionService.getPartsAndVariants(obj).subscribe((data) => {
        // this.items = data.parts
        if(data != null) {
          this.parts = data.parts
          // console.log(this.parts)
        }
        this.getItemRarity()
      });
    } catch (e) {
      alert("error!!!");
      this.handleExcception(e);
    }
  }

  getItemRarity() {
    let obj = {
      item_id : this.item.detail_id
    }
    this.collectionService.getItemsRarity(obj).subscribe(
      data=>{
        // console.log(data)
        data.forEach(element => {
          element['showTitle'] = element.title
          let part = this.parts.filter((part) => part.part_id == element.part_id && part.search_show == 1)
          if (part.length > 0)
            this.traitItem.push(element)
        });
        console.log(this.traitItem)
      },error => {
        alert(error);
      }
    )
  }

}
