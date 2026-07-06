import { TestBed } from '@angular/core/testing';

import { MemberfirstentriesService } from './memberfirstentries.service';

describe('MemberfirstentriesService', () => {
  let service: MemberfirstentriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemberfirstentriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
