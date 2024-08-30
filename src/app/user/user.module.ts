import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../_auth/auth.guard';
import { OrderConfirmationComponent } from '../order-confirmation/order-confirmation.component';
import { UserComponent } from './user.component';
import { SharedModule } from '../shared.module';
import { OrderComponent } from '../order/order.component';

const routes: Routes = [
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuard],
    data: { roles: ['User'] }
  },
  {
    path: 'orders/:id',
    component: OrderComponent,
    canActivate: [AuthGuard],
    data: { roles: ['User'] }
  },
  {
    path: 'orderConfirm',
    component: OrderConfirmationComponent,
    canActivate: [AuthGuard],
    data: { roles: ['User'] }
  }
];

@NgModule({
  declarations: [
    UserComponent,
    OrderComponent,
    OrderConfirmationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class UserModule { }
