import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutlistComponent } from './payoutlist.component';

describe('PayoutlistComponent', () => {
  let component: PayoutlistComponent;
  let fixture: ComponentFixture<PayoutlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayoutlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
