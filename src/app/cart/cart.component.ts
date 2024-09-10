// cart.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cart } from '../_model/cart.model';
import { CartService } from '../cart.service';
import { UserAuthService } from '../_services/user-auth.service';
import { Subscription } from 'rxjs';
import { Product } from '../_model/product.model';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ImageProcessingService } from '../image-processing.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart | null = null;
  productsInCart: Product[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  private cartSubscription: Subscription | null = null;

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: UserAuthService,
    private imageProcessingService: ImageProcessingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.getCartObservable()
      .pipe(
        map(cart => {
          if (cart && cart.products) {
            cart.products = cart.products.map(product => this.imageProcessingService.createImagesProduct(product));
          }
          return cart;
        }),
        catchError(error => {
          this.errorMessage = 'Error loading cart. Please try again later.';
          this.loading = false;
          this.snackBar.open('Error loading cart. Please try again later.', 'Close', { duration: 3000 });
          return of(null); 
        })
      )
      .subscribe(cart => {
        this.cart = cart || null;
        this.productsInCart = cart?.products || [];
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
  }

  proceedToCheckout(): void {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Please log in to proceed with checkout.', 'Close', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    if (!this.cart || this.cart.products.length === 0) {
      this.snackBar.open('Your cart is empty.', 'Close', { duration: 3000 });
      return;
    }

    // Memorizza i dati di checkout nel CartService
    this.cartService.setCheckoutData(this.productsInCart, this.cart.totalPrice);
    
    // Naviga alla pagina di checkout
    this.router.navigate(['/checkout']);
  }
}
