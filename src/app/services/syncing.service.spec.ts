import { TestBed } from '@angular/core/testing';

import { SyncingService } from './syncing.service';

describe('SyncingService', () => {
  let service: SyncingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
