import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Shippo } from 'shippo';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  
  private apiUrl = 'https://api.goshippo.com';
  private apiKey = environment.api_key_header;
  private shippoAccountId = environment.shippoAccountId;

  constructor(private http: HttpClient) {}

  // Metodo per creare una spedizione
  async createShipment(shipmentData: any): Promise<any> {
    const headers = new HttpHeaders({
      'Authorization': `ShippoToken ${this.apiKey}`,
      'SHIPPO-ACCOUNT-ID': this.shippoAccountId,
      'Content-Type': 'application/json',
    });

    const shippo = new Shippo({ apiKeyHeader: this.apiKey });

    try {
      // Creazione dell'indirizzo di partenza
      const fromAddressResult = await shippo.addresses.create(shipmentData.address_from);
      console.log('Indirizzo di partenza creato con successo:', fromAddressResult);

      // Creazione dell'indirizzo di destinazione
      const toAddressResult = await shippo.addresses.create(shipmentData.address_to);
      console.log('Indirizzo di destinazione creato con successo:', toAddressResult);

      // Creazione del pacco e spedizione
      const shipmentRequest = {
        address_from: fromAddressResult,
        address_to: toAddressResult,
        parcels: shipmentData.parcels,
        async: false, // Può essere true o false a seconda delle esigenze
      };

      // Chiamata all'API di Shippo per creare la spedizione
      const shipmentResult = await this.http.post(`${this.apiUrl}/shipments`, shipmentRequest, { headers }).toPromise();
      console.log('Spedizione creata con successo:', shipmentResult);

      return shipmentResult;
    } catch (error) {
      console.error('Errore nella creazione della spedizione:', error);
      throw error;
    }
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
