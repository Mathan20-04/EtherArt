import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MybidComponent } from './mybid.component';

describe('MybidComponent', () => {
  let component: MybidComponent;
  let fixture: ComponentFixture<MybidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MybidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MybidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
