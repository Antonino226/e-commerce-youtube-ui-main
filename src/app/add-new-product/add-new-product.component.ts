import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { FileHandle } from "../_model/file-handle.model";
import { Product } from "../_model/product.model";
import { ProductService } from "../_services/product.service";
import { CategoryService } from '../_services/category.service'; // Importa il servizio delle categorie
import { Category } from '../_model/category.model'; // Importa il modello di categoria
import { MatSnackBar } from "@angular/material/snack-bar";
import { catchError, Observable, of } from "rxjs";

@Component({
  selector: "app-add-new-product",
  templateUrl: "./add-new-product.component.html",
  styleUrls: ["./add-new-product.component.css"],
})
export class AddNewProductComponent implements OnInit {
  isNewProduct = true;
  categories: Category[] = [];
  page: number = 0;
  size: number = 10;
  totalPages: number = 0;
  isLoading = false;

  product: Product = {
    productId: null,
    productName: "",
    productDescription: "",
    productDiscountedPrice: 0,
    productActualPrice: 0,
    productImages: [],
    category: null,
    quantity: 0
  };

  category: Category;
  categoryId: number | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.product = this.activatedRoute.snapshot.data['product'];

    if(this.product && this.product.productId) {
      this.isNewProduct = false;
    }

    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
      },
      (error: HttpErrorResponse) => {
        console.error('Errore nel recupero delle categorie', error);
      }
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  addProduct(productForm: NgForm) {
    // Imposta isLoading su true per mostrare lo spinner
    this.isLoading = true;
  
    const formData = this.prepareFormDataForProduct(this.product);
  
    this.productService.addProduct(formData).subscribe(
      (response: Product) => {
        this.snackBar.open('Product created successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['custom-snackbar']
        });
        productForm.reset();
        this.product.productImages = [];
        this.isLoading = false; // Nascondi lo spinner in caso di successo
      },
      (error: HttpErrorResponse) => {
        this.snackBar.open('Failed to update category. Please try again.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['custom-snackbar']
        });
        this.isLoading = false; // Nascondi lo spinner anche in caso di errore
      }
    );
  }
  
  prepareFormDataForProduct(product: Product): FormData {
    const uploadImageData = new FormData();
    uploadImageData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    // Appendi l'ID della categoria separatamente
    // Appendi l'ID della categoria separatamente come binario
    if (this.categoryId !== null) {
      const categoryBlob = new Blob([JSON.stringify(this.categoryId)], { type: "application/json" });
      uploadImageData.append("categoryId", categoryBlob);
    }

    for (let i = 0; i < this.product.productImages.length; i++) {
      uploadImageData.append(
        "imageFile",
        this.product.productImages[i].file,
        this.product.productImages[i].file.name
      );
    }
    return uploadImageData;
  }

  onFileSelected(event: any) {
    if (event.target.files) {
      const file = event.target.files[0];
      const fileHandle: FileHandle = {
        file: file,
        url: this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
        ),
      };
      this.product.productImages.push(fileHandle);
    }
  }

  removeImages(i: number) {
    this.product.productImages.splice(i, 1);
  }

  fileDropped(fileHandle: FileHandle) {
    this.product.productImages.push(fileHandle);
  }

  normalizePrice(event: any, fieldName: string) {
    let inputValue = event.target.value;
    
    // Sostituisci la virgola con il punto
    inputValue = inputValue.replace(',', '.');
    
    // Converti in un numero se valido e aggiorna il campo corretto
    const parsedValue = parseFloat(inputValue);
    
    if (!isNaN(parsedValue)) {
      this.product[fieldName] = parsedValue;
    } else {
      this.product[fieldName] = inputValue;  // Lascia l'input come stringa se non è un numero valido
    }
  }
  
}