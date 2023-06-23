import { TestBed } from '@angular/core/testing';

import { SharedDataServiceService } from './shared-data-service.service';

describe('SharedDataServiceService', () => {
  let service: SharedDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
