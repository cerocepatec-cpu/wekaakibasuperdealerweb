import { TestBed } from '@angular/core/testing';

import { ServantsService } from './servants.service';

describe('ServantsService', () => {
  let service: ServantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
