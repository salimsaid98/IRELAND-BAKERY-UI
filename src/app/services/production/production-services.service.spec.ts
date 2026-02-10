import { TestBed } from '@angular/core/testing';

import { ProductionServicesService } from './production-services.service';

describe('ProductionServicesService', () => {
  let service: ProductionServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
