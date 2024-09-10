import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { LoginComponent } from './login/login.component';
import { OrderComponent } from './order/order.component';
import { SharedModule } from './shared.module';


const routes: Routes = [
  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'special-offer', loadChildren: () => import('./special-offer/special-offer.module').then(m => m.SpecialOfferModule) },
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  { path: 'login', component: LoginComponent },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: 'order', component: OrderComponent }, // Rotta per l'ordine
  { path: '**', redirectTo: '' } // Forza un redirect a '/' per percorsi sconosciuti
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    SharedModule
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
