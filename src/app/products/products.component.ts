import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';
import { ImageProcessingService } from '../image-processing.service';
import { UserAuthService } from '../_services/user-auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  pageNumber: number = 0;
  @Input() pageSize: number = 24;  // Valore predefinito di pageSize
  productDetails: Product[] = [];
  selectedProducts: number[] = [];
  showLoadButton = false;
  loading: boolean = false;

  // Cache per i prodotti caricati
  productCache: { [page: number]: Product[] } = {}; 

  constructor(
    private productService: ProductService,
    private imageProcessingService: ImageProcessingService,
    private router: Router,
    private userAuthService: UserAuthService
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  // Cerca i prodotti in base a una parola chiave
  searchByKeyword(searchKeyword: string) {
    this.pageNumber = 0;
    this.productDetails = [];
    this.productCache = {}; // Reset della cache per la nuova ricerca
    this.getAllProducts(searchKeyword);
  }

  // Recupera i prodotti
  getAllProducts(searchKey: string = "") {
    if (this.productCache[this.pageNumber]) {
      // Recupera i prodotti dalla cache se la pagina è già stata caricata
      this.productDetails = this.productCache[this.pageNumber];
      this.showLoadButton = this.productCache[this.pageNumber].length === this.pageSize;
    } else {
      this.loading = true;
      this.productService.getAllProducts(this.pageNumber, this.pageSize, searchKey)
        .pipe(
          map((products: Product[]) => products.map(product => this.imageProcessingService.createImagesProduct(product)))
        )
        .subscribe(
          (products: Product[]) => {
            // Aggiungi i nuovi prodotti alla cache e rimuovi i duplicati
            const newProducts = products.filter(p => !this.productDetails.some(existing => existing.productId === p.productId));
            this.productCache[this.pageNumber] = newProducts;
            this.productDetails = newProducts;

            this.showLoadButton = products.length === this.pageSize;
            this.loading = false;
          },
          (error: HttpErrorResponse) => {
            console.error('Error fetching products:', error);
            this.loading = false;
          }
        );
    }
  }

  // Paginazione: Carica la pagina successiva
  nextPage(): void {
    this.pageNumber++;
    this.getAllProducts();
  }

  // Paginazione: Torna alla pagina precedente
  previousPage(): void {
    if (this.pageNumber > 0) {
      this.pageNumber--;
      this.getAllProducts();
    }
  }

  // Elimina i prodotti selezionati
  deleteSelectedProducts() {
    if (confirm('Are you sure you want to delete the selected products?')) {
      this.loading = true;
      
      // Prepara una lista di osservabili per le richieste di eliminazione
      const deleteRequests = this.selectedProducts.map(productId =>
        this.productService.deleteProduct(productId).pipe(
          map(() => {
            // Aggiorna i dettagli dei prodotti e la cache rimuovendo i prodotti eliminati
            this.productDetails = this.productDetails.filter(product => product.productId !== productId);
            this.updateCacheAfterDelete(productId); // Aggiorna la cache specificamente per i prodotti eliminati
            this.selectedProducts = this.selectedProducts.filter(id => id !== productId);
          })
        )
      );

      // Esegue tutte le richieste in parallelo e attende che tutte siano completate
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

  // Aggiorna la cache dopo l'eliminazione di un prodotto specifico
  updateCacheAfterDelete(productId: number) {
    // Crea un array temporaneo per contenere tutti i prodotti presenti in cache
    let allProducts: Product[] = [];

    // Combina tutti i prodotti dalle diverse pagine nella cache in un singolo array
    Object.keys(this.productCache).forEach(page => {
      allProducts = allProducts.concat(this.productCache[+page]);
    });

    // Rimuovi il prodotto eliminato dall'array unificato
    allProducts = allProducts.filter(product => product.productId !== productId);

    // Svuota la cache esistente
    this.productCache = {};

    // Ricostruisce la cache riempiendo ogni pagina con il numero massimo di prodotti
    let pageIndex = 0;
    for (let i = 0; i < allProducts.length; i += this.pageSize) {
      this.productCache[pageIndex] = allProducts.slice(i, i + this.pageSize);
      pageIndex++;
    }

    // Aggiorna i dettagli dei prodotti con i nuovi prodotti della pagina corrente
    this.productDetails = this.productCache[this.pageNumber] || [];
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
}
