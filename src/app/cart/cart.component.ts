import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
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
    private imageProcessingService: ImageProcessingService
  ) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.getCartObservable()
      .pipe(
        map(cart => {
          if (cart && cart.products) {
            // Applica l'elaborazione delle immagini a ciascun prodotto nel carrello
            cart.products = cart.products.map(product => this.imageProcessingService.createImagesProduct(product));
          }
          return cart;
        }),
        catchError(error => {
          this.errorMessage = 'Error loading cart. Please try again later.';
          this.loading = false;
          return of(null);  // Return a null cart on error
        })
      )
      .subscribe(cart => {
        this.cart = cart || null;
        this.productsInCart = cart?.products || [];
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }
  
  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  proceedToCheckout(): void {
    if (!this.authService.isLoggedIn()) {
      alert('Please log in to proceed with checkout.');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.cart || this.cart.products.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    this.router.navigate(['/checkout']);
  }
}
