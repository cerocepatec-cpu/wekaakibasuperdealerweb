import { TestBed } from '@angular/core/testing';

import { CustomerpickerService } from './customerpicker.service';

describe('CustomerpickerService', () => {
  let service: CustomerpickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerpickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
