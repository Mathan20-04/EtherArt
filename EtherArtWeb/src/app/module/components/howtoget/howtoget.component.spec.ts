import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowtogetComponent } from './howtoget.component';

describe('HowtogetComponent', () => {
  let component: HowtogetComponent;
  let fixture: ComponentFixture<HowtogetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowtogetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HowtogetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
