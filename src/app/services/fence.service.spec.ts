import { TestBed } from '@angular/core/testing';

import { FenceService } from './fence.service';

describe('FenceService', () => {
  let service: FenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
