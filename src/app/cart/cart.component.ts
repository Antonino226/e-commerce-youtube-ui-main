import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  displayedColumns: string[] = ['Name', 'Description', 'Price', 'Discounted Price', 'Action'];

  cartDetails: any[] = [];

  constructor(private productService: ProductService,
    private router: Router) { }

  ngOnInit(): void {
    this.getCartDetails();
  }

  delete(cartId) {
    this.productService.deleteCartItem(cartId).subscribe(
      (resp) => {
        this.getCartDetails();
      }, (err) => {
        
      }
    );
  }

  getCartDetails() {
    this.productService.getCartDetails().subscribe(
      (response:any[]) => {
        this.cartDetails = response;
      },
      (error) => {
        
      }
    );
  }

  checkout() {
    
    this.router.navigate(['/buyProduct', {
      isSingleProductCheckout: false, id: 0
    }]);
  }
}
