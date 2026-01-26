import { TestBed } from '@angular/core/testing';

import { OrderItemsServicesService } from './order-items-services.service';

describe('OrderItemsServicesService', () => {
  let service: OrderItemsServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderItemsServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
