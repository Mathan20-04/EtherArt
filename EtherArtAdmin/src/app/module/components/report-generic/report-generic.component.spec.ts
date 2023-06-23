import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportGenericComponent } from './report-generic.component';

describe('ReportGenericComponent', () => {
  let component: ReportGenericComponent;
  let fixture: ComponentFixture<ReportGenericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportGenericComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
