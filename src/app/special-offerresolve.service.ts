import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SpecialOffer } from './_model/specialoffer';
import { SpecialOfferService } from './_services/specialoffer.service';

@Injectable({
  providedIn: 'root',
})
export class SpecialOfferresolveService implements Resolve<SpecialOffer> {
  constructor(private specialOfferService: SpecialOfferService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<SpecialOffer> {
    const id = Number(route.paramMap.get('offerId'));

    if (id) {
      // Recupera i dettagli dell'offerta speciale dal backend
      return this.specialOfferService.getSpecialOfferById(id);
    } else {
      // Restituisce un observable di un'offerta speciale vuota.
      return of(this.getEmptySpecialOffer());
    }
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
        productImages: []
      },
    };
  }
}
