import { TestBed } from '@angular/core/testing';

import { MarginsSettingsService } from './margins-settings.service';

describe('MarginsSettingsService', () => {
  let service: MarginsSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarginsSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
