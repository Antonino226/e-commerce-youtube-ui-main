import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpecialOffer } from '../_model/specialoffer';
@Injectable({
  providedIn: 'root'
})
export class SpecialOfferService {

  private apiUrl = 'http://localhost:9090/specialoffers';  // Update the URL to match your API endpoint

  constructor(private http: HttpClient) { }

  getSpecialOffers(): Observable<SpecialOffer[]> {
    return this.http.get<SpecialOffer[]>(`${this.apiUrl}/all`);
  }

  getSpecialOfferById(offerId: number): Observable<SpecialOffer> {
    return this.http.get<SpecialOffer>(`${this.apiUrl}/${offerId}`);
  }

  addSpecialOffer(SpecialOffer: SpecialOffer): Observable<SpecialOffer> {
    return this.http.post<SpecialOffer>(this.apiUrl, SpecialOffer);
  }

  updateSpecialOffer(offerId: number, SpecialOffer: SpecialOffer): Observable<SpecialOffer> {
    return this.http.put<SpecialOffer>(`${this.apiUrl}/${offerId}`, SpecialOffer);
  }

  deleteSpecialOffer(offerId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${offerId}`);
  }
}
