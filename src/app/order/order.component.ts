import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../_model/order.model'; // Import your order model
import { UserAuthService } from '../_services/user-auth.service';
import { Product } from '../_model/product.model';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  products: Product[] = [];
  totalAmount: number = 0;
  order: Order;

  constructor(
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    // Recupera i prodotti dallo stato di navigazione
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['products']) {
      this.products = navigation.extras.state['products'];
      this.calculateTotalAmount();
    } else {
      this.router.navigate(['/products']); // Torna ai prodotti se non ci sono prodotti selezionati
    }
  }

  // Calcola l'importo totale
  calculateTotalAmount() {
    this.totalAmount = this.products.reduce((sum, product) => sum + product.productDiscountedPrice, 0);
  }

  // Conferma l'ordine
  confirmOrder() {
    const orderData = {
      products: this.products,
      orderAmount: this.totalAmount,
      // Aggiungi ulteriori dettagli necessari come nome, indirizzo, ecc.
    };

    this.orderService.createOrder(orderData).subscribe(
      (response) => {
        alert('Order placed successfully!');
        this.router.navigate(['/orderConfirm', response.orderId]); // Naviga alla pagina di conferma ordine
      },
      (error) => {
        console.error('Error placing order:', error);
        alert('Failed to place order. Please try again.');
      }
    );
  }
}
