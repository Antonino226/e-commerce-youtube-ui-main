import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNewProductComponent } from '../add-new-product/add-new-product.component';
import { BuyProductComponent } from '../buy-product/buy-product.component';
import { ProductViewDetailsComponent } from '../product-view-details/product-view-details.component';
import { ProductRoutingModule } from './product.routing.module';
import { ProductsComponent } from './products.component';
import { SharedModule } from '../shared.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ShowProductDetailsComponent } from '../show-product-details/show-product-details.component';
import { ShowProductImagesDialogComponent } from '../show-product-images-dialog/show-product-images-dialog.component';

@NgModule({
  declarations: [
    ProductsComponent,
    AddNewProductComponent,
    ProductViewDetailsComponent,
    BuyProductComponent,
    ShowProductDetailsComponent,
    ShowProductImagesDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProductRoutingModule,
  ],
  exports: [
    ProductsComponent,
    AddNewProductComponent,
    ProductViewDetailsComponent,
    BuyProductComponent,
    ShowProductDetailsComponent,
    ShowProductImagesDialogComponent
  ],
})
export class ProductModule { }
