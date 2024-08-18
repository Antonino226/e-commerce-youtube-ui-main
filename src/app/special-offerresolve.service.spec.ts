import { TestBed } from '@angular/core/testing';

import { SpecialOfferresolveService } from './special-offerresolve.service';

describe('SpecialOfferresolveServiceService', () => {
  let service: SpecialOfferresolveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecialOfferresolveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
