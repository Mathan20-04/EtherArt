import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnedItemComponent } from './owned-item.component';

describe('OwnedItemComponent', () => {
  let component: OwnedItemComponent;
  let fixture: ComponentFixture<OwnedItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnedItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
