import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { CartComponent } from './module/components/cart/cart.component';
import { DashboardComponent } from './module/components/dashboard/dashboard.component';
import { DetailComponent } from './module/components/detail/detail.component';
import { FailureComponent } from './module/components/failure/failure.component';
import { MyaccountComponent } from './module/components/myaccount/myaccount.component';
import { ReferralComponent } from './module/components/referral/referral.component';
import { ReportComponent } from './module/components/report/report.component';
import {SignupComponent} from "./module/components/signup/signup.component";
import { SuccessComponent } from './module/components/success/success.component';
import { TaggedComponent } from './module/components/tagged/tagged.component';
import {OwnedItemComponent} from "./module/components/owned-item/owned-item.component";
import { CollectablesComponent } from './module/components/collectables/collectables.component';
import { SalereportComponent } from './module/components/salereport/salereport.component';
import { ProfileComponent } from './module/components/profile/profile.component';
import { WalletComponent } from './module/components/wallet/wallet.component';
import {WalletitemComponent} from "./module/components/walletitem/walletitem.component";
import {TraitsComponent} from "./module/components/traits/traits.component";
import {FilterComponent} from "./module/components/filter/filter.component";
import {HelpCenterComponent} from "./module/components/help-center/help-center.component";
import {MyticketsPageComponent} from "./module/components/mytickets-page/mytickets-page.component";
import {AddCommentComponent} from "./module/components/add-comment/add-comment.component";
import { RarenftComponent } from './module/components/rarenft/rarenft.component';
import { RefundComponent } from './module/components/refund/refund.component';
import { PrivacyComponent } from './module/components/privacy/privacy.component';
import { ContactComponent } from './module/components/contact/contact.component';
import { AboutComponent } from './module/components/about/about.component';
import { TandcComponent } from './module/components/tandc/tandc.component';
import { FaqComponent } from './module/components/faq/faq.component';
import { PayuComponent } from './module/components/payu/payu.component';
import {WithdrawComponent} from "./module/components/withdraw/withdraw.component";
import {PayoutlistComponent} from "./module/components/payoutlist/payoutlist.component";
import {MomentoComponent} from "./module/components/momento/momento.component";
// import {ImageDownloadComponent} from "./module/components/image-download/image-download.component"
import {JoinComponent} from "./module/components/join/join.component";
import {DownloadImageComponent} from "./module/components/download-image/download-image.component";


const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail', component: DetailComponent },
  { path: '', component: DashboardComponent },
  { path: 'referral', component: ReferralComponent },
  { path: 'myaccount', component: MyaccountComponent },
  { path: 'cart', component: CartComponent },
  { path: 'collection', component: TaggedComponent },
  { path: 'collectables', component: CollectablesComponent },
  { path: 'favourite', component: TaggedComponent },
  { path: 'report', component: ReportComponent },
  { path: 'salesreport', component: SalereportComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'owneditem', component: OwnedItemComponent },
  { path: 'failure', component: FailureComponent },
  { path: 'wallet', component: WalletComponent },
  { path: 'walletitem', component: WalletitemComponent },
  { path: 'traits', component: TraitsComponent },
  { path: 'filter', component: FilterComponent },
  { path: 'help-center', component: HelpCenterComponent},
  { path: 'mytickets', component: MyticketsPageComponent},
  { path: 'add-comment', component: AddCommentComponent},
  { path: 'rare', component: RarenftComponent},
  { path: 'refund', component: RefundComponent},
  { path: 'privacy', component: PrivacyComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'about', component: AboutComponent},
  { path: 'tandc', component: TandcComponent},
  { path: 'faq', component: FaqComponent},
  { path: 'pay', component: PayuComponent},
  { path: 'withdraw', component: WithdrawComponent},
  { path: 'payoutlist', component: PayoutlistComponent},
  { path: 'momento', component: MomentoComponent},
  { path: 'download', component: DownloadImageComponent},
  { path: 'join', component: JoinComponent},
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // onSameUrlNavigation: 'reload',
  })],
  exports: [RouterModule]

})
export class AppRoutingModule {
}



