import { TestBed } from '@angular/core/testing';

import { MyaccountService } from './myaccount.service';

describe('MyaccountService', () => {
  let service: MyaccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyaccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
