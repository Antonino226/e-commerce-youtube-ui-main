import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';

// Importa i componenti
import { HomeComponent } from './home.component';
import { CategoryComponent } from '../category/category.component';
import { VideoComponent } from '../video/video.component';
import { ProductModule } from "../products/product.module";
import { LocationComponent } from '../location/location.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CategoryModule } from '../category/category.module';
import { CartComponent } from '../cart/cart.component';
import { CheckoutComponent } from '../checkout/checkout.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { SharedModule } from '../shared.module';
import { ProfileComponent } from '../profile/profile.component';

@NgModule({
  declarations: [
    HomeComponent,
    CategoryComponent,
    VideoComponent,
    LocationComponent,
    CartComponent,
    CheckoutComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NgxPayPalModule,
    SharedModule,
    ProductModule,
    CategoryModule,
    MatProgressSpinnerModule
]
})
export class HomeModule { }
