import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit } from "@angular/core";
import { BaseComponent } from "../base.component";
import { GeneralService } from "src/app/service/general.service";
import { CollectionService } from "src/app/service/collection.service";
import { Router } from "@angular/router";
import { OrderService } from "src/app/service/order.service";
import { Message } from "src/app/utils/message";
import { CartService } from "src/app/service/cart.service";
import { ItemmsgService } from "src/app/service/itemmsg.service";
import { MenuserviceService } from "src/app/service/menuservice.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Utils } from "../../../utils/Utils";
@Component({
  selector: "app-tagged",
  templateUrl: "./tagged.component.html",
  styleUrls: ["./tagged.component.css"]
})
export class TaggedComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  /* part of other component */
  /* called from dashboard */
  @Input() value: any;

  /* state parameter from menu click */
  public param: any;

  /* list of NFTs*/
  public assetList: Array<any> = [];

  /* string of ids of NFTs to get the details */
  public ids = "";
  /* details */
  public bids: Array<any> = [];
  public sales: Array<any> = [];
  public activities: Array<any> = [];

  /* for search and filter*/
  public showFilter: boolean = false;
  public variantList: Array<any> = [];
  public searchParts: any;
  public selectVariant = "";
  public expandedIndex = 0;
  public isChecked: Array<any> = [];
  public checkedVariations: Array<any> = [];
  public loading = false;

  /* for handing the message start and finish */
  public subject = new Subject<any>();

  /* apply the style for search / no search */
  public cardClass = "col-sm-12";
  public cardItemClass = "col-md-4 col-xs-12 col-sm-6  col-lg-3";

  /* dont show filter */
  public isDashBoard = false;

  // for menu collection items
  public collectionID = -1;
  public queryChanged = true;
  public pageSize = 30;
  public numPages = -1;
  public currPage = 1;
  public totalRec = 0;

  constructor(
    public genService: GeneralService,
    public collectionService: CollectionService,
    public orderService: OrderService,
    public cartService: CartService,
    public itemMsgService: ItemmsgService,
    public menuMsgSrvice: MenuserviceService,
    private router: Router
  ) {
    super();
    if (this.router.getCurrentNavigation() != null) {
      this.param = this.router.getCurrentNavigation().extras.state;
      this.menuMsgSrvice.currentMessage
        .pipe(takeUntil(this.subject))
        .subscribe((message) => this.onMessageRecv(message));
    }
  }

  ngOnInit() {
    console.log("Tagged", this.value)
    if (this.value == "ownersale") {
      this.isDashBoard = true;
      this.getTrend("Sale");
    } else if (this.value == "recent") {
      this.isDashBoard = true;
      this.getRecent();
    } else if (this.value == "ownerbid") {
      this.isDashBoard = true;
      this.getTrend("Bid");
    }
    if (this.param != null) {
      if (this.param.id != null) {
        // menu click .. get the collection items
        this.value = "collection"
        this.collectionID = this.param.id;
        this.getListOfItemsInCollection();
      }
      if (this.param.option != null) {
        // menu click .. get the favourite items
        this.value = "favourite"
        this.getItems(this.param.option);
      }
    } else {
      // neither menu click nor part of other component
      this.router.navigate(["dashboard"]);
    }
    // this.getPartsAndVariants();
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

  reset() {
    this.queryChanged = true;
    this.currPage = 1;
    this.numPages = -1;
    this.assetList = [];
  }

  onMessageRecv(msg) {
    if (msg == undefined || msg == null) {
      return;
    }
    if (msg.sender == "Menu") {
      this.reset();
      this.collectionID = msg.data.id;
      this.getListOfItemsInCollection();
    }
  }

  getTrend(status) {
    console.log(status)
    try {
      let obj = { limit: 100};
      this.genService.getTrending(obj).subscribe((data) => {

        let list : Array<any> = [];
        if (status == 'Sale')
          list = data.filter((item)=>item.status == 'ONSALE')
        else
          list = data.filter((item)=>item.status == 'ONBID')
        console.log(list)
        if (list.length < 16) {
          this.assetList=list
        } else {
          for (let i = 0 ; i < 16 ; i++) {
            this.assetList.push(list[i])
          }
        }
        console.log(this.assetList)
        this.doPostFetch();
      });
    } catch (e) {
      this.handleExcception(e);
    }
  }

  getRecent() {
    try {
      let obj = { limit: 16 };
      this.genService.getRecent(obj).subscribe((data) => {
        this.assetList = data;
        this.doPostFetch();
      });
    } catch (e) {
      this.handleExcception(e);
    }
  }

  getItems(str) {
    if (str == "favourite") {
      this.getMyFavourites();
      return;
    }
  }

  getMyItems() {
    let input = {
      collection_id: null,
      q: "",
      page_num: 1,
      page_size: 100,
    };
    try {
      this.collectionService.getMyItems(input).subscribe((data) => {
        // paginated item contains two keys
        // data and pages
        // pages contains {total_records and total_pages}
        // data is specific to object
        this.assetList = data.data;
        this.doPostFetch();
      });
    } catch (e) {
      alert("error!!!");
      this.handleExcception(e);
    }
    return;
  }

  getMyFavourites() {
    if (this.queryChanged) {
      this.selectVariant = "";
      this.checkedVariations.forEach((element) => {
        this.selectVariant = ""
          ? element.variation_id
          : this.selectVariant + "," + element.variation_id;
      });
      this.currPage = 1;
      this.numPages = 0;
      this.totalRec = 0;
      this.queryChanged = false;
      this.assetList = [];
    }
    if (this.numPages > 0 && this.currPage > this.numPages)
      return;


    let input = {
      collection_id: null,
      q: "",
      variations: this.selectVariant,
      page_num: this.currPage++,
      page_size: this.pageSize,
    };
    try {
      this.collectionService.getFavourites(input).subscribe((data) => {
        if (data != null) {
          // console.log(data);
          this.numPages = data.pages.total_pages;
          this.totalRec = data.pages.total_records;
          this.assetList.push(...data.data);
          this.doPostFetch();
          this.loading = false;
        }
      });
    } catch (e) {
      alert("error!!!");
      this.handleExcception(e);
    }
    return;
  }

  getIds() {
    this.ids = "";
    if(this.assetList != null) {
      this.assetList.forEach((element) => {
        this.ids =
          this.ids == "" ? element.detail_id : this.ids + "," + element.detail_id;
      });
    }
  }
  doPostFetch() {
    this.getIds();
    this.getBids();
  }
  getMyTransaction() {
    let obj = { from_date: "", to_date: "", page_num: 1, page_size: 20 };
    try {
      this.orderService.myTransaction(obj).subscribe((data) => {});
    } catch (e) {
      this.handleExcception(e);
    }
  }

  sortByStatus(a, b) {
    if (a.owner_id < b.owner_id) {
      return -1;
    }
    if (a.owner_id > b.owner_id) {
      return 1;
    }
    return 0;
  }

  sortByLikes(a, b) {
    if (a.likes < b.likes) {
      return -1;
    }
    if (a.likes > b.likes) {
      return 1;
    }
    return 0;
  }

  sortList(order) {
    this.assetList = [];
  }

  getBids() {
    let obj = { ids: this.ids };
    try {
      this.collectionService.getItemBids(obj).subscribe((data) => {
        this.bids = data;
        this.embedBids();
        this.getSales();
      });
    } catch (e) {
      this.handleExcception(e);
    }
  }

  embedBids() {
    if (this.bids != null) {
      this.bids.forEach((element) => {
        let item = this.assetList.filter(
          (item) => item.detail_id == element.item_id
        );
        if (item.length > 0) {
          if (item[0].bids == null) {
            item[0].bids = [];
          }
          item[0].bids.push(element);
        }
      });
    }
    let message = new Message(null, "afterBidsFetch");
    this.itemMsgService.changeMessage(message);
  }

  getSales() {
    let obj = { ids: this.ids };
    try {
      this.orderService.getSaleDataById(obj).subscribe((data) => {
        this.sales = data;
        this.embedSales();
        this.getActivities();
      });
    } catch (e) {
      this.handleExcception(e);
    }
  }

  embedSales() {
    if (this.sales != null) {
      this.sales.forEach((element) => {
        let item = this.assetList.filter(
          (item) => item.detail_id == element.item_id
        );
        if (item.length > 0) {
          if (item[0].sale == null) {
            item[0].sale = [];
          }
          item[0].sale.push(element);
        }
      });
    }
    let message = new Message(null, "afterSalesFetch");
    this.itemMsgService.changeMessage(message);
  }

  getActivities() {
    let obj = { ids: this.ids };
    try {
      this.cartService.getActivityDataById(obj).subscribe((data) => {
        this.activities = data;
        this.embedActivities();
        // console.log(this.assetList);
      });
    } catch (e) {
      this.handleExcception(e);
    }
  }

  embedActivities() {
    if (this.activities != null) {
      this.activities.forEach((element) => {
        let item = this.assetList.filter(
          (item) => item.detail_id == element.collection_detail_id
        );
        if (item.length > 0) {
          if (item[0].activity == null) {
            item[0].activity = [];
          }
          item[0].activity.push(element);
        }
      });
    }
    let message = new Message(null, "afterActivityFetch");
    this.itemMsgService.changeMessage(message);
  }

  filterNavBar() {
    this.showFilter = !this.showFilter;
    if (this.showFilter) {
      this.cardClass = "col-sm-9";
      this.cardItemClass = "col-md-4 col-sm-6 col-lg-4 col-xs-12 mincard";
    } else {
      this.cardClass = "col-sm-12";
      this.cardItemClass = "col-md-4 col-xs-12 col-sm-6  col-lg-3";
    }
    this.doPostFetch();
  }

  getPartsAndVariants() {
    let obj = { id: Utils.getImageIDForMystery() };
    try {
      this.collectionService.getPartsAndVariants(obj).subscribe((data) => {
        // this.items = data.parts
        if(data != null) {
          console.log(data)
          this.searchParts = data.parts.filter((part) => part.search_show == 1);
          this.searchParts.forEach((parts) => {
            parts.variations.forEach((variant) => {
              variant["isChecked"] = false;
            });
          });
        }
      });
    } catch (e) {
      alert("error!!!");
      this.handleExcception(e);
    }
  }

  checked(event, item) {
    this.queryChanged = true;
    if (event.currentTarget.checked) {
      item.isChecked = true;
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
    this.fetch()
  }

  // comes only from menu
  getListOfItemsInCollection() {
    if (this.queryChanged) {
      this.selectVariant = "";
      this.checkedVariations.forEach((element) => {
        this.selectVariant = ""
          ? element.variation_id
          : this.selectVariant + "," + element.variation_id;
      });
      this.currPage = 1;
      this.numPages = 0;
      this.totalRec = 0;
      this.queryChanged = false;
      this.assetList = [];
    }
    if (this.numPages > 0 && this.currPage > this.numPages) return;
    let obj = {
      id: this.collectionID,
      o: "",
      variations: this.selectVariant,
      page_num: this.currPage++,
      page_size: this.pageSize,
    };
    try {
      this.collectionService
        .getListOfItemsInCollection(obj)
        .subscribe((data) => {
          if (data != null) {
            // console.log(data);
            this.numPages = data.pages.total_pages;
            this.totalRec = data.pages.total_records;
            this.assetList.push(...data.data);
            this.doPostFetch();
            this.loading = false;
          }
        });
    } catch (e) {
      alert("error!!!");
      this.handleExcception(e);
    }
  }

  closeSelectedVariation(item, i) {
    item.isChecked = false;
    this.checkedVariations.splice(i, 1);
    this.queryChanged = true;
    this.getListOfItemsInCollection();
  }

  clearAll() {
    this.checkedVariations = [];
    this.searchParts.forEach((parts) => {
      parts.variations.forEach((variant) => {
        variant["isChecked"] = false;
      });
    });
    this.queryChanged = true;
    this.getListOfItemsInCollection();
  }

  fetch() {
    switch (this.value) {
      case "collection":
        console.log("collection")
        this.getListOfItemsInCollection()
        break ;
      case "favourite":
        console.log("favourite")
        // this.getMyFavourites()
        break
      case "recent" :
        console.log("recent")
        break
      case "trend" :
        console.log("trend")
        break
      case "reserved":
        console.log("reserved")
        break
      default:
        console.log("default?")
        break
    }
  }

  onWindowScroll(e) {
    // console.log(e)
    console.log("Scroll Event", window.pageYOffset );
  }
  scroll() {
    if (this.isDashBoard) {
      return
    }
    this.getListOfItemsInCollection();
  }
}
