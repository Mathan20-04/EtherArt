import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateHousePriceComponent } from './update-house-price.component';

describe('UpdateHousePriceComponent', () => {
  let component: UpdateHousePriceComponent;
  let fixture: ComponentFixture<UpdateHousePriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateHousePriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateHousePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
