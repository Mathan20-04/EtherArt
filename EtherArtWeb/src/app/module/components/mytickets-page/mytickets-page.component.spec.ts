import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyticketsPageComponent } from './mytickets-page.component';

describe('MyticketsPageComponent', () => {
  let component: MyticketsPageComponent;
  let fixture: ComponentFixture<MyticketsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyticketsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyticketsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
