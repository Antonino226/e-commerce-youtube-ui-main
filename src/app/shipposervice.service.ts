import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  
  private apiUrl = 'https://api.goshippo.com';
  private apiKey = environment.api_key_header;
  private shippoAccountId = environment.shippoAccountId;

  constructor(private http: HttpClient) {}

  // Metodo per creare una spedizione
  createShipment(shipmentData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `ShippoToken ${this.apiKey}`,
      'SHIPPO-ACCOUNT-ID': this.shippoAccountId,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.apiUrl}/shipments`, shipmentData, { headers });
  }

  // Metodo per generare un'etichetta
  createLabel(transactionId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `ShippoToken ${this.apiKey}`,
      'SHIPPO-ACCOUNT-ID': this.shippoAccountId,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/transactions/${transactionId}`, { headers });
  }

  // Metodo per salvare i dati del form (nuovo)
  saveShippingData(formData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `ShippoToken ${this.apiKey}`,
      'SHIPPO-ACCOUNT-ID': this.shippoAccountId,
      'Content-Type': 'application/json'
    });

    // Sostituisci 'your-api-endpoint' con l'URL effettivo dell'API dove salvare i dati
    return this.http.post(`${this.apiUrl}/saveShippingData`, formData, { headers });
  }
}
