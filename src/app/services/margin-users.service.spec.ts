import { TestBed } from '@angular/core/testing';

import { MarginUsersService } from './margin-users.service';

describe('MarginUsersService', () => {
  let service: MarginUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarginUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
