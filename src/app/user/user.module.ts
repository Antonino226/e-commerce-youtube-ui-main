import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../_auth/auth.guard';
import { MyOrdersComponent } from '../my-orders/my-orders.component';
import { OrderConfirmationComponent } from '../order-confirmation/order-confirmation.component';
import { UserComponent } from './user.component';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuard],
    data: { roles: ['User'] }
  },
  {
    path: 'myOrders',
    component: MyOrdersComponent,
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
    MyOrdersComponent,
    OrderConfirmationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class UserModule { }
