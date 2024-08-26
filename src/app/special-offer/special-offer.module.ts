import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../_auth/auth.guard';
import { AddSpecialOfferComponent } from '../addspecialoffer/add-specialoffer.component';
import { SpecialOfferresolveService } from '../special-offerresolve.service';
import { SharedModule } from '../shared.module';
import { ProductModule } from '../products/product.module';

const routes: Routes = [
  {
    path: 'addSpecialoffer',
    component: AddSpecialOfferComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
    resolve: { specialOffer: SpecialOfferresolveService }
  }
];

@NgModule({
  declarations: [
    AddSpecialOfferComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProductModule,
    RouterModule.forChild(routes)
  ]
})
export class SpecialOfferModule { }
