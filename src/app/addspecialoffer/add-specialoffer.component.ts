import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Product } from "../_model/product.model";
import { ProductService } from "../_services/product.service";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { SpecialOffer } from "../_model/specialoffer";
import { SpecialOfferService } from "../_services/specialoffer.service";

@Component({
  selector: "app-add-specialoffer",
  templateUrl: "./add-specialoffer.component.html",
  styleUrls: ["./add-specialoffer.component.css"],
})
export class AddSpecialOfferComponent implements OnInit {
  specialOffer: SpecialOffer = this.getEmptySpecialOffer();
  products: Product[] = [];
  filteredProducts: Observable<Product[]>;
  productSearchControl = new FormControl();
  selectedProduct: Product = null;

  constructor(
    private specialOfferService: SpecialOfferService,
    private sanitizer: DomSanitizer,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    
  }

  private filterProducts(value: string): Product[] {
    const filterValue = value.toLowerCase();
    return this.products.filter(product => product.productName.toLowerCase().includes(filterValue));
  }

  getEmptySpecialOffer(): SpecialOffer {
    return {
      offerId: null,
      offerName: '',
      offerDescription: '',
      creationDate: new Date(),
      product: {
        productId: null,
        productName: '',
        productDescription: '',
        productDiscountedPrice: 0,
        productActualPrice: 0,
        productImages: [],
        quantity: 0
      },
    };
  }

  addSpecialOffer(specialOfferForm: NgForm) {
    this.specialOffer.product = this.selectedProduct;

    this.specialOfferService.addSpecialOffer(this.specialOffer).subscribe(
      (response: SpecialOffer) => {
        specialOfferForm.reset();
        this.specialOffer = this.getEmptySpecialOffer();
        this.snackBar.open('Special Offer created successfully!', 'Close', {
          duration: 3000,
        });
      },
      (error: HttpErrorResponse) => {
        
        this.snackBar.open('Failed to create special offer. Please try again.', 'Close', {
          duration: 3000,
        });
      }
    );
  }
}
