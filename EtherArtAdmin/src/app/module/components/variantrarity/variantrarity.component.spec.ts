import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantrarityComponent } from './variantrarity.component';

describe('VariantrarityComponent', () => {
  let component: VariantrarityComponent;
  let fixture: ComponentFixture<VariantrarityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariantrarityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VariantrarityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
