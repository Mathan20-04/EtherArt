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

import {DataService} from "./service/data.service";
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { DashboardComponent } from './module/components/dashboard/dashboard.component';
import { HeaderComponent } from './module/components/header/header.component';
import { ReportComponent } from './module/components/report/report.component';
import { ForgotComponent } from './module/components/forgot/forgot.component';
import { FooterComponent } from './module/components/footer/footer.component';
import { SalereportComponent } from './module/components/salereport/salereport.component';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import { NgxStripeModule } from 'ngx-stripe';
import { ModalloginComponent } from './module/components/modallogin/modallogin.component';
import { ListallComponent } from './module/components/listall/listall.component';
import { ListcollectionComponent } from './module/components/listcollection/listcollection.component';
import { ListpartComponent } from './module/components/listpart/listpart.component';
import { ListvariantComponent } from './module/components/listvariant/listvariant.component';
import { ImageComponent } from './module/components/image/image.component';
import { PartComponent } from './module/components/part/part.component';
import { VariantComponent } from './module/components/variant/variant.component';
import { CategoryComponent } from './module/components/category/category.component';
import { SubCategoryComponent } from './module/components/sub-category/sub-category.component';
import { MetadataComponent } from './module/components/metadata/metadata.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {SortpartComponent} from "./module/components/sortpart/sortpart.component";
import {ViewcollectionComponent} from "./module/components/viewcollection/viewcollection.component";
import {GenerateComponent} from "./module/components/generate/generate.component";
import {EditorModule} from "@tinymce/tinymce-angular";
import { VariantrarityComponent } from './module/components/variantrarity/variantrarity.component';
import { NftsComponent } from './module/components/nfts/nfts.component';
import { TraitsComponent } from './module/components/traits/traits.component';
import { ReportGenericComponent } from './module/components/report-generic/report-generic.component';
import { GeneratedCollectionsComponent } from './module/components/generated-collections/generated-collections.component';
import { ConfigureComponent } from './module/components/configure/configure.component';
import { PreviewComponent } from './module/components/preview/preview.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { TicketsPageComponent } from './module/components/tickets-page/tickets-page.component';
import { ViewticketsComponent } from './module/components/viewtickets/viewtickets.component';
import { AddCommentComponent } from './module/components/add-comment/add-comment.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import { UpdateHousePriceComponent } from './module/components/update-house-price/update-house-price.component';
import { PayoutComponent } from './module/components/payout/payout.component';
import { MakePaymentComponent } from './module/components/make-payment/make-payment.component';
import { VerifyComponent } from './module/components/verify/verify.component';
@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        ForgotComponent,
        HeaderComponent,
        ReportComponent,
        FooterComponent,
        SalereportComponent,
        ModalloginComponent,
        ListallComponent,
        ListcollectionComponent,
        ListpartComponent,
        ListvariantComponent,
        ImageComponent,
        PartComponent,
        VariantComponent,
        CategoryComponent,
        SubCategoryComponent,
        MetadataComponent,
        SortpartComponent,
        ViewcollectionComponent,
        GenerateComponent,
        VariantrarityComponent,
        NftsComponent,
        TraitsComponent,
        ReportGenericComponent,
        GeneratedCollectionsComponent,
        ConfigureComponent,
        PreviewComponent,
        TicketsPageComponent,
        ViewticketsComponent,
        AddCommentComponent,
        UpdateHousePriceComponent,
        PayoutComponent,
        MakePaymentComponent,
        VerifyComponent,
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
        DragDropModule,
        EditorModule,
        MatProgressSpinnerModule,
        MatTooltipModule
    ],
    providers: [DataService,{provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}],
    bootstrap: [AppComponent]
})
export class AppModule {

}
