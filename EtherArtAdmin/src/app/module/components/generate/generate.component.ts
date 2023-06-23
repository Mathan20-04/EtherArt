import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../base.component";
import { Router } from "@angular/router";
import { CollectionService } from "../../../service/collection.service";
import { Message } from "../../../utils/message";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { PreviewComponent } from "../preview/preview.component";
import { SharedDataServiceService } from "../../../service/shared-data-service.service";

@Component({
  selector: "app-generate",
  templateUrl: "./generate.component.html",
  styleUrls: ["./generate.component.css"],
})
export class GenerateComponent extends BaseComponent implements OnInit {
  public collectionItem: any;
  public numToGenrate: any;
  public collectionImageId: any;
  public genCollectionList: any;
  public collectionName;
  public loading = false;
  constructor(
    public router: Router,
    public dialog: MatDialog,
    private collectionService: CollectionService,
    public sharedDataService: SharedDataServiceService
  ) {
    super();
    let state = this.router.getCurrentNavigation().extras.state;
    if (state != null) {
      this.collectionItem = state.item;
      this.collectionImageId = this.collectionItem.image_id;
    } else {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit(): void {
    this.getGeneratedCollectionList();
    // this.getGenHistory();
  }

  generateCollection() {
    try {
      let obj = {};
      obj["image_id"] = this.collectionImageId;
      obj["total"] = this.numToGenrate;
      obj["action"] = "VARIATION";
      // this.loading = true;
      this.collectionService.generateCollection(obj).subscribe(
        (data) => {
          alert("Generated Successfully");
          this.loading = false;
          this.getGeneratedCollectionList();
        },
        (error) => {
          alert("Error while Generating!!!");
        }
      );
    } catch (e) {
      alert("error!!!");
      this.handleExcception(e);
    }
  }

  getGenHistory() {
    if (this.collectionItem != undefined && this.collectionItem != null) {
      try {
        let obj = { collection_id: this.collectionItem.collection_id };
        this.collectionService.getGenHistory(obj).subscribe(
          (data) => {},
          (error) => {
            alert("error");
          }
        );
      } catch (e) {
        alert("error!!!");
        this.handleExcception(e);
      }
    }
  }

  getGeneratedCollectionList() {
    try {
      this.loading = true;
      let obj = { id: this.collectionImageId };
      this.collectionService.getCollectListForImage(obj).subscribe(
        (data) => {
          if (data != null) {
            this.genCollectionList = data["collection"];
          }
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      );
    } catch (e) {
      alert("error!!!");
      this.handleExcception(e);
    }
  }

  traits(item) {
    this.router.navigate(["/traits/"], { state: item });
  }

  preview(item) {
    let message = new Message(item, "preview");
    this.sharedDataService.changeMessage(message);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "100vh";
    dialogConfig.width = "100vw";
    this.dialog.open(PreviewComponent, dialogConfig);
  }
}
