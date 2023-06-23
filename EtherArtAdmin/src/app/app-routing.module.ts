import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { DashboardComponent } from './module/components/dashboard/dashboard.component';
import { ReportComponent } from './module/components/report/report.component';
import { SalereportComponent } from './module/components/salereport/salereport.component';
import { ListallComponent } from './module/components/listall/listall.component';
import {ImageComponent} from "./module/components/image/image.component";
import {PartComponent} from "./module/components/part/part.component";
import {VariantComponent} from "./module/components/variant/variant.component";
import {CategoryComponent} from "./module/components/category/category.component";
import {SubCategoryComponent} from "./module/components/sub-category/sub-category.component";
import {MetadataComponent} from "./module/components/metadata/metadata.component";
import {GenerateComponent} from "./module/components/generate/generate.component";
import {ViewcollectionComponent} from "./module/components/viewcollection/viewcollection.component";
import {SortpartComponent} from "./module/components/sortpart/sortpart.component";
import { VariantrarityComponent } from './module/components/variantrarity/variantrarity.component';
import { NftsComponent } from './module/components/nfts/nfts.component';
import {TraitsComponent} from "./module/components/traits/traits.component";
import {ReportGenericComponent} from "./module/components/report-generic/report-generic.component";
import {GeneratedCollectionsComponent} from "./module/components/generated-collections/generated-collections.component";
import {ConfigureComponent} from "./module/components/configure/configure.component";
import {TicketsPageComponent} from "./module/components/tickets-page/tickets-page.component";
import {UpdateHousePriceComponent} from "./module/components/update-house-price/update-house-price.component";
import {PayoutComponent} from "./module/components/payout/payout.component";
import {VerifyComponent} from "./module/components/verify/verify.component";

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: '', component: DashboardComponent },
  { path: 'collection', component: ListallComponent },
  { path: 'report', component: ReportComponent },
  { path: 'salesreport', component: SalereportComponent },
  { path: 'image', component:ImageComponent },
  { path: 'part', component:PartComponent },
  { path: 'variant', component:VariantComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'subcategory', component: SubCategoryComponent },
  { path: 'metadata', component:MetadataComponent },
  { path: 'sort', component:SortpartComponent },
  { path: 'view', component:ViewcollectionComponent  },
  { path: 'release', component:ViewcollectionComponent},
  { path: 'generate', component:GenerateComponent},
  { path: 'rarity', component:ViewcollectionComponent},
  { path: 'browse',component:ViewcollectionComponent},
  { path: 'variantrarity', component:VariantrarityComponent},
  { path: 'itemrarity', component:NftsComponent},
  { path: 'traits', component:TraitsComponent},
  { path: 'reportgeneric', component:ReportGenericComponent},
  { path: 'generatedCollections',component:GeneratedCollectionsComponent},
  { path: 'configure',component:ConfigureComponent},
  { path: 'tickets',component:TicketsPageComponent},
  { path: 'updateHousePrice',component:UpdateHousePriceComponent},
  { path: 'payout',component:PayoutComponent},
  { path: 'verify',component:VerifyComponent},
  { path: '**', redirectTo: '' }
];


@NgModule({
  // imports: [RouterModule.forRoot(routes)],
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]

})
export class AppRoutingModule {
}



