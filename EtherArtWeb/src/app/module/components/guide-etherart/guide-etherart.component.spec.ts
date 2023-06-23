import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideEtherartComponent } from './guide-etherart.component';

describe('GuideEtherartComponent', () => {
  let component: GuideEtherartComponent;
  let fixture: ComponentFixture<GuideEtherartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuideEtherartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideEtherartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
