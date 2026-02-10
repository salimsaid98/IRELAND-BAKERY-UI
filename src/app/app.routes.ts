import { Routes } from '@angular/router';
import { DefaultPage } from './default/default.page';
import { HomePage } from './home/home.page';
import { ProfilePage } from './profile/profile.page';
import { HistoryPage } from './history/history.page';
import { StockPage } from './stock/stock.page';
import { CustomerListPage } from './customer-list/customer-list.page';
import { CustomerViewPage } from './customer-view/customer-view.page';
import { ReceivePaymentPage } from './receive-payment/receive-payment.page';
import { CheckoutComponent } from './checkout/checkout.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { OrderDetailsPage } from './order-details/order-details.component';
import { OrderDetailsCashComponent } from './order-details-cash/order-details-cash.component';
import { AuthGuard } from './auth.guard';
import { ChiefHomeComponent } from './chief/chief-home/chief-home.component';
import { ChiefProductionListComponent } from './chief/chief-production-list/chief-production-list.component';
import { ChiefProductionViewComponent } from './chief/chief-production-view/chief-production-view.component';

export const routes: Routes = [

  // 🔁 Default redirect
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // 🔐 Login (PUBLIC)
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.page').then(m => m.LoginPage),
  },

  // 🔒 Protected routes
  {
    path: 'auth',
    component: DefaultPage,
    canActivate: [AuthGuard],
    children: [

      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },

      { path: 'home', component: HomePage },
      { path: 'profile', component: ProfilePage },
      { path: 'history', component: HistoryPage },
      { path: 'chief', component: ChiefHomeComponent},

      { path: 'customer_list', component: CustomerListPage },
      { path: 'customer_view', component: CustomerViewPage },
      { path: 'receive_payment', component: ReceivePaymentPage },
      { path: 'checkout', component: CheckoutComponent },

      { path: 'order_details', component: OrderDetailsPage },
      { path: 'order_details_cash', component: OrderDetailsCashComponent },

      { path: 'edit_customer', component: EditCustomerComponent },
      { path: 'payment-history', component: PaymentHistoryComponent },
      {path:'list_production',component:ChiefProductionListComponent},
      {path:'chief_production_view',component:ChiefProductionViewComponent}
    ],
  },

  // ❌ Unknown routes
  {
    path: '**',
    redirectTo: 'login',
  }
];
