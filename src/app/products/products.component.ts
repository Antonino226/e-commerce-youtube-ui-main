import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';
import { ImageProcessingService } from '../image-processing.service';
import { UserAuthService } from '../_services/user-auth.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  pageNumber: number = 0;
  pageSize: number = 12;
  productDetails: Product[] = [];
  selectedProducts: number[] = [];
  showLoadButton = false;

  constructor(
    private productService: ProductService,
    private imageProcessingService: ImageProcessingService,
    private router: Router,
    private userAuthService: UserAuthService
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  searchByKeyword(searchkeyword: string) {
    this.pageNumber = 0;
    this.pageSize = 12;
    this.productDetails = [];
    this.getAllProducts(searchkeyword);
  }

  getAllProducts(searchKey: string = "") {
    this.productService.getAllProducts(this.pageNumber,this.pageSize, searchKey)
      .pipe(
        map((products: Product[]) => products.map(product => this.imageProcessingService.createImagesProduct(product)))
      )
      .subscribe(
        (products: Product[]) => {
          this.showLoadButton = products.length === this.pageSize;
          this.productDetails.push(...products);
        },
        (error: HttpErrorResponse) => {
          console.error('Error fetching products:', error);
        }
      );
  }

  loadMoreProduct() {
    this.pageNumber++;
    this.getNewProducts();
  }
  
  getNewProducts(searchKey: string = "") {
    // Supponiamo che `productService` sia il servizio che utilizzi per ottenere i prodotti.
    this.productService.getAllProducts(this.pageNumber,this.pageSize, searchKey).subscribe((newProducts) => {
      // Sostituisce la lista dei prodotti esistente con una nuova lista.
      this.productDetails = newProducts;
    });
  }

  showProductDetails(productId: number) {
    this.router.navigate(['/productViewDetails', { productId: productId }]);
  }

  toggleProductSelection(productId: number, isSelected: boolean) {
    if (isSelected) {
      this.selectedProducts.push(productId);
    } else {
      this.selectedProducts = this.selectedProducts.filter(id => id !== productId);
    }
  }

  deleteSelectedProducts() {
    if (confirm('Are you sure you want to delete the selected products?')) {
      this.selectedProducts.forEach(productId => {
        this.productService.deleteProduct(productId).subscribe(
          () => {
            this.productDetails = this.productDetails.filter(product => product.productId !== productId);
            this.selectedProducts = this.selectedProducts.filter(id => id !== productId);
          },
          (error: HttpErrorResponse) => {
          }
        );
      });
    }
  }

  isAdmin() {
    return this.userAuthService.isAdmin();
  }
}
