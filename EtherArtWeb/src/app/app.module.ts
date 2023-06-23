/* Other Components */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatBadgeModule} from '@angular/material/badge';
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from '@angular/material/card';
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {ImgMagnifier} from "ng-img-magnifier";
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSidenavModule} from "@angular/material/sidenav";
import {CarouselModule} from "ngx-owl-carousel-o";
import {CdkAccordionModule} from "@angular/cdk/accordion";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {InfiniteScrollModule} from "ngx-infinite-scroll";

/* Project Components */
import {DataService} from "./service/data.service";
import { SignupComponent } from './module/components/signup/signup.component';
import { DashboardComponent } from './module/components/dashboard/dashboard.component';
import { LoginComponent } from './module/components/login/login.component';
import { TaggedComponent } from './module/components/tagged/tagged.component';
import { ReferralComponent } from './module/components/referral/referral.component';
import { MyaccountComponent } from './module/components/myaccount/myaccount.component';
import { MyreferralComponent } from './module/components/myreferral/myreferral.component';
import { ProfileComponent } from './module/components/profile/profile.component';
import { WalletComponent } from './module/components/wallet/wallet.component';
import { TransactionComponent } from './module/components/transaction/transaction.component';
import { HeaderComponent } from './module/components/header/header.component';
import { ReflinkComponent } from './module/components/reflink/reflink.component';
import { ItemComponent } from './module/components/item/item.component';
import { DetailComponent } from './module/components/detail/detail.component';
import { InitsignupComponent } from './module/components/initsignup/initsignup.component';
import { CartComponent } from './module/components/cart/cart.component';
import { GraphComponent } from './module/components/graph/graph.component';
import { ReportComponent } from './module/components/report/report.component';
import { SuccessComponent } from './module/components/success/success.component';
import { FailureComponent } from './module/components/failure/failure.component';
import { OwnedItemComponent } from './module/components/owned-item/owned-item.component';
import { FooterComponent } from './module/components/footer/footer.component';
import { CollectablesComponent } from './module/components/collectables/collectables.component';
import { SalereportComponent } from './module/components/salereport/salereport.component';
import { MybidComponent } from './module/components/mybid/mybid.component';
import { ModalloginComponent } from './module/components/modallogin/modallogin.component';
import { WalletitemComponent } from './module/components/walletitem/walletitem.component';
import { RarenftComponent } from './module/components/rarenft/rarenft.component';
import { HowtogetComponent } from './module/components/howtoget/howtoget.component';
import { TraitsComponent } from './module/components/traits/traits.component';
import {FilterComponent} from "./module/components/filter/filter.component";
import { PreviewComponent } from './module/components/preview/preview.component';
import { HelpCenterComponent } from './module/components/help-center/help-center.component';
import { MyticketsPageComponent } from './module/components/mytickets-page/mytickets-page.component';
import { AddCommentComponent } from './module/components/add-comment/add-comment.component';
import { ViewTicketComponent } from './module/components/view-ticket/view-ticket.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import { RefundComponent } from './module/components/refund/refund.component';
import { PrivacyComponent } from './module/components/privacy/privacy.component';
import { AboutComponent } from './module/components/about/about.component';
import { ContactComponent } from './module/components/contact/contact.component';
import { TandcComponent } from './module/components/tandc/tandc.component';
import { FaqComponent } from './module/components/faq/faq.component';
import { PayuComponent } from './module/components/payu/payu.component';
import { WithdrawComponent } from './module/components/withdraw/withdraw.component';
import { PayoutlistComponent } from './module/components/payoutlist/payoutlist.component';
import { PaymentMethodComponent } from './module/components/payment-method/payment-method.component';
import { AddPaymentComponent } from './module/components/add-payment/add-payment.component';
import { ScanQrComponent } from './module/components/scan-qr/scan-qr.component';
import {MatTabsModule} from "@angular/material/tabs";
import { MomentoComponent } from './module/components/momento/momento.component';
import { ListforsaleComponent } from './module/components/listforsale/listforsale.component';
import { GuideEtherartComponent } from './module/components/guide-etherart/guide-etherart.component';
import { JoinComponent } from './module/components/join/join.component';
import { DownloadImageComponent } from './module/components/download-image/download-image.component';


@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    DashboardComponent,
    LoginComponent,
    TaggedComponent,
    ReferralComponent,
    MyaccountComponent,
    MyreferralComponent,
    ProfileComponent,
    WalletComponent,
    TransactionComponent,
    HeaderComponent,
    ReflinkComponent,
    ItemComponent,
    DetailComponent,
    InitsignupComponent,
    CartComponent,
    GraphComponent,
    ReportComponent,
    SuccessComponent,
    FailureComponent,
    OwnedItemComponent,
    FooterComponent,
    CollectablesComponent,
    SalereportComponent,
    MybidComponent,
    ModalloginComponent,
    WalletitemComponent,
    RarenftComponent,
    HowtogetComponent,
    TraitsComponent,
    FilterComponent,
    PreviewComponent,
    HelpCenterComponent,
    MyticketsPageComponent,
    AddCommentComponent,
    ViewTicketComponent,
    RefundComponent,
    PrivacyComponent,
    AboutComponent,
    ContactComponent,
    TandcComponent,
    FaqComponent,
    PayuComponent,
    WithdrawComponent,
    PayoutlistComponent,
    PaymentMethodComponent,
    AddPaymentComponent,
    ScanQrComponent,
    MomentoComponent,
    ListforsaleComponent,
    GuideEtherartComponent,
    JoinComponent,
    DownloadImageComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    MatBadgeModule,
    MatIconModule,
    MatCardModule,
    NgxIntlTelInputModule,
    ClipboardModule,
    MatSnackBarModule,
    MatDialogModule,
    ImgMagnifier,
    MatSidenavModule,
    CarouselModule,
    CdkAccordionModule,
    InfiniteScrollModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatTabsModule

  ],
  providers: [DataService,{provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}],
  bootstrap: [AppComponent]
})
export class AppModule {

}
