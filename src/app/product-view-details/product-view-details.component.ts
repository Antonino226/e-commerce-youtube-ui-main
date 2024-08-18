import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';
import { UserAuthService } from '../_services/user-auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileHandle } from "../_model/file-handle.model";

@Component({
  selector: 'app-product-view-details',
  templateUrl: './product-view-details.component.html',
  styleUrls: ['./product-view-details.component.css']
})
export class ProductViewDetailsComponent implements OnInit {

  selectedProductIndex = 0;
  product: Product;
  edit: boolean = false;
  sanitizer: any;
  categoryId: number | null = null; // Aggiungi questa proprietà per tenere traccia dell'ID della categoria selezionata

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private userAuthService: UserAuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.product = this.activatedRoute.snapshot.data['product'];
  }

  addToCart(productId) {
    this.productService.addToCart(productId).subscribe(
      (response) => {
      }, (error) => {
        
      }
    );
  }

  changeIndex(index) {
    this.selectedProductIndex = index;
  }

  buyProduct(productId) {
    this.router.navigate(['/buyProduct', {
      isSingleProductCheckout: true, id: productId
    }]);
  }

  updateProduct() {
    this.productService.updateProduct(this.product).subscribe(
      response => {
        this.snackBar.open('Product updated successfully!', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/productDetails', this.product.productId]);
      },
      error => {
        console.error(error);
        this.snackBar.open('Failed to update product. Please try again.', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  public isAdmin() {
    return this.userAuthService.isAdmin();
  }

  cancelEdit() {
    this.edit = false;
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
}
