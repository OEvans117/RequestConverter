import { TestBed } from '@angular/core/testing';

import { RcapiService } from './rcapi.service';

describe('RcapiService', () => {
  let service: RcapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RcapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
