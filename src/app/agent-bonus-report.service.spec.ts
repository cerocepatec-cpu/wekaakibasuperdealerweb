import { TestBed } from '@angular/core/testing';

import { AgentBonusReportService } from './agent-bonus-report.service';

describe('AgentBonusReportService', () => {
  let service: AgentBonusReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentBonusReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
