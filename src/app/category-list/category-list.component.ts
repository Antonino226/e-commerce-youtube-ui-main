import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../_services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Product } from '../_model/product.model';
import { ImageProcessingService } from '../image-processing.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  selectedCategory: string;
  categoryProducts: any[];
  pageNumber: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private imageProcessingService: ImageProcessingService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.selectedCategory = params.get('name');
      this.loadCategoryProducts();
    });
  }

  loadCategoryProducts(): void {
    this.productService.getProductsByCategory(this.selectedCategory)
      .pipe(
        map((products: any[]) => products.map((product: Product) => this.imageProcessingService.createImagesProduct(product)))
      )
      .subscribe(
        (products: Product[]) => {
          this.categoryProducts = products;
        },
        (error: HttpErrorResponse) => {
          
        }
      );
  }
  
  public loadMoreProduct() {
    this.pageNumber = this.pageNumber + 1;
  }

  showProductDetails(productId) {
    this.router.navigate(['/productViewDetails', {productId: productId}]);
  }
}
