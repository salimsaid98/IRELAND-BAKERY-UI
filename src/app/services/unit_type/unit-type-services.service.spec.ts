import { TestBed } from '@angular/core/testing';

import { UnitTypeServicesService } from './unit-type-services.service';

describe('UnitTypeServicesService', () => {
  let service: UnitTypeServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitTypeServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
