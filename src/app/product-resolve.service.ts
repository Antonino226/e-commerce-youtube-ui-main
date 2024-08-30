import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Product } from './_model/product.model';
import { ProductService } from './_services/product.service';
import { ImageProcessingService } from './image-processing.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductResolveService implements Resolve<Product> {
  constructor(
    private productService: ProductService,
    private imageProcessingService: ImageProcessingService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Product> {
    const id = Number(route.paramMap.get('productId'));

    if (id) {
      // then we have to fetch details from backend
      return this.productService.getProductDetailsById(id).pipe(
        map((p) => this.imageProcessingService.createImagesProduct(p))
      );
    } else {
      // return empty product observable.
      return of(this.getProductDetails());
    }
  }

  getProductDetails(): Product {
    return {
      productId: null,
      productName: '',
      productDescription: '',
      productDiscountedPrice: 0,
      productActualPrice: 0,
      productImages: [],
      category: null, // Add this line to match the Product interface
      quantity: 0,
    };
  }
}
