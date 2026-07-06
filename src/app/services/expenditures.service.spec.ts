import { TestBed } from '@angular/core/testing';

import { ExpendituresService } from './expenditures.service';

describe('ExpendituresService', () => {
  let service: ExpendituresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpendituresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
