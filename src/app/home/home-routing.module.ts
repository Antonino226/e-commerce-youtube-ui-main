import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { CategoryComponent } from '../category/category.component';
import { VideoComponent } from '../video/video.component';
import { CartComponent } from '../cart/cart.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'video', component: VideoComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'cart', component: CartComponent }, // Rotta per il carrello
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
