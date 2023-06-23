import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { SharedDataServiceService } from 'src/app/service/shared-data-service.service';
import { Message } from 'src/app/utils/message';
import { BaseComponent } from '../base.component';
import {CollectionService} from "../../../service/collection.service";
import { Utils } from 'src/app/utils/Utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  public ownerbid = "ownerbid"
  public ownersale = "ownersale"
  public recent = "recent"
  public isLoggedIn : boolean = false;
  public showLogin : boolean = false ;
  public showReferral : boolean = false ;
  public showSignUp: boolean = true ;
  public assetList: Array<any> = [];
  public item : any = null ;

  constructor(
    private router: Router,
    private arouter : ActivatedRoute,
    public sharedDataService : SharedDataServiceService,
    public collectionService: CollectionService) {
    super()
    this.arouter.queryParams.subscribe(param => {
      console.log("param is ", param)
      if (param != null && param.fbclid != null) {
        console.log("redirecting")
        this.router.navigate(["join"])
      }
    });
  }

  ngOnInit(): void {
    this.sharedDataService.currentMessage.subscribe(
      message => (this.change(message)));
    document.body.scrollTop = 0;
  }

  // getColection() {
  //   let input = {
  //     q: "",
  //     o: "CREATEDASC",
  //     page_num: 1,
  //     page_size: 100,
  //   };
  //   try {
  //     this.collectionService.getCollection(input).subscribe((data) => {
  //       if (data != null) {
  //         console.log("Collection", data)
  //         this.getMysteryItems(data.data[0].collection_id)
  //       } else {
  //         console.log("No Collection!")
  //       }


  //     });
  //   } catch (e) {
  //     alert("error!!!");
  //     this.handleExcception(e);
  //   }
  //   return;
  // }

  // getMysteryItems(id) {
  //   console.log("mystery item")
  //   let obj = {
  //     id:id, // option to provide the collection to users
  //     limit:4
  //   }
  //   try {
  //     this.collectionService.getMysteryItem(obj).subscribe(
  //       data => {
  //         this.item = data
  //         console.log(this.item)
  //       }
  //     );
  //   } catch (e) {
  //     alert("error!!!")
  //     this.handleExcception(e);
  //   }
  // }

  /* handle message from header */
  change(message : Message) {
    if (message != null ) {
      if (message.sender == "signup" || message.sender == "login" || message.sender == "autologin") {
        console.log(this.showReferral, "logged in ")
        this.showReferral = true ;
        this.showLogin = false ;
        this.showSignUp = false ;
        this.getMyItems()
      }
      if (message.sender == "logout") {
        this.showReferral = false ;
        this.showLogin = false ;
        this.showSignUp = true ;
      }
    }
  }

  makeLoginVisible(visible: boolean) {
    this.showLogin = true ;
    this.showReferral = false ;
    this.showSignUp = false ;
  }

  makeinitSignUpVisible(visible: boolean) {
    this.showLogin = false ;
    this.showReferral = false ;
    this.showSignUp = true ;
  }

  refferClick() {
    this.router.navigate(['referral']);
  }

  loggedInHandler(obj: any) {
    this.isLoggedIn = true ;
  }

  getMyItems() {
    let input = {
      collection_id:null,
      q: "",
      page_num: 1,
      page_size: 100,
    };
    try {
      this.collectionService.getMyItems(input).subscribe(
        data => {
          // paginated item contains two keys
          // data and pages
          // pages contains {total_records and total_pages}
          // data is specific to object

          if (data != null && data.data != null){
            this.assetList = data.data ;
          }
        }
      );
    } catch (e) {
      alert("error!!!")
      this.handleExcception(e);
    }
    return;
  }
}
