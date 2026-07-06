import { TestBed } from '@angular/core/testing';

import { TransactionFeeServiceService } from './transaction-fee-service.service';

describe('TransactionFeeServiceService', () => {
  let service: TransactionFeeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionFeeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
