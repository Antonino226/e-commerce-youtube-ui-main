import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../_services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Product } from '../_model/product.model';
import { ImageProcessingService } from '../image-processing.service';
import { UserAuthService } from '../_services/user-auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  pageNumber: number = 0;
  @Input() pageSize: number = 24;
  productDetails: Product[] = [];
  selectedProducts: number[] = [];
  showLoadButton = false;
  loading: boolean = false;
  productCache: { [page: number]: Product[] } = {};
  selectedCategory: string | null = null; // Inizializzato come null per il confronto

  constructor(
    private productService: ProductService,
    private imageProcessingService: ImageProcessingService,
    private router: Router,
    private userAuthService: UserAuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Sottoscrizione ai cambiamenti dei parametri della route
    this.route.paramMap.subscribe(params => {
      const newCategory = params.get('name'); // Ottieni il nuovo valore di :name
      
      // Aggiorna sempre quando cambia il parametro name, anche se è null
      this.selectedCategory = newCategory;
      this.pageNumber = 0; // Resetta la pagina
      this.productDetails = []; // Resetta i prodotti
      this.productCache = {}; // Resetta la cache
      this.selectedProducts = []; // Resetta i prodotti selezionati (opzionale)
      this.getProductsByCategory(); // Carica i nuovi prodotti
    });
  }

  searchByKeyword(searchKeyword: string) {
    this.loading = true;
    this.pageNumber = 0;
    this.productDetails = [];
    this.productCache = {};
    this.getProductsByCategory(searchKeyword);
  }

  getProductsByCategory(searchKey: string = "") {
    if (this.productCache[this.pageNumber]) {
      // Usa la cache se disponibile
      this.productDetails = this.productCache[this.pageNumber];
      this.showLoadButton = this.productCache[this.pageNumber].length === this.pageSize;
      this.loading = false;
    } else {
      this.loading = true; // Attiva lo spinner
      this.productService.getProductsByCategory(this.selectedCategory || '', this.pageNumber, this.pageSize, searchKey)
        .pipe(
          map((products: Product[]) => products.map(product => this.imageProcessingService.createImagesProduct(product)))
        )
        .subscribe(
          (products: Product[]) => {
            const newProducts = products.filter(p => !this.productDetails.some(existing => existing.productId === p.productId));
            this.productCache[this.pageNumber] = newProducts;
            this.productDetails = newProducts;
            this.showLoadButton = products.length === this.pageSize;
            this.loading = false; // Disattiva lo spinner
          },
          (error: HttpErrorResponse) => {
            console.error('Error fetching products:', error);
            this.loading = false; // Disattiva lo spinner in caso di errore
          }
        );
    }
  }

  nextPage(): void {
    this.pageNumber++;
    this.getProductsByCategory();
  }

  previousPage(): void {
    if (this.pageNumber > 0) {
      this.pageNumber--;
      this.getProductsByCategory();
    }
  }

  deleteSelectedProducts() {
    if (confirm('Are you sure you want to delete the selected products?')) {
      this.loading = true;
      const deleteRequests = this.selectedProducts.map(productId =>
        this.productService.deleteProduct(productId).pipe(
          map(() => {
            this.productDetails = this.productDetails.filter(product => product.productId !== productId);
            this.updateCacheAfterDelete(productId);
            this.selectedProducts = this.selectedProducts.filter(id => id !== productId);
          })
        )
      );
      forkJoin(deleteRequests).subscribe({
        next: () => {
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error deleting products:', error);
          this.loading = false;
        }
      });
    }
  }

  updateCacheAfterDelete(productId: number) {
    let allProducts: Product[] = [];
    Object.keys(this.productCache).forEach(page => {
      allProducts = allProducts.concat(this.productCache[+page]);
    });
    allProducts = allProducts.filter(product => product.productId !== productId);
    this.productCache = {};
    let pageIndex = 0;
    for (let i = 0; i < allProducts.length; i += this.pageSize) {
      this.productCache[pageIndex] = allProducts.slice(i, i + this.pageSize);
      pageIndex++;
    }
    this.productDetails = this.productCache[this.pageNumber] || [];
  }

  toggleProductSelection(productId: number, isSelected: boolean) {
    if (isSelected) {
      this.selectedProducts.push(productId);
    } else {
      this.selectedProducts = this.selectedProducts.filter(id => id !== productId);
    }
  }

  toggleSelectAll(isSelected: boolean) {
    if (isSelected) {
      this.selectedProducts = this.productDetails.map(product => product.productId);
    } else {
      this.selectedProducts = [];
    }
  }

  isProductSelected(productId: number): boolean {
    return this.selectedProducts.includes(productId);
  }

  isAdmin() {
    return this.userAuthService.isAdmin();
  }

  showProductDetails(productId) {
    this.router.navigate(['/productViewDetails', { productId: productId }]);
  }
}