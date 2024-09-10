import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { CategoryComponent } from '../category/category.component';
import { VideoComponent } from '../video/video.component';
import { CartComponent } from '../cart/cart.component';
import { CheckoutComponent } from '../checkout/checkout.component';
import { LocationComponent } from '../location/location.component';
import { ProfileComponent } from '../profile/profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profile/:userName', component: ProfileComponent },
  { path: 'video', component: VideoComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'location', component: LocationComponent },
  { path: 'cart', component: CartComponent }, // Rotta per il carrello
  { path: 'checkout', component: CheckoutComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
