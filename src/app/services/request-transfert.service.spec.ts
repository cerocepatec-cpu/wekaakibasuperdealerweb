import { TestBed } from '@angular/core/testing';

import { RequestTransfertService } from './request-transfert.service';

describe('RequestTransfertService', () => {
  let service: RequestTransfertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestTransfertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
