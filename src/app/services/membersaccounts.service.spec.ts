import { TestBed } from '@angular/core/testing';

import { MembersaccountsService } from './membersaccounts.service';

describe('MembersaccountsService', () => {
  let service: MembersaccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MembersaccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
