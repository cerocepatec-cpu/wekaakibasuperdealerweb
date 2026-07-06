import { TestBed } from '@angular/core/testing';

import { CreditApiService } from './credit-api.service';

describe('CreditApiService', () => {
  let service: CreditApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
