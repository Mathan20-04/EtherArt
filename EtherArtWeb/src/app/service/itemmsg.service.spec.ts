import { TestBed } from '@angular/core/testing';

import { ItemmsgService } from './itemmsg.service';

describe('ItemmsgService', () => {
  let service: ItemmsgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemmsgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
