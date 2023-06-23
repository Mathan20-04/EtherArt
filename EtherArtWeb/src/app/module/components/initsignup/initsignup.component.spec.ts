import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitsignupComponent } from './initsignup.component';

describe('InitsignupComponent', () => {
  let component: InitsignupComponent;
  let fixture: ComponentFixture<InitsignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitsignupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitsignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
