import { TestBed } from '@angular/core/testing';

import { ConversionMoneysService } from './conversion-moneys.service';

describe('ConversionMoneysService', () => {
  let service: ConversionMoneysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConversionMoneysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
