import { TestBed } from '@angular/core/testing';

import { RolesServiseService } from './roles-servise.service';

describe('RolesServiseService', () => {
  let service: RolesServiseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesServiseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
