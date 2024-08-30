import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductsComponent } from './products.component';
import { AddNewProductComponent } from '../add-new-product/add-new-product.component';
import { ProductViewDetailsComponent } from '../product-view-details/product-view-details.component';
import { BuyProductComponent } from '../buy-product/buy-product.component';
import { ProductResolveService } from '../product-resolve.service';
import { BuyProductResolverService } from '../buy-product-resolver.service';
import { AuthGuard } from '../_auth/auth.guard';

const routes: Routes = [
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard]},  
  { path: 'addNewProduct', component: AddNewProductComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] }, resolve: { product: ProductResolveService } },
  { path: 'productViewDetails', component: ProductViewDetailsComponent, resolve: { product: ProductResolveService } },
  { path: 'buyProduct', component: BuyProductComponent, canActivate: [AuthGuard], data: { roles: ['User'] }, resolve: { productDetails: BuyProductResolverService } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
