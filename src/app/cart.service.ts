import { Injectable } from "@angular/core";
import { Cart } from "./_model/cart.model";
import { Product } from "./_model/product.model";
import { UserAuthService } from "./_services/user-auth.service";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = new Map<string, Cart>(); // Mappa per associare il carrello al nome utente
  private cartSubject = new BehaviorSubject<Cart | null>(null);

  constructor(private authService: UserAuthService) {}

  getCart(): Observable<Cart | null> {
    const user = this.authService.getUser();
    if (user) {
      const savedCart = this.loadCartFromLocalStorage(user.userName);
      const cart = savedCart || { userName: user.userName, products: [], totalPrice: 0, date: new Date() };
      this.cartSubject.next(cart);
    } else {
      console.error('User not logged in');
      this.cartSubject.next(null);
    }
    return this.cartSubject.asObservable();
  }

  public createCart(): void {
    const user = this.authService.getUser();
    
    if (user && user.userName) {
        const newCart: Cart = {
            userName: user.userName,   // Imposta il nome utente preso dall'authService
            products: [],              // Inizializza un array vuoto di prodotti
            totalPrice: 0,             // Inizializza il prezzo totale a 0
            date: new Date()           // Imposta la data di creazione attuale
        };

        this.cart.set(user.userName, newCart); // Aggiungi il carrello alla mappa
        this.saveCartToLocalStorage(newCart);  // Salva lo stato del carrello nel localStorage
    } else {
        console.error('User is not logged in or userName is not defined');
    }
  }

  addToCart(product: Product, quantity: number = 1): void {
    const user = this.authService.getUser();
    if (user) {
      let userCart = this.cart.get(user.userName);

      if (!userCart) {
        this.createCart(); // Crea un nuovo carrello se non esiste
        userCart = this.cart.get(user.userName);
      }

      const existingProduct = userCart?.products.find(p => p.productId === product.productId);

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        product.quantity = quantity;  // Imposta la quantità del prodotto
        userCart?.products.push(product);
      }

      if (userCart) {
        userCart.totalPrice = this.calculateTotalPrice(userCart.products);
        this.saveCartToLocalStorage(userCart); // Salva il carrello aggiornato nel localStorage
        this.cartSubject.next(userCart); // Notifica i cambiamenti
      }
    }
  }

  removeFromCart(productId: number): void {
    const user = this.authService.getUser();
    if (user) {
      const userCart = this.cart.get(user.userName);
      if (userCart) {
        userCart.products = userCart.products.filter(item => item.productId !== productId);
        userCart.totalPrice = this.calculateTotalPrice(userCart.products);
        this.cart.set(user.userName, userCart);
        this.saveCartToLocalStorage(userCart); // Salva il carrello aggiornato nel localStorage
        this.cartSubject.next(userCart); // Notifica i cambiamenti
      }
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    const user = this.authService.getUser();
    if (user) {
      const userCart = this.cart.get(user.userName);
      if (userCart) {
        const product = userCart.products.find(p => p.productId === productId);
        if (product) {
          product.quantity = quantity;
          userCart.totalPrice = this.calculateTotalPrice(userCart.products);
          this.cart.set(user.userName, userCart);
          this.saveCartToLocalStorage(userCart); // Salva il carrello aggiornato nel localStorage
          this.cartSubject.next(userCart); // Notifica i cambiamenti
        }
      }
    }
  }

  clearCart(): void {
    const user = this.authService.getUser();
    if (user) {
      const clearedCart: Cart = {
        userName: user.userName,
        products: [],
        totalPrice: 0,
        date: new Date()
      };
      this.cart.set(user.userName, clearedCart);
      this.saveCartToLocalStorage(clearedCart); // Salva il carrello vuoto nel localStorage
      this.cartSubject.next(clearedCart); // Notifica i cambiamenti
    }
  }

  private calculateTotalPrice(products: Product[]): number {
    return products.reduce((total, product) => total + product.productDiscountedPrice * product.quantity, 0);
  }

  private saveCartToLocalStorage(cart: Cart): void {
    localStorage.setItem('cart_' + cart.userName, JSON.stringify(cart));
  }
  
  private loadCartFromLocalStorage(userName: string): Cart | null {
    const savedCart = localStorage.getItem('cart_' + userName);
    return savedCart ? JSON.parse(savedCart) : null;
  }

  getCartObservable(): Observable<Cart | null> {
    return this.cartSubject.asObservable();
  }

  private checkoutDataSubject = new BehaviorSubject<{ products: Product[], totalAmount: number } | null>(null);

  // Memorizza i dati di checkout
  setCheckoutData(products: Product[], totalAmount: number): void {
    this.checkoutDataSubject.next({ products, totalAmount });
  }

  // Recupera i dati di checkout
  getCheckoutData(): Observable<{ products: Product[], totalAmount: number } | null> {
    return this.checkoutDataSubject.asObservable();
  }
}
