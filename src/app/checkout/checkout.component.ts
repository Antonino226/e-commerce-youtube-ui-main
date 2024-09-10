import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Product } from '../_model/product.model';
import { CartService } from '../cart.service';
import { environment } from '../../environments/environment';
import { ICreateOrderRequest, IPayPalConfig, ITransactionItem } from 'ngx-paypal';
import { ShippingService } from '../shipposervice.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  products: Product[] = [];
  totalAmount: number = 0;
  shippingForm: FormGroup;
  public payPalConfig?: IPayPalConfig;
  showSuccess: boolean = false;
  showPayPal: boolean = false;

  constructor(private cartService: CartService,
    private fb: FormBuilder,
    private shippingService: ShippingService,
    private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.shippingForm = this.fb.group({
      recipientName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]], // Validazione per soli numeri
      email: ['', [Validators.required, Validators.email]],
      weight: ['', [Validators.required, Validators.min(0.01)]], // Peso minimo di 0.01 kg
      length: ['', [Validators.required, Validators.min(0.1)]], // Lunghezza minima di 0.1 cm
      width: ['', [Validators.required, Validators.min(0.1)]],
      height: ['', [Validators.required, Validators.min(0.1)]],
      paymentMethod: ['paypal', Validators.required]
    });
    
    this.cartService.getCheckoutData().subscribe(data => {
      if (data) {
        this.products = data.products;
        this.totalAmount = data.totalAmount;
      } else {
        console.error('No checkout data available.');
      }
    });


    console.log(this.products);
    this.initConfig();
  }


  saveFormData(formData: any): void {
    this.shippingService.saveShippingData(formData).subscribe(response => {
      console.log('Shipping data saved successfully:', response);
    }, error => {
      console.error('Error saving shipping data:', error);
    });
  }

  private initConfig(): void {
    const currency = 'EUR';
  
    const itemTotal = this.products.reduce((acc, product) => {
      return acc + (product.productActualPrice * product.quantity);
    }, 0).toFixed(2);
  
    this.totalAmount = parseFloat(itemTotal);
  
    this.payPalConfig = {
      currency: currency,
      clientId: environment.paypalClientId,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: this.totalAmount.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: currency,
                  value: itemTotal
                }
              }
            },
            items: this.products.map(x => <ITransactionItem>{
              name: x.productName,
              quantity: x.quantity.toString(),
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: currency,
                value: x.productActualPrice.toFixed(2),
              },
            })
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        this.createShipment();
        console.log('onClientAuthorization - transaction was authorized', data);
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  confirmPurchase(): void {
    console.log(this.shippingForm.value);
  
    if (this.shippingForm.invalid) {
      this.snackBar.open('Per favore, compila tutti i campi obbligatori correttamente.', 'Chiudi', { duration: 3000 });
      return;
    }
    
    this.showPayPal = true;
    this.snackBar.open('Dati di spedizione inviati con successo!', 'Chiudi', { duration: 3000 });
  }

  private createShipment(): void {
    const shippingAddress = this.shippingForm.value;
    
    const shipmentData = {
      address_from: {
        name: "Il tuo Negozio",
        street1: "Via Esempio 123",
        city: "Milano",
        postal_code: "20100",
        country: "IT",
        phone: "0202020202",
        email: "info@iltuonegozio.it"
      },
      address_to: {
        name: shippingAddress.recipientName.toString(),
        street1: shippingAddress.address.toString(),
        city: shippingAddress.city.toString(),
        postal_code: shippingAddress.postalCode.toString(),
        country: shippingAddress.country.toString(),
        phone: shippingAddress.phone.toString(),
        email: shippingAddress.email.toString()
      },
      parcels: [
        {
          length: shippingAddress.length.toString(),
          width: shippingAddress.width.toString(),
          height: shippingAddress.height.toString(),
          distance_unit: "cm",
          weight: shippingAddress.weight.toString(),
          mass_unit: "kg"
        }
      ],
      async: false
    };
  
    this.shippingService.createShipment(shipmentData).subscribe(response => {
      const transactionId = response.transactions[0].object_id;
      this.generateLabel(transactionId);
      console.log('Spedizione creata con successo', response);
      this.snackBar.open('Spedizione creata con successo!', 'Chiudi', { duration: 3000 });
    },
    error => {
      console.error('Errore nella creazione della spedizione', error);
      this.snackBar.open('Errore nella creazione della spedizione. Per favore, riprova.', 'Chiudi', { duration: 3000 });
    });
  }
  

  private generateLabel(transactionId: string): void {
    this.shippingService.createLabel(transactionId).subscribe(labelResponse => {
      const labelUrl = labelResponse.label_url;
      window.open(labelUrl, '_blank');  // Apri l'etichetta per la stampa
    });
  }
}
