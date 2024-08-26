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

@NgModule({
  declarations: [
    HomeComponent,
    CategoryComponent,
    VideoComponent,
    LocationComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ProductModule,
    MatProgressSpinnerModule
]
})
export class HomeModule { }
