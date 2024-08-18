import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_auth/auth.guard';
import { AddNewProductComponent } from '../add-new-product/add-new-product.component';
import { BuyProductResolverService } from '../buy-product-resolver.service';
import { BuyProductComponent } from '../buy-product/buy-product.component';
import { ProductResolveService } from '../product-resolve.service';
import { ProductViewDetailsComponent } from '../product-view-details/product-view-details.component';
import { ProductsComponent } from '../products/products.component';


const routes: Routes = [
  {
    path: 'product',
    component: ProductsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['User'] }
  },
  {
    path: 'addNewProduct',
    component: AddNewProductComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
    resolve: { product: ProductResolveService }
  },
  {
    path: 'productViewDetails',
    component: ProductViewDetailsComponent,
    resolve: { product: ProductResolveService }
  },
  {
    path: 'buyProduct',
    component: BuyProductComponent,
    canActivate: [AuthGuard],
    data: { roles: ['User'] },
    resolve: { productDetails: BuyProductResolverService }
  }
];

@NgModule({
  declarations: [ProductsComponent, AddNewProductComponent, ProductViewDetailsComponent, BuyProductComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ProductModule { }
