import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReflinkComponent } from './reflink.component';

describe('ReflinkComponent', () => {
  let component: ReflinkComponent;
  let fixture: ComponentFixture<ReflinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReflinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReflinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
