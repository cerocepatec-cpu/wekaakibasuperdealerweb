import { TestBed } from '@angular/core/testing';

import { MemberstransactionsService } from './memberstransactions.service';

describe('MemberstransactionsService', () => {
  let service: MemberstransactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemberstransactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
