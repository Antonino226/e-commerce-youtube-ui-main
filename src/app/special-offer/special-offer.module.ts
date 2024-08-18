import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_auth/auth.guard';
import { SpecialOfferresolveService } from '../special-offerresolve.service';
import { AddSpecialOfferComponent } from '../addspecialoffer/add-specialoffer.component';

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
  declarations: [AddSpecialOfferComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SpecialOfferModule { }
