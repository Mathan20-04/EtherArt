import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MomentoComponent } from './momento.component';

describe('MomentoComponent', () => {
  let component: MomentoComponent;
  let fixture: ComponentFixture<MomentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MomentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MomentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
