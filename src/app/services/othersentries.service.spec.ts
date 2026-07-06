import { TestBed } from '@angular/core/testing';

import { OthersentriesService } from './othersentries.service';

describe('OthersentriesService', () => {
  let service: OthersentriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OthersentriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
