import { TestBed } from '@angular/core/testing';

import { PayoutService } from './payout.service';

describe('PayoutService', () => {
  let service: PayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
