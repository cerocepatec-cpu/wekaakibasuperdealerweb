import { TestBed } from '@angular/core/testing';

import { UnitofmeasureService } from './unitofmeasure.service';

describe('UnitofmeasureService', () => {
  let service: UnitofmeasureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitofmeasureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
